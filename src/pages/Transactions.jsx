import { useState } from "react";
import TransactionTile from "../components/TransactionTile";
import { Filter } from "lucide-react";

export default function Transactions({ expenses, incomes, setModal }) {
    const [filterType, setFilterType] = useState("all"); // all, expense, income
    const [dateFilter, setDateFilter] = useState(""); // YYYY-MM format

    // Combine and Tag Data
    const allTransactions = [
        ...expenses.map(e => ({ ...e, _type: "expense", raw: e })),
        ...incomes.map(i => ({ ...i, _type: "income", raw: i }))
    ];

    // Sorting: Date Descending
    allTransactions.sort((a, b) => new Date(b.raw[1]) - new Date(a.raw[1]));

    // Filtering
    const filtered = allTransactions.filter(item => {
        const itemDate = new Date(item.raw[1]);
        const matchesType = filterType === "all" || item._type === filterType;

        let matchesDate = true;
        if (dateFilter) {
            const [y, m] = dateFilter.split("-");
            matchesDate = itemDate.getFullYear() === parseInt(y) && (itemDate.getMonth() + 1) === parseInt(m);
        }

        return matchesType && matchesDate;
    });

    const handleDelete = (item) => {
        // Placeholder logic for now
        alert("Delete functionality requires backend API update.");
    };

    const handleEdit = (item) => {
        // Placeholder logic for now
        alert("Edit functionality requires backend API update.");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto w-full h-[calc(100vh-80px)] flex flex-col">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Transactions</h1>
                    <p className="text-gray-500">Manage your history.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setModal({ isOpen: true, type: "expense" })}
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2"
                    >
                        - Expense
                    </button>
                    <button
                        onClick={() => setModal({ isOpen: true, type: "income" })}
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 transition flex items-center gap-2"
                    >
                        + Income
                    </button>
                </div>
            </header>

            {/* FILTERS */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Filter size={20} />
                    <span>Filters:</span>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {["all", "expense", "income"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filterType === type ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <input
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {dateFilter && (
                    <button onClick={() => setDateFilter("")} className="text-xs text-red-500 underline">
                        Clear Date
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-20">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No transactions found.</div>
                ) : (
                    filtered.map((item, idx) => (
                        <TransactionTile
                            key={idx}
                            item={item.raw}
                            type={item._type}
                            onDelete={() => handleDelete(item)}
                            onEdit={() => handleEdit(item)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
