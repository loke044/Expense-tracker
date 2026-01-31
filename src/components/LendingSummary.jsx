import { Users, TrendingDown, DollarSign } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";

export default function LendingSummary({ expenses, incomes }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
    const currency = localStorage.getItem("currency") || "₹";

    // Calculate total lent (expenses with category "lend")
    const totalLent = expenses
        .filter(row => String(row[4]).toLowerCase() === "lend")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);

    // Calculate total returned (incomes with category "Return(lend)")
    const totalReturned = incomes
        .filter(row => String(row[4]).toLowerCase() === "return(lend)")
        .reduce((sum, row) => sum + parseVal(row[2]), 0);

    const remaining = totalLent - totalReturned;

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-900/30 mb-8 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Users size={24} className="text-purple-600 dark:text-purple-400" />
                Lending Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Lent */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Lent</span>
                        <TrendingDown size={18} className="text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {currency}{formatNumber(totalLent)}
                    </div>
                </div>

                {/* Total Returned */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Returned</span>
                        <TrendingDown size={18} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {currency}{formatNumber(totalReturned)}
                    </div>
                </div>

                {/* Remaining */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-2 border-purple-300 dark:border-purple-900/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding</span>
                        <DollarSign size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currency}{formatNumber(remaining)}
                    </div>
                    {remaining > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            To be recovered
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
