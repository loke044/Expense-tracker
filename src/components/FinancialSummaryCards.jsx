import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";

export default function FinancialSummaryCards({ expenses, incomes, totalExpenses, totalIncome, currency }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // ... (rest logic same)
    const netFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netFlow / totalIncome) * 100).toFixed(1) : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentExpenses = expenses.filter(row => new Date(row[1]) >= thirtyDaysAgo);
    const recentTotal = recentExpenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
    const avgDaily = formatNumber(recentTotal / 30, 0);

    const categoryTotals = {};
    expenses.forEach(row => {
        const amount = parseVal(row[2]);
        const category = row[4] || "Others";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    const topCategory = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)[0];

    const cards = [
        {
            label: "Savings Rate",
            value: `${formatNumber(savingsRate, 1)}%`,
            icon: Wallet,
            color: savingsRate > 20 ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
            trend: savingsRate > 20 ? "Good" : "Improve"
        },
        {
            label: "Avg Daily Spending",
            value: `${currency}${avgDaily}`,
            icon: Calendar,
            color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        },
        {
            label: "Top Category",
            value: topCategory ? topCategory[0] : "N/A",
            subValue: topCategory ? `${currency}${formatNumber(topCategory[1])}` : "",
            icon: TrendingUp,
            color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
        },
        {
            label: "Net Flow",
            value: `${currency}${formatNumber(Math.abs(netFlow))}`,
            icon: netFlow >= 0 ? TrendingUp : TrendingDown,
            color: netFlow >= 0 ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
            trend: netFlow >= 0 ? "Surplus" : "Deficit"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</div>
                        {card.subValue && <div className="text-xs text-gray-400 mt-1">{card.subValue}</div>}
                        {card.trend && (
                            <div className={`text-xs mt-2 font-medium ${card.color.split(' ')[0]}`}>
                                {card.trend}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
