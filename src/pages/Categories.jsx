import { useState } from "react";
import { Trash2, Plus, Smile, Edit2, X, Check } from "lucide-react";
import { addCategory, deleteCategory } from "../services/api";

export default function Categories({ categories, refreshData }) {
    const [newCat, setNewCat] = useState("");
    const [emoji, setEmoji] = useState("");
    const [tab, setTab] = useState("expense"); // expense | income
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editEmoji, setEditEmoji] = useState("");
    const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Common emoji categories
    const commonEmojis = {
        expense: [
            // Food & Drink
            "🍔", "🍕", "🌮", "🥗", "🍱", "🍣", "🧁", "🍎", "🍓", "🥑", "🥦", "🍦", "🍩", "🍷", "🍺", "☕", "🍵",
            // Transport
            "🚗", "🚕", "🚌", "🚄", "✈️", "🚲", "🛴", "🚢", "⛽", "🚦", "🚆", "🏍️",
            // Home & Utilities
            "🏠", "🏢", "🛋️", "🛏️", "🧹", "🚿", "🔑", "🕯️", "🏡", "🪑", "⚡", "💧", "📶", "🛒", "👨‍👩‍👧‍👦",
            // Entertainment
            "🎬", "🎮", "🎸", "🎟️", "🎳", "🎨", "🎪", "🎰", "📺", "🎧", "🎭", "🎲",
            // Health & Personal
            "💊", "🚑", "🩹", "🏋️", "🏃‍♀️", "🧘‍♂️", "🏥", "🩺", "💇", "🧖‍♀️", "🧴",
            // Shopping & Styles
            "👕", "👗", "👟", "👜", "💄", "💍", "🌂", "👔", "🛍️", "📦",
            // Education & Tech
            "🎓", "📚", "📱", "💻", "⌚", "📷", "💡", "🔬", "🖨️",
            // Other
            "🐾", "🌳", "💐", "🎈", "🎁", "✉️", "🔨", "🔥", "🧾", "🤝", "🗂️"
        ],
        income: [
            "💰", "💵", "💸", "🪙", "💳", "🏦", "🏧", "💼", "📈", "📊", "🏆", "🎁", "🤝", "⭐", "🎯", "💪", "🔥",
            "💎", "💍", "⚖️", "📢", "🛠️", "🚜", "🌾", "💻", "⌨️", "🖱️", "🔌", "💹", "💼", "👨‍👩‍👧‍👦", "🔁", "📈", "🎁", "💰"
        ]
    };

    const currentList = tab === "expense" ? categories.expenses : categories.incomes;
    const emojiList = commonEmojis[tab];

    const handleAdd = async () => {
        if (!newCat.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            // Save name and icon separately
            await addCategory(tab, newCat.trim(), emoji);
            setNewCat("");
            setEmoji("");
            setShowEmojiPicker(false);
            setTimeout(() => refreshData(), 1000);
        } catch (error) {
            console.error("Error adding category:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (catObj) => {
        if (!window.confirm(`Delete category "${catObj.name}"?`) || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await deleteCategory(tab, catObj.name);
            setTimeout(() => refreshData(), 1000);
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (oldCatObj, newName, newEmoji) => {
        if (!newName.trim() || isSubmitting) {
            setEditingIndex(null);
            return;
        }

        // If nothing changed, just close
        if (oldCatObj.name === newName.trim() && oldCatObj.icon === newEmoji) {
            setEditingIndex(null);
            return;
        }

        setIsSubmitting(true);
        try {
            // Delete old and add new with updated name and icon
            await deleteCategory(tab, oldCatObj.name);
            await addCategory(tab, newName.trim(), newEmoji);
            setEditingIndex(null);
            setTimeout(() => refreshData(), 1000);
        } catch (error) {
            console.error("Error editing category:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto w-full transition-colors">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Categories</h1>
                <p className="text-gray-500 dark:text-gray-400">Customize your spending labels with icons.</p>
            </header>

            <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl w-max mb-8">
                <button
                    onClick={() => setTab("expense")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "expense" ? "bg-white dark:bg-slate-800 text-red-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        }`}
                >
                    Expense Categories
                </button>
                <button
                    onClick={() => setTab("income")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === "income" ? "bg-white dark:bg-slate-800 text-green-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        }`}
                >
                    Income Categories
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
                {/* ADD INPUT */}
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1 flex gap-3">
                            {/* Emoji Input with Picker */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    placeholder="icon"
                                    maxLength={2}
                                    className="w-20 px-3 py-3 text-center text-2xl rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                />
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600"
                                    title="Pick an icon"
                                >
                                    <Smile size={16} />
                                </button>
                                {/* Emoji Picker Dropdown */}
                                {showEmojiPicker && (
                                    <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50 w-64">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Pick an icon</span>
                                            <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                                            {emojiList.map((em, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setEmoji(em);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="text-2xl hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg p-2 transition"
                                                >
                                                    {em}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={newCat}
                                onChange={(e) => setNewCat(e.target.value)}
                                placeholder={`Category name...`}
                                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={isSubmitting}
                            className={`px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <Plus size={20} /> {isSubmitting ? "Adding..." : "Add"}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Smile size={14} />
                        Click the icon field to pick from common symbols
                    </p>
                </div>

                {/* LIST */}
                <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                    {currentList.length === 0 ? (
                        <li className="p-8 text-center text-gray-400 italic">No categories found.</li>
                    ) : (
                        currentList.map((catObj, idx) => (
                            <li key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                {editingIndex === idx ? (
                                    // Edit Mode
                                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-indigo-50/50 dark:bg-indigo-900/10 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            {/* Edit Emoji Picker */}
                                            <div className="relative flex items-center">
                                                <input
                                                    type="text"
                                                    value={editEmoji}
                                                    onChange={(e) => setEditEmoji(e.target.value)}
                                                    placeholder="icon"
                                                    maxLength={2}
                                                    className="w-16 h-12 text-center text-xl bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                                />
                                                <button
                                                    onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)}
                                                    className="absolute -right-2 -top-2 p-1 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-gray-400 hover:text-indigo-600 shadow-sm z-10"
                                                    title="Pick an icon"
                                                >
                                                    <Smile size={14} />
                                                </button>

                                                {showEditEmojiPicker && (
                                                    <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 z-[100] w-64">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Change icon</span>
                                                            <button onClick={() => setShowEditEmojiPicker(false)} className="text-gray-400 hover:text-gray-600">
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                                                            <button
                                                                onClick={() => { setEditEmoji(""); setShowEditEmojiPicker(false); }}
                                                                className="text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg p-2"
                                                            >
                                                                None
                                                            </button>
                                                            {emojiList.map((em, eIdx) => (
                                                                <button
                                                                    key={eIdx}
                                                                    onClick={() => {
                                                                        setEditEmoji(em);
                                                                        setShowEditEmojiPicker(false);
                                                                    }}
                                                                    className="text-2xl hover:bg-white dark:hover:bg-slate-900 hover:scale-125 rounded-lg p-2 transition-transform"
                                                                >
                                                                    {em}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-indigo-300 dark:border-indigo-900/50 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-800 dark:text-white min-w-[120px]"
                                                autoFocus
                                                onKeyPress={(e) => e.key === 'Enter' && handleEdit(catObj, editValue, editEmoji)}
                                            />
                                        </div>

                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                onClick={() => handleEdit(catObj, editValue, editEmoji)}
                                                disabled={isSubmitting}
                                                className={`p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                                title="Save Changes"
                                            >
                                                {isSubmitting ? <span className="animate-spin text-white">...</span> : <Check size={20} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingIndex(null);
                                                    setShowEditEmojiPicker(false);
                                                }}
                                                className="p-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition shadow-sm"
                                                title="Cancel"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-center gap-3">
                                            {catObj.icon && <span className="text-2xl">{catObj.icon}</span>}
                                            <span className="font-medium text-gray-700 dark:text-white text-lg">{catObj.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingIndex(idx);
                                                    setEditValue(catObj.name);
                                                    setEditEmoji(catObj.icon || "");
                                                    setShowEditEmojiPicker(false);
                                                }}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(catObj)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
