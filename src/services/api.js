const BASE_URL = "https://script.google.com/macros/s/AKfycbxT08TxFypsejUkTj3upYPwVRIL0r1-hFdbBp69AUHtFAsN8ViuTMsGpYDxGXO699ivww/exec";

// GET requests - Switching to fetch to avoid CORS/Redirect issues with Axios
export const getExpenses = async () => {
  const res = await fetch(`${BASE_URL}?action=expenses`);
  return res.json();
};

export const getIncomes = async () => {
  const res = await fetch(`${BASE_URL}?action=incomes`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}?action=categories`);
  return res.json();
};

// POST Helper
const post = async (action, payload) => {
  return await fetch(BASE_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({
      action,
      ...payload,
    }),
  });
};

export const addExpense = async (payload) => post("addExpense", payload);
export const addIncome = async (payload) => post("addIncome", payload);

export const editTransaction = async (type, id, payload) => post("editTransaction", { type, id, ...payload });
export const deleteTransaction = async (type, id) => post("deleteTransaction", { type, id });

export const addCategory = async (type, category, icon = "") => post("addCategory", { type, category, icon });
export const deleteCategory = async (type, category) => post("deleteCategory", { type, category });