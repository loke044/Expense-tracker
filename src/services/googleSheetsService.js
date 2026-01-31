
const SPREADSHEET_NAME = "My_Finance_Data";

// Find existing sheet in user's Drive
export const findExpenseSheet = async () => {
    try {
        // 1. Validated Cache: Check if we have a stored ID and if it is valid
        const storedId = localStorage.getItem("spreadsheet_id");
        if (storedId) {
            try {
                // Verify if it still exists and isn't trashed
                await window.gapi.client.drive.files.get({
                    fileId: storedId,
                    fields: 'trashed'
                });
                return storedId;
            } catch (e) {
                console.warn("Stored sheet ID is invalid or missing, searching Drive...", e);
                localStorage.removeItem("spreadsheet_id");
            }
        }

        // 2. Search Drive
        const query = `name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
        const response = await window.gapi.client.drive.files.list({
            q: query,
            spaces: 'drive',
            fields: 'files(id, name)',
        });

        const files = response.result.files;
        if (files && files.length > 0) {
            return files[0].id;
        }
        return null;
    } catch (error) {
        console.error("Error finding sheet:", error);
        throw error;
    }
};

// Create a new sheet with 3 tabs: Expenditure, Income, Categories
export const createExpenseSheet = async () => {
    try {
        const resource = {
            properties: {
                title: SPREADSHEET_NAME,
            },
            sheets: [
                { properties: { title: "Expenditure" } },
                { properties: { title: "Income" } },
                { properties: { title: "Categories" } }
            ]
        };

        const response = await window.gapi.client.sheets.spreadsheets.create({
            resource,
        });

        const spreadsheetId = response.result.spreadsheetId;

        // Headers
        // Note: ID column is crucial for auto-generating IDs
        const txnHeaders = ["ID", "Date", "Amount", "Description", "Category"];
        const catHeaders = ["Category", "Icon", "Type"];

        // Initial Categories Data
        const defaultCategories = [
            ["Food", "🍔", "expense"],
            ["Transport", "🚗", "expense"],
            ["Shopping", "🛍️", "expense"],
            ["Entertainment", "🎬", "expense"],
            ["Bills", "💡", "expense"],
            ["Health", "💊", "expense"],
            ["Investments", "📈", "expense"],
            ["Lend", "🤝", "expense"],
            ["Salary", "💰", "income"],
            ["Business", "💼", "income"],
            ["Freelance", "💻", "income"],
            ["Investments", "📈", "income"],
            ["Return(Lend)", "🤝", "income"]
        ];

        // Batch Update Headers and Data
        await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            resource: {
                valueInputOption: "RAW",
                data: [
                    { range: "Expenditure!A1:E1", values: [txnHeaders] },
                    { range: "Income!A1:E1", values: [txnHeaders] },
                    { range: "Categories!A1:C1", values: [catHeaders] },
                    { range: "Categories!A2:C15", values: defaultCategories }
                ]
            }
        });

        return spreadsheetId;
    } catch (error) {
        console.error("Error creating sheet:", error);
        throw error;
    }
};

// Check if sheet has IDs and fix if needed (Runs on both Expenditure and Income)
// ALSO: Checks if tabs exist and creates them if missing (Auto-Repair)
export const checkAndFixSheetIds = async (spreadsheetId) => {
    try {
        // 1. Get existing sheet titles
        const meta = await window.gapi.client.sheets.spreadsheets.get({
            spreadsheetId,
            fields: 'sheets(properties(title))'
        });
        const existingTitles = meta.result.sheets.map(s => s.properties.title);

        const requiredSheets = [
            { title: "Expenditure", headers: ["ID", "Date", "Amount", "Description", "Category"] },
            { title: "Income", headers: ["ID", "Date", "Amount", "Description", "Category"] },
            { title: "Categories", headers: ["Category", "Icon", "Type"] }
        ];

        const requests = [];
        const dataUpdates = [];

        // 2. Prepare requests to create missing sheets
        for (const reqSheet of requiredSheets) {
            if (!existingTitles.includes(reqSheet.title)) {
                requests.push({
                    addSheet: {
                        properties: { title: reqSheet.title }
                    }
                });
            }
        }

        // 3. Execute Create Sheet Requests
        if (requests.length > 0) {
            await window.gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: { requests }
            });
            console.log(`Created ${requests.length} missing sheets.`);

            // 4. Queue Header Updates for newly created sheets
            for (const reqSheet of requiredSheets) {
                if (!existingTitles.includes(reqSheet.title)) {
                    dataUpdates.push({
                        range: `${reqSheet.title}!A1`,
                        values: [reqSheet.headers]
                    });

                    // Add default categories if creating Categories sheet
                    if (reqSheet.title === "Categories") {
                        const defaultCategories = [
                            ["Food", "🍔", "expense"],
                            ["Transport", "🚗", "expense"],
                            ["Shopping", "🛍️", "expense"],
                            ["Entertainment", "🎬", "expense"],
                            ["Bills", "💡", "expense"],
                            ["Health", "💊", "expense"],
                            ["Investments", "📈", "expense"],
                            ["Lend", "🤝", "expense"],
                            ["Salary", "💰", "income"],
                            ["Business", "💼", "income"],
                            ["Freelance", "💻", "income"],
                            ["Investments", "📈", "income"],
                            ["Return(Lend)", "🤝", "income"]
                        ];
                        dataUpdates.push({
                            range: "Categories!A2",
                            values: defaultCategories
                        });
                    }
                }
            }
        }

        // 5. Execute Data Updates (Headers + Defaults)
        if (dataUpdates.length > 0) {
            await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                spreadsheetId,
                resource: {
                    valueInputOption: "RAW",
                    data: dataUpdates
                }
            });
        }

        // 6. NOW Proceed to Fix IDs on Expenditure and Income
        const sheetsToFix = ["Expenditure", "Income"];

        for (const sheetName of sheetsToFix) {
            // Read all data
            const response = await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:E`,
            });

            const rows = response.result.values;
            if (!rows || rows.length <= 1) continue;

            const updates = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                // ID is at index 0. If missing, generate it.
                if (!row[0] || row[0] === "") {
                    const newId = crypto.randomUUID();
                    updates.push({
                        range: `${sheetName}!A${i + 1}`,
                        values: [[newId]]
                    });
                }
            }

            if (updates.length > 0) {
                const data = updates.map(u => ({
                    range: u.range,
                    values: u.values
                }));

                await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId,
                    resource: {
                        valueInputOption: "RAW",
                        data
                    }
                });
                console.log(`Fixed ${updates.length} missing IDs in ${sheetName}.`);
            }
        }

    } catch (error) {
        console.error("Error ensuring sheet structure:", error);
    }
};
