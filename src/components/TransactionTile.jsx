import { formatDateCell } from "../utils/formatDate";
import { formatNumber } from "../utils/formatNumber";
import { Trash2, Edit2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function TransactionTile({ item, type, balance, onDelete, onEdit, emoji }) {
    // Data format assumed:[id, date, amount, description, category]

    const date = formatDateCell(item[1]);
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    const amount = parseVal(item[2]);
    const description = item[3] || "No Description";
    const category = item[4] || "Uncategorized";
    const isExpense = type === "expense";

    const currency = localStorage.getItem("currency") || "₹";

    return (
        <div className="group relative bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            {/* Icon & Info */}
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isExpense ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}>
                    {isExpense ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {emoji && <span>{emoji}</span>}
                        {category}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{description} • {date}</p>
                </div>
            </div>

            {/* Amount & Actions */}
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-4">
                    <span className={`font-bold text-lg ${isExpense ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                        {isExpense ? "-" : "+"}{currency}{formatNumber(amount)}
                    </span>

                    {/* Actions (visible on hover) */}
                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(item)} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(item)} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                {balance !== undefined && (
                    <span className="text-xs font-medium text-gray-400">
                        Bal: {currency}{formatNumber(balance)}
                    </span>
                )}
            </div>
        </div>
    );
}
