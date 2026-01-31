// Google Sheets API Service
// Now updated for Multi-Sheet Structure: Expenditure, Income, Categories

const getSheetId = () => localStorage.getItem("spreadsheet_id");

// Helper to clean values
const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

// DATE HELPERS
const toISODate = (dateStr) => {
  if (!dateStr) return "";
  const cleanStr = String(dateStr).trim();
  if (cleanStr.match(/^\d{4}-\d{2}-\d{2}$/)) return cleanStr;

  if (cleanStr.includes("/")) {
    const parts = cleanStr.split("/").map(p => p.trim());
    if (parts.length === 3) {
      // [dd, mm, yyyy] -> yyyy-mm-dd
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return cleanStr;
};

const toIndianDate = (isoDate) => {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    // [yyyy, mm, dd] -> dd/mm/yyyy
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
};

// READ: Get all data from a specific sheet
const getData = async (sheetName) => {
  const spreadsheetId = getSheetId();
  if (!spreadsheetId) throw new Error("No spreadsheet ID found");

  const response = await window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:E`, // A to E (ID, Date, Amount, Description, Category)
  });

  return response.result.values || [];
};

// WRITE: Append row to a specific sheet
const addRow = async (sheetName, row) => {
  const spreadsheetId = getSheetId();
  const id = crypto.randomUUID();
  const values = [[id, ...row]]; // [ID, Date, Amount, Description, Category]

  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: "RAW",
    resource: { values },
  });
  return id;
};

// UPDATE: Delete row from a specific sheet
const deleteRowById = async (sheetName, id) => {
  const spreadsheetId = getSheetId();
  const allData = await getData(sheetName);

  const rowIndex = allData.findIndex(row => row[0] === id);
  if (rowIndex === -1) return;

  // Get Sheet ID (GID) for the tab
  const meta = await window.gapi.client.sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(sheetId,title))'
  });
  const sheet = meta.result.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) return;
  const sheetGid = sheet.properties.sheetId;

  await window.gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetGid,
            dimension: "ROWS",
            startIndex: rowIndex + 2, // +1 for 1-based index, +1 for header row
            endIndex: rowIndex + 3
          }
        }
      }]
    }
  });
};

// --- EXPORTS ---

export const getExpenses = async () => {
  const rows = await getData("Expenditure");
  // [ID, Date, Amount, Description, Category] -> add "expense" type
  return rows.map(r => {
    const [id, date, amount, desc, cat] = r;
    return [id, toISODate(date), amount, desc, cat, "expense"];
  });
};

export const getIncomes = async () => {
  const rows = await getData("Income");
  // [ID, Date, Amount, Description, Category] -> add "income" type
  return rows.map(r => {
    const [id, date, amount, desc, cat] = r;
    return [id, toISODate(date), amount, desc, cat, "income"];
  });
};

export const getCategories = async () => {
  // Read from "Categories" sheet
  // Columns: [Category, Icon, Type]
  try {
    const spreadsheetId = getSheetId();
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Categories!A2:C`,
    });
    const rows = response.result.values || [];

    const expenses = [];
    const incomes = [];

    rows.forEach(row => {
      const [name, icon, type] = row;
      if (type === "expense") expenses.push({ name, icon });
      if (type === "income") incomes.push({ name, icon });
    });

    // Fallback default if sheet is empty (though it shouldn't be)
    if (expenses.length === 0 && incomes.length === 0) {
      return {
        expenses: [{ name: "Food", icon: "🍔" }],
        incomes: [{ name: "Salary", icon: "💰" }]
      };
    }

    return { expenses, incomes };
  } catch (e) {
    console.error("Error fetching categories:", e);
    return { expenses: [], incomes: [] };
  }
};

export const addExpense = async (data) => {
  // [Date, Amount, Description, Category]
  await addRow("Expenditure", [
    toIndianDate(data.date),
    data.amount,
    data.description,
    data.category
  ]);
};

export const addIncome = async (data) => {
  await addRow("Income", [
    toIndianDate(data.date),
    data.amount,
    data.description,
    data.category
  ]);
};

export const deleteTransaction = async (type, id) => {
  const sheetName = type === "expense" ? "Expenditure" : "Income";
  await deleteRowById(sheetName, id);
};

// --- Category Management (Bonus: Now we CAN persist categories) ---
export const addCategory = async (type, category, icon) => {
  const spreadsheetId = getSheetId();
  // Append to Categories sheet: [Category, Icon, Type]
  await window.gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `Categories!A:C`,
    valueInputOption: "RAW",
    resource: { values: [[category, icon, type]] },
  });
};

export const deleteCategory = async (type, category) => {
  // Naively delete by matching Name + Type
  // (Implementation omitted for brevity as UI doesn't fully support custom cat deletion yet)
  console.log("Delete category not fully implemented in this update.");
};

export const editTransaction = async (type, id, data) => {
  const sheetName = type === "expense" ? "Expenditure" : "Income";
  const spreadsheetId = getSheetId();
  const allData = await getData(sheetName);
  const rowIndex = allData.findIndex(row => row[0] === id);
  if (rowIndex === -1) return;

  // Range matches A(rowIndex+2) to E(rowIndex+2)
  const range = `${sheetName}!A${rowIndex + 2}:E${rowIndex + 2}`;
  const values = [[
    id, // Keep same ID
    data.date,
    data.amount,
    data.description,
    data.category
  ]];

  await window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: { values }
  });
};