import axios from "axios";

const BASE_URL = "https://script.google.com/macros/s/AKfycbx2uFASe-lZZmUBa7J-nL_8e7gOwi_UbF407w9GH9TWZBSoBH7X9-xl9b-3fQJie0031A/exec";

// GET requests work fine with Axios
export const getExpenses = async () => {
  const res = await axios.get(`${BASE_URL}?action=expenses`);
  return res.data;
};

export const getIncomes = async () => {
  const res = await axios.get(`${BASE_URL}?action=incomes`);
  return res.data;
};

// POST requests use fetch + text/plain to bypass CORS "Preflight"
export const addExpense = async (payload) => {
  return await fetch(BASE_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({
      action: "addExpense",
      ...payload,
    }),
  });
};

export const addIncome = async (payload) => {
  return await fetch(BASE_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({
      action: "addIncome",
      ...payload,
    }),
  });
};