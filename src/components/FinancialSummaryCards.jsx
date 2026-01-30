import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";

export default function FinancialSummaryCards({ expenses, incomes, totalExpenses, totalIncome }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Calculate metrics
    const netFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netFlow / totalIncome) * 100).toFixed(1) : 0;

    // Calculate average daily spending (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentExpenses = expenses.filter(row => new Date(row[1]) >= thirtyDaysAgo);
    const recentTotal = recentExpenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
    const avgDaily = (recentTotal / 30).toFixed(0);

    // Find highest expense category
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
            value: `${savingsRate}%`,
            icon: Wallet,
            color: savingsRate > 20 ? "text-green-600 bg-green-100" : "text-orange-600 bg-orange-100",
            trend: savingsRate > 20 ? "Good" : "Improve"
        },
        {
            label: "Avg Daily Spending",
            value: `₹${avgDaily}`,
            icon: Calendar,
            color: "text-blue-600 bg-blue-100"
        },
        {
            label: "Top Category",
            value: topCategory ? topCategory[0] : "N/A",
            subValue: topCategory ? `₹${topCategory[1].toLocaleString()}` : "",
            icon: TrendingUp,
            color: "text-purple-600 bg-purple-100"
        },
        {
            label: "Net Flow",
            value: `₹${Math.abs(netFlow).toLocaleString()}`,
            icon: netFlow >= 0 ? TrendingUp : TrendingDown,
            color: netFlow >= 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100",
            trend: netFlow >= 0 ? "Surplus" : "Deficit"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500">{card.label}</span>
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                        {card.subValue && <div className="text-xs text-gray-500 mt-1">{card.subValue}</div>}
                        {card.trend && (
                            <div className="text-xs mt-2 font-medium" style={{ color: card.color.split(' ')[0].replace('text-', '') }}>
                                {card.trend}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
