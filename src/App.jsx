import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addExpense, addIncome, getExpenses, getIncomes } from "./services/api";
import TransactionModal from "./components/TransactionModal";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";

const BASE_URL = "https://script.google.com/macros/s/AKfycbx2uFASe-lZZmUBa7J-nL_8e7gOwi_UbF407w9GH9TWZBSoBH7X9-xl9b-3fQJie0031A/exec";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState({ expenses: [], incomes: [] });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "expense" });

  const refreshData = async () => {
    const [exp, inc] = await Promise.all([getExpenses(), getIncomes()]);
    setExpenses(exp || []);
    setIncomes(inc || []);
  };

  useEffect(() => {
    const init = async () => {
      const [exp, inc, catRes] = await Promise.all([
        getExpenses(), getIncomes(), axios.get(`${BASE_URL}?action=categories`)
      ]);
      setExpenses(exp || []);
      setIncomes(inc || []);
      setCategories(catRes.data || { expenses: [], incomes: [] });
      setLoading(false);
    };
    init();
  }, []);

  const handleTransaction = async (data) => {
    const { type, ...formData } = data;
    type === "expense" ? await addExpense(formData) : await addIncome(formData);
    setTimeout(refreshData, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-50 text-indigo-600">Syncing Financial Data...</div>;

  const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
  const totalExpenses = expenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
  const totalIncome = incomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-gray-900">
        <Navbar />

        <main className="flex-1 overflow-y-auto max-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  expenses={expenses}
                  incomes={incomes}
                  totalExpenses={totalExpenses}
                  totalIncome={totalIncome}
                  setModal={setModal}
                />
              }
            />
            <Route
              path="/analysis"
              element={
                <Analysis
                  expenses={expenses}
                  incomes={incomes}
                  totalExpenses={totalExpenses}
                  totalIncome={totalIncome}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <Transactions
                  expenses={expenses}
                  incomes={incomes}
                  setModal={setModal}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <Categories categories={categories} />
              }
            />
          </Routes>
        </main>

        <TransactionModal
          isOpen={modal.isOpen}
          type={modal.type}
          categories={categories}
          onClose={() => setModal({ ...modal, isOpen: false })}
          onSubmit={handleTransaction}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;