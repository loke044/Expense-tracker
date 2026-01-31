import { useEffect } from "react";
import { formatDateCell } from "../utils/formatDate";
import { formatNumber } from "../utils/formatNumber";
import StatCard from "../components/StatCard";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, Users } from "lucide-react";

export default function Home({ expenses, incomes, totalExpenses, totalIncome, setModal, userName, currency, categories }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Helper to find icon
    const getIcon = (catName, type) => {
        const list = type === "expense" ? (categories?.expenses || []) : (categories?.incomes || []);
        const cat = list.find(c => c.name === catName);
        return cat ? cat.icon : "";
    };

    useEffect(() => {
        document.title = "My Finance - Dashboard";
    }, []);

    // ... (rest of calculations same)
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

    const totalLent = expenses.filter(row => String(row[4]).toLowerCase() === "lend")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);
    const totalReturned = incomes.filter(row => String(row[4]).toLowerCase() === "return(lend)")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);
    const lendingOutstanding = totalLent - totalReturned;

    const totalInvestments = expenses.filter(row => {
        const cat = String(row[4] || "").toLowerCase();
        return cat === "investments" || cat === "investment";
    }).reduce((sum, row) => sum + parseVal(row[2]), 0);

    const allTransactions = [
        ...expenses.map(e => ({ ...e, type: 'expense', date: new Date(e[1]) })),
        ...incomes.map(i => ({ ...i, type: 'income', date: new Date(i[1]) }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full transition-colors pb-24 md:pb-8">
            {/* HEADER */}
            <header className="mb-8 animate-fade-in">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase text-xs font-bold tracking-widest">
                    Welcome back, {userName}!
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Here's your financial overview.</p>
            </header>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-up">
                <button
                    onClick={() => setModal({ isOpen: true, type: "expense" })}
                    className="flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <ArrowDownRight size={24} />
                    <span className="text-lg">Add Expense</span>
                </button>
                <button
                    onClick={() => setModal({ isOpen: true, type: "income" })}
                    className="flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <ArrowUpRight size={24} />
                    <span className="text-lg">Add Income</span>
                </button>
            </div>

            {/* MAIN STATS - 5 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                {/* Total Balance */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <Wallet size={28} />
                        <span className="text-sm font-medium opacity-90">Overall</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{currency}{formatNumber(balance)}</div>
                    <div className="text-sm opacity-90">Total Balance</div>
                </div>

                {/* Total Income */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-green-200 dark:border-green-900/30 hover:shadow-md transition animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <ArrowUpRight size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{currency}{formatNumber(totalIncome)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Income</div>
                </div>

                {/* Total Expenses */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-red-200 dark:border-red-900/30 hover:shadow-md transition animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <ArrowDownRight size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{currency}{formatNumber(totalExpenses)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</div>
                </div>

                {/* Total Investments */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-blue-200 dark:border-blue-900/30 hover:shadow-md transition animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{currency}{formatNumber(totalInvestments)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Investments</div>
                </div>

                {/* Savings Rate */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 border-purple-200 dark:border-purple-900/30 hover:shadow-md transition animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-400">Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{formatNumber(savingsRate, 1)}%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</div>
                </div>
            </div>

            {/* THIS MONTH + LENDING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                {/* This Month Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar size={22} className="text-indigo-600 dark:text-indigo-400" />
                        This Month
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{currency}{formatNumber(thisMonthIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">{currency}{formatNumber(thisMonthExpenses)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Daily Spending</span>
                            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                {currency}{formatNumber(thisMonthExpenses / new Date().getDate(), 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lending Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-6 rounded-xl shadow-sm border-2 border-purple-200 dark:border-purple-900/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Users size={22} className="text-purple-600 dark:text-purple-400" />
                        Lending Summary
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Lent</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">{currency}{formatNumber(totalLent)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Returned</span>
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">{currency}{formatNumber(totalReturned)}</span>
                        </div>
                        <div className="h-px bg-purple-200 dark:bg-purple-900/30 my-2"></div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-300 dark:border-purple-900/50">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Outstanding</span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{currency}{formatNumber(lendingOutstanding)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                    {allTransactions.length > 0 ? (
                        allTransactions.map((txn, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition hover:-translate-y-1 transform duration-200">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        {txn.type === 'income' ?
                                            <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" /> :
                                            <ArrowDownRight size={16} className="text-red-600 dark:text-red-400" />
                                        }
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-white">{txn[3] || 'No description'}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {getIcon(txn[4], txn.type) && <span className="mr-1">{getIcon(txn[4], txn.type)}</span>}
                                            {txn[4]} • {formatDateCell(txn.date)}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-bold ${txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {txn.type === 'income' ? '+' : '-'}{currency}{formatNumber(parseVal(txn[2]))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">No transactions yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
