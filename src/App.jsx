import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { addExpense, addIncome, getExpenses, getIncomes, getCategories } from "./services/api";
import TransactionModal from "./components/TransactionModal";
import Navbar from "./components/Navbar";

// Auth & Services
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import { findExpenseSheet, createExpenseSheet, checkAndFixSheetIds } from "./services/googleSheetsService";

// Pages
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

function AppContent() {
  const { user, logout, loading: authLoading, gapiInitialized } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState({ expenses: [], incomes: [] });
  const [loading, setLoading] = useState(true);
  const [initializingSheet, setInitializingSheet] = useState(false);
  const [sheetStatus, setSheetStatus] = useState("");

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "₹");

  // Modal State
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

  // Initialize Data Flow
  useEffect(() => {
    const initData = async () => {
      // Wait for Auth and GAPI
      if (authLoading || !user || !gapiInitialized) return;

      setInitializingSheet(true);
      setSheetStatus("Connecting to Google Drive...");

      try {

        // 2. data sync logic starts here
        let sheetId = await findExpenseSheet();

        if (!sheetId) {
          setSheetStatus("Creating new personal sheet...");
          // If no sheet found, creating new one
          if (window.confirm("No 'My_Finance_Data' sheet found. Create a new one in your Google Drive?")) {
            sheetId = await createExpenseSheet();
          } else {
            // User cancelled, maybe logged in wrong account
            setInitializingSheet(false);
            setLoading(false);
            return;
          }
        } else {
          setSheetStatus("Verifying data integrity...");
          // Check for missing IDs in legacy sheets
          await checkAndFixSheetIds(sheetId);
        }

        // Store sheet ID for API calls
        localStorage.setItem("spreadsheet_id", sheetId);

        setSheetStatus("Syncing expenses...");
        await refreshData();
      } catch (error) {
        console.error("Initialization error:", error);
        // Handle 401 Unauthorized (Expired Token)
        if (error.status === 401 || (error.result && error.result.error && error.result.error.code === 401)) {
          console.log("Session expired, logging out...");
          logout();
        } else {
          alert("Failed to sync with Google Drive. See console for details.");
        }
      } finally {
        setInitializingSheet(false);
        setLoading(false);
      }
    };

    initData();
  }, [user, authLoading, gapiInitialized]);

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

  const handleTransaction = async (data) => {
    const { type, ...formData } = data;
    type === "expense" ? await addExpense(formData) : await addIncome(formData);
    setTimeout(refreshData, 1500);
  };

  if (authLoading) return null; // Or a splash screen

  if (!user) {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
    return <LoginScreen />;
  }

  if (initializingSheet || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-24 h-24 bg-indigo-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute w-16 h-16 bg-indigo-500/40 rounded-full animate-ping"></div>
        <div className="relative w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg z-10 animate-scale-in">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 animate-fade-in text-center">
        {initializingSheet ? "Setting up..." : "Syncing Profile"}
      </h2>
      <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse text-sm">
        {initializingSheet ? sheetStatus : "Just a moment..."}
      </p>
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
                  userName={user?.name || "User"}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}