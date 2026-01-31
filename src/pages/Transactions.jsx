import { useState, useMemo } from "react";
import TransactionTile from "../components/TransactionTile";
import { Filter, Calendar as MyCalendar, X } from "lucide-react";
import { deleteTransaction } from "../services/api";
import {
    isToday,
    isThisWeek,
    isThisMonth,
    isThisYear,
    isWithinInterval,
    parseISO,
    startOfDay,
    endOfDay,
    format
} from "date-fns";

export default function Transactions({ expenses, incomes, setModal, refreshData, categories }) {
    const [currentTab, setCurrentTab] = useState("all"); // "all", "expense", "income"
    const [filterCategory, setFilterCategory] = useState("all");
    const [dateMode, setDateMode] = useState("all"); // all, today, thisWeek, thisMonth, thisYear, customDate, customRange
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper to find icon
    const getIcon = (catName, type) => {
        const list = type === "expense" ? categories.expenses : categories.incomes;
        const cat = list.find(c => c.name === catName);
        return cat ? cat.icon : "";
    };

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setFilterCategory("all"); // Reset category when tab changes
    };

    // Memoize the filtering and sorting to prevent heavy re-calcs on every render
    const { filtered, combinedWithBalance } = useMemo(() => {
        // Combine and Tag Data
        let allTransactions = [
            ...expenses.map(e => ({ ...e, _type: "expense", raw: e })),
            ...incomes.map(i => ({ ...i, _type: "income", raw: i }))
        ];

        // 1. Sort Date Ascending to Calculate Running Balance
        allTransactions.sort((a, b) => new Date(a.raw[1]) - new Date(b.raw[1]));

        // 2. Calculate Balance
        let runningBalance = 0;
        const combined = allTransactions.map(item => {
            const amount = parseFloat(String(item.raw[2]).replace(/[^0-9.-]+/g, "")) || 0;
            if (item._type === "income") {
                runningBalance += amount;
            } else {
                runningBalance -= amount;
            }
            return { ...item, _balance: runningBalance };
        });

        // 3. Reverse for Display (Newest First)
        const displayData = [...combined].reverse();

        // Filtering
        const filteredData = displayData.filter(item => {
            const itemDate = new Date(item.raw[1]);

            // Tab Filtering (formerly filterType)
            const matchesTab = currentTab === "all" || item._type === currentTab;

            // Category Filtering (only for single-type tabs)
            const matchesCategory = currentTab === "all" ? true : (filterCategory === "all" || item.raw[4] === filterCategory);

            let matchesDate = true;
            if (dateMode === "today") {
                matchesDate = isToday(itemDate);
            } else if (dateMode === "thisWeek") {
                matchesDate = isThisWeek(itemDate);
            } else if (dateMode === "thisMonth") {
                matchesDate = isThisMonth(itemDate);
            } else if (dateMode === "thisYear") {
                matchesDate = isThisYear(itemDate);
            } else if (dateMode === "customDate" && startDate) {
                matchesDate = format(itemDate, 'yyyy-MM-dd') === startDate;
            } else if (dateMode === "customRange" && startDate && endDate) {
                const start = startOfDay(parseISO(startDate));
                const end = endOfDay(parseISO(endDate));
                matchesDate = isWithinInterval(itemDate, { start, end });
            }

            return matchesTab && matchesDate && matchesCategory;
        });

        return { filtered: filteredData, combinedWithBalance: combined };
    }, [expenses, incomes, currentTab, filterCategory, dateMode, startDate, endDate]);

    const handleDelete = async (item) => {
        if (!window.confirm("Are you sure you want to delete this transaction?") || isDeleting) return;

        setIsDeleting(true);
        try {
            const id = item.raw[0];
            await deleteTransaction(item._type, id);
            setTimeout(() => refreshData(), 1000);
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (item) => {
        const dateObj = new Date(item.raw[1]);
        const formattedDate = dateObj.toISOString().split('T')[0];

        setModal({
            isOpen: true,
            type: item._type,
            editMode: true,
            transactionId: item.raw[0],
            initialData: {
                date: formattedDate,
                amount: item.raw[2],
                description: item.raw[3],
                category: item.raw[4]
            }
        });
    };

    // Get categories for the dropdown based on currentTab
    const availableCategories = currentTab === "expense" ? categories.expenses : categories.incomes;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto w-full h-[calc(100vh-80px)] flex flex-col transition-colors pb-24 md:pb-8">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">Transactions</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Manage your history.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setModal({ isOpen: true, type: "expense" })}
                        className="flex-1 md:flex-none justify-center px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition active:scale-95 transform flex items-center gap-2"
                    >
                        - Expense
                    </button>
                    <button
                        onClick={() => setModal({ isOpen: true, type: "income" })}
                        className="flex-1 md:flex-none justify-center px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition active:scale-95 transform flex items-center gap-2"
                    >
                        + Income
                    </button>
                </div>
            </header>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6 w-full overflow-x-auto">
                {[
                    { id: "all", label: "All Transactions" },
                    { id: "expense", label: "Expenses" },
                    { id: "income", label: "Income" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-4 md:px-8 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${currentTab === tab.id
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                            }`}
                    >
                        {tab.label}
                        {currentTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* FILTERS */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 space-y-4 transition-colors animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">
                        <Filter size={18} className="text-indigo-600" />
                        <span>Filter By:</span>
                    </div>

                    {/* Category Filter (ONLY FOR EXPENSE/INCOME TABS) */}
                    {currentTab !== "all" && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300 w-full md:w-auto">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full md:w-auto px-3 py-1.5 bg-gray-100 dark:bg-slate-900 border-none rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="all">All {currentTab === 'expense' ? 'Expenses' : 'Income'} Categories</option>
                                {availableCategories.map((cat, idx) => (
                                    <option key={idx} value={cat.name}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Quick Period Filter */}
                    <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
                        {[
                            { id: "all", label: "All" },
                            { id: "today", label: "Today" },
                            { id: "thisWeek", label: "Week" },
                            { id: "thisMonth", label: "Month" },
                            { id: "thisYear", label: "Year" },
                            { id: "customDate", label: "Date" },
                            { id: "customRange", label: "Range" }
                        ].map(period => (
                            <button
                                key={period.id}
                                onClick={() => {
                                    setDateMode(period.id);
                                    if (period.id !== 'customDate' && period.id !== 'customRange') {
                                        setStartDate("");
                                        setEndDate("");
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-1 md:flex-none ${dateMode === period.id ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conditional Custom Inputs */}
                {(dateMode === 'customDate' || dateMode === 'customRange') && (
                    <div className="flex flex-wrap items-center gap-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <MyCalendar size={18} className="text-gray-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full md:w-auto px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {dateMode === 'customRange' && (
                            <>
                                <span className="text-gray-400 text-sm font-bold hidden md:inline">To</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full md:w-auto px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </>
                        )}

                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors ml-auto md:ml-0"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-24 md:pb-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 animate-fade-in">
                        <Filter size={48} className="mb-4 opacity-10" />
                        <p className="text-lg font-medium">No transactions found.</p>
                        <button
                            onClick={() => {
                                handleTabChange("all");
                                setDateMode("all");
                                setStartDate("");
                                setEndDate("");
                            }}
                            className="mt-4 text-indigo-600 font-bold hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    filtered.map((item, idx) => (
                        <div key={idx} className="animate-slide-up" style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s` }}>
                            <TransactionTile
                                item={item.raw}
                                type={item._type}
                                balance={item._balance}
                                emoji={getIcon(item.raw[4], item._type)}
                                onDelete={() => handleDelete(item)}
                                onEdit={() => handleEdit(item)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
