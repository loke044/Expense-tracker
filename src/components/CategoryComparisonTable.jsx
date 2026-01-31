import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function CategoryComparisonTable({ expenses, currency, categories }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    const getIcon = (catName) => {
        const list = categories?.expenses || [];
        const cat = list.find(c => c.name === catName);
        return cat ? cat.icon : "";
    };

    // ... (rest logic same)
    const allMonths = new Set();
    expenses.forEach(row => {
        const date = new Date(row[1]);
        if (!isNaN(date.getTime())) {
            allMonths.add(`${date.getFullYear()}-${date.getMonth()}`);
        }
    });

    const totalMonthsCount = allMonths.size || 1;
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

    const categoryOverallTotal = {};
    const categoryThisMonthTotal = {};
    const allCategories = new Set();

    expenses.forEach(row => {
        const amount = parseVal(row[2]);
        const category = row[4] || "Others";
        const date = new Date(row[1]);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        allCategories.add(category);
        categoryOverallTotal[category] = (categoryOverallTotal[category] || 0) + amount;

        if (monthKey === currentMonthKey) {
            categoryThisMonthTotal[category] = (categoryThisMonthTotal[category] || 0) + amount;
        }
    });

    const comparisonData = Array.from(allCategories).map(cat => {
        const overallTotal = categoryOverallTotal[cat] || 0;
        const overallAvg = overallTotal / totalMonthsCount;
        const thisMonth = categoryThisMonthTotal[cat] || 0;

        return {
            category: cat,
            overallTotal,
            overallAvg,
            thisMonth
        };
    }).sort((a, b) => b.overallTotal - a.overallTotal);

    const getRowColor = (thisMonth, avg) => {
        if (thisMonth > avg * 1.2) return "text-red-600 dark:text-red-400";
        if (thisMonth < avg * 0.8) return "text-green-600 dark:text-green-400";
        return "text-gray-800 dark:text-gray-100";
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mt-8 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-600 dark:text-indigo-400" />
                Category Spending: Overall vs Monthly
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Overall Spend</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Avg Spend</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">This Month Spend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {comparisonData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                <td className="py-3 px-4 flex items-center gap-2">
                                    {getIcon(row.category) ? (
                                        <span className="text-lg">{getIcon(row.category)}</span>
                                    ) : (
                                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-400"></span>
                                    )}
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{row.category}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                    {currency}{row.overallTotal.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                    {currency}{row.overallAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </td>
                                <td className={`py-3 px-4 text-right font-bold ${getRowColor(row.thisMonth, row.overallAvg)}`}>
                                    {currency}{row.thisMonth.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                * Based on {totalMonthsCount} month(s) of data activity.
            </p>
        </div>
    );
}
