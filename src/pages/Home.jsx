import StatCard from "../components/StatCard";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, Users } from "lucide-react";

export default function Home({ expenses, incomes, totalExpenses, totalIncome, setModal }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Calculate this month's data
    const now = new Date();
    const thisMonthExpenses = expenses.reduce((sum, row) => {
        const rowDate = new Date(row[1]);
        const amount = parseVal(row[2]);
        const category = String(row[4] || "").toLowerCase();
        const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
        const isNotLend = category !== "lend";
        if (isThisMonth && isNotLend) return sum + amount;
        return sum;
    }, 0);

    const thisMonthIncome = incomes.reduce((sum, row) => {
        const rowDate = new Date(row[1]);
        const amount = parseVal(row[2]);
        const category = String(row[4] || "").toLowerCase();
        const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
        const isNotReturnLend = category !== "return(lend)";
        if (isThisMonth && isNotReturnLend) return sum + amount;
        return sum;
    }, 0);

    // Lending data
    const totalLent = expenses.filter(row => String(row[4]).toLowerCase() === "lend")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);
    const totalReturned = incomes.filter(row => String(row[4]).toLowerCase() === "return(lend)")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);
    const lendingOutstanding = totalLent - totalReturned;

    // Recent transactions (last 5)
    const allTransactions = [
        ...expenses.map(e => ({ ...e, type: 'expense', date: new Date(e[1]) })),
        ...incomes.map(i => ({ ...i, type: 'income', date: new Date(i[1]) }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your financial overview.</p>
            </header>

            {/* QUICK ACTIONS - MOVED TO TOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setModal({ isOpen: true, type: "expense" })}
                    className="flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <ArrowDownRight size={24} />
                    <span className="text-lg">Add Expense</span>
                </button>
                <button
                    onClick={() => setModal({ isOpen: true, type: "income" })}
                    className="flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <ArrowUpRight size={24} />
                    <span className="text-lg">Add Income</span>
                </button>
            </div>

            {/* MAIN STATS - 4 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Total Balance */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-3">
                        <Wallet size={28} />
                        <span className="text-sm font-medium opacity-90">Overall</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">₹{balance.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Total Balance</div>
                </div>

                {/* Total Income */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-green-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <ArrowUpRight size={20} className="text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">₹{totalIncome.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Income</div>
                </div>

                {/* Total Expenses */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-red-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <ArrowDownRight size={20} className="text-red-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">₹{totalExpenses.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Expenses</div>
                </div>

                {/* Savings Rate */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-purple-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{savingsRate}%</div>
                    <div className="text-sm text-gray-500">Savings Rate</div>
                </div>
            </div>

            {/* THIS MONTH + LENDING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* This Month Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar size={22} className="text-indigo-600" />
                        This Month
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Income</span>
                            <span className="text-lg font-bold text-green-600">₹{thisMonthIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Expenses</span>
                            <span className="text-lg font-bold text-red-600">₹{thisMonthExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Avg Daily Spending</span>
                            <span className="text-lg font-bold text-orange-600">
                                ₹{(thisMonthExpenses / new Date().getDate()).toFixed(0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lending Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={22} className="text-purple-600" />
                        Lending Summary
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Lent</span>
                            <span className="text-lg font-semibold text-gray-800">₹{totalLent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Returned</span>
                            <span className="text-lg font-semibold text-green-600">₹{totalReturned.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-purple-200 my-2"></div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border-2 border-purple-300">
                            <span className="text-sm font-bold text-gray-700">Outstanding</span>
                            <span className="text-xl font-bold text-purple-600">₹{lendingOutstanding.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                    {allTransactions.length > 0 ? (
                        allTransactions.map((txn, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {txn.type === 'income' ?
                                            <ArrowUpRight size={16} className="text-green-600" /> :
                                            <ArrowDownRight size={16} className="text-red-600" />
                                        }
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{txn[3] || 'No description'}</div>
                                        <div className="text-xs text-gray-500">{txn[4]} • {txn.date.toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'income' ? '+' : '-'}₹{parseVal(txn[2]).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-6">No transactions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
