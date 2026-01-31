import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addExpense, addIncome, getExpenses, getIncomes, getCategories } from "./services/api";
import TransactionModal from "./components/TransactionModal";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState({ expenses: [], incomes: [] });
  const [loading, setLoading] = useState(true);
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "₹");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "expense" });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const refreshData = async () => {
    const [exp, inc, cat] = await Promise.all([
      getExpenses(),
      getIncomes(),
      getCategories()
    ]);
    setExpenses(exp || []);
    setIncomes(inc || []);
    setCategories(cat || { expenses: [], incomes: [] });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [exp, inc, cat] = await Promise.all([
          getExpenses(),
          getIncomes(),
          getCategories()
        ]);
        setExpenses(exp || []);
        setIncomes(inc || []);
        setCategories(cat || { expenses: [], incomes: [] });
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleTransaction = async (data) => {
    const { type, ...formData } = data;
    type === "expense" ? await addExpense(formData) : await addIncome(formData);
    setTimeout(refreshData, 1500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-xl font-bold bg-slate-50 dark:bg-slate-900 text-indigo-600 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        Syncing Financial Data...
      </div>
    </div>
  );

  const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
  const totalExpenses = expenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
  const totalIncome = incomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
                  userName={userName}
                  currency={currency}
                  categories={categories}
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
                  theme={theme}
                  currency={currency}
                  categories={categories}
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
                  refreshData={refreshData}
                  categories={categories}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <Categories
                  categories={categories}
                  refreshData={refreshData}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  theme={theme}
                  setTheme={setTheme}
                />
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
          editMode={modal.editMode}
          transactionId={modal.transactionId}
          initialData={modal.initialData}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;