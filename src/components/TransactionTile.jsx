import { Trash2, Edit2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function TransactionTile({ item, type, onDelete, onEdit }) {
    // Data format assumed: [id, date, amount, description, category]  <-- based on reading App.jsx usage
    // Actually, App.jsx uses: row[1] (date), row[2] (amount), row[4] (category)
    // Let's inspect App.jsx data structure more closely or assume standard Google Sheets array:
    // [Unique ID, Date, Amount, Description, Category]

    const date = new Date(item[1]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const amount = parseFloat(item[2]);
    const description = item[3] || "No Description";
    const category = item[4] || "Uncategorized";

    const isExpense = type === "expense";

    return (
        <div className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-between">
            {/* Icon & Info */}
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isExpense ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {isExpense ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">{category}</h4>
                    <p className="text-xs text-gray-500">{description} • {date}</p>
                </div>
            </div>

            {/* Amount & Actions */}
            <div className="flex items-center gap-4">
                <span className={`font-bold text-lg ${isExpense ? "text-red-600" : "text-green-600"}`}>
                    {isExpense ? "-" : "+"}₹{amount.toLocaleString()}
                </span>

                {/* Actions (visible on hover) */}
                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
