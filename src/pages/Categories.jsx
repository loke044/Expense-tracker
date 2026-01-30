import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

export default function Categories({ categories }) {
    const [newCat, setNewCat] = useState("");
    const [tab, setTab] = useState("expense"); // expense | income

    const currentList = tab === "expense" ? categories.expenses : categories.incomes;

    const handleAdd = () => {
        if (!newCat.trim()) return;
        alert(`Adding "${newCat}" to ${tab} categories requires backend API support.`);
        setNewCat("");
    };

    const handleDelete = (cat) => {
        alert(`Deleting "${cat}" requires backend API support.`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Categories</h1>
                <p className="text-gray-500">Customize your spending labels.</p>
            </header>

            <div className="flex bg-gray-100 p-1 rounded-xl w-max mb-8">
                <button
                    onClick={() => setTab("expense")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "expense" ? "bg-white text-red-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Expense Categories
                </button>
                <button
                    onClick={() => setTab("income")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "income" ? "bg-white text-green-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Income Categories
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* ADD INPUT */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                    <input
                        type="text"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        placeholder={`New ${tab} category...`}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </div>

                {/* LIST */}
                <ul className="divide-y divide-gray-100">
                    {currentList.length === 0 ? (
                        <li className="p-8 text-center text-gray-400 italic">No categories found.</li>
                    ) : (
                        currentList.map((cat, idx) => (
                            <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <span className="font-medium text-gray-700 text-lg capitalize">{cat}</span>
                                <button
                                    onClick={() => handleDelete(cat)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
