import { Users, TrendingDown, DollarSign } from "lucide-react";

export default function LendingSummary({ expenses, incomes }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

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
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={24} className="text-purple-600" />
                Lending Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Lent */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Lent</span>
                        <TrendingDown size={18} className="text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        ₹{totalLent.toLocaleString()}
                    </div>
                </div>

                {/* Total Returned */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Returned</span>
                        <TrendingDown size={18} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{totalReturned.toLocaleString()}
                    </div>
                </div>

                {/* Remaining */}
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">Outstanding</span>
                        <DollarSign size={18} className="text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                        ₹{remaining.toLocaleString()}
                    </div>
                    {remaining > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            To be recovered
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
