import { useEffect, useState } from "react";
import axios from "axios";
import { addExpense, addIncome, getExpenses, getIncomes } from "./services/api";
import TransactionModal from "./components/TransactionModal";
import StatCard from "./components/StatCard";
import ExpenseChart from "./components/ExpenseChart";
import IncomeChart from "./components/IncomeChart";
import ComparisonChart from "./components/ComparisonChart";

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

  if (loading) return <div className="p-10 text-center font-bold">Syncing...</div>;

  const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
  const totalExpenses = expenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
  const totalIncome = incomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-8">
          Expense Tracker 💰
        </h1>

        {/* OVERALL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          <StatCard title="Total Expenses" value={totalExpenses} color="bg-red-500" />
          <StatCard title="Total Income" value={totalIncome} color="bg-green-500" />
          <StatCard title="Balance" value={totalIncome - totalExpenses} color="bg-indigo-600" />
        </div>

        {/* MONTHLY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
          <StatCard
            title="This Month Expenses"
            value={expenses.reduce((sum, row) => {
              const rowDate = new Date(row[1]); // Link to Column B (Index 1)
              const now = new Date();
              const amount = parseVal(row[2]);
              const category = String(row[4] || "").toLowerCase();

              const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
              const isNotLend = category !== "lend";

              if (isThisMonth && isNotLend) {
                return sum + amount;
              }
              return sum;
            }, 0)}
            color="bg-orange-500"
          />
          <StatCard
            title="This Month Income"
            value={incomes.reduce((sum, row) => {
              const rowDate = new Date(row[1]); // Link to Column B (Index 1)
              const now = new Date();
              const amount = parseVal(row[2]);
              const category = String(row[4] || "").toLowerCase(); // "Return(lend)"

              const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
              const isNotReturnLend = category !== "return(lend)";

              if (isThisMonth && isNotReturnLend) {
                return sum + amount;
              }
              return sum;
            }, 0)}
            color="bg-teal-500"
          />
        </div>

        {/* HORIZONTAL BUTTONS */}
        <div className="flex justify-center gap-6 my-8">
          <button
            onClick={() => setModal({ isOpen: true, type: "expense" })}
            className="px-8 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-95 transition-transform text-lg min-w-[180px]"
          >
            - Add Expense
          </button>
          <button
            onClick={() => setModal({ isOpen: true, type: "income" })}
            className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:scale-95 transition-transform text-lg min-w-[180px]"
          >
            + Add Income
          </button>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ExpenseChart expenses={expenses} />
          <IncomeChart incomes={incomes} />
          <div className="lg:col-span-2">
            <ComparisonChart income={totalIncome} expense={totalExpenses} />
          </div>
        </div>

        <TransactionModal
          isOpen={modal.isOpen}
          type={modal.type}
          categories={categories}
          onClose={() => setModal({ ...modal, isOpen: false })}
          onSubmit={handleTransaction}
        />
      </div>
    </div>
  );
}

export default App;