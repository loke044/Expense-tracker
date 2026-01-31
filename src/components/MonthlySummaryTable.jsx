import { Calendar, TrendingUp } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";

export default function MonthlySummaryTable({ expenses, incomes, currency }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            year: d.getFullYear(),
            month: d.getMonth() + 1
        });
    }

    // Calculate starting balance (ALL transactions before the 6-month window)
    const firstMonthDate = new Date(months[0].year, months[0].month - 1, 1);

    const historicalExpenses = expenses.filter(row => new Date(row[1]) < firstMonthDate);
    const historicalIncomes = incomes.filter(row => new Date(row[1]) < firstMonthDate);

    const historicalExpenseTotal = historicalExpenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
    const historicalIncomeTotal = historicalIncomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

    const startingBalance = historicalIncomeTotal - historicalExpenseTotal;

    // Calculate monthly data
    const monthlyData = months.map(m => {
        // Filter expenses for this month
        const monthExpenses = expenses.filter(row => {
            const date = new Date(row[1]);
            return date.getFullYear() === m.year && (date.getMonth() + 1) === m.month;
        });

        // Filter incomes for this month
        const monthIncomes = incomes.filter(row => {
            const date = new Date(row[1]);
            return date.getFullYear() === m.year && (date.getMonth() + 1) === m.month;
        });

        const totalExpense = monthExpenses.reduce((sum, row) => sum + parseVal(row[2]), 0);
        const totalIncome = monthIncomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

        return {
            month: m.label,
            expense: totalExpense,
            income: totalIncome,
            net: totalIncome - totalExpense
        };
    });

    // Calculate cumulative closing balance starting from historical balance
    let runningBalance = startingBalance;
    monthlyData.forEach(data => {
        runningBalance += data.net;
        data.closingBalance = runningBalance;
    });

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-indigo-600 dark:text-indigo-400" />
                Monthly Summary
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Month</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Income</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Expense</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Net</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {monthlyData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{row.month}</td>
                                <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                                    {currency}{formatNumber(row.income)}
                                </td>
                                <td className="py-3 px-4 text-right text-red-600 dark:text-red-400 font-medium">
                                    {currency}{formatNumber(row.expense)}
                                </td>
                                <td className={`py-3 px-4 text-right font-semibold ${row.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {row.net >= 0 ? '+' : ''}{currency}{formatNumber(row.net)}
                                </td>
                                <td className={`py-3 px-4 text-right font-bold text-lg ${row.closingBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {currency}{formatNumber(row.closingBalance)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Current Balance: <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {currency}{formatNumber(monthlyData[monthlyData.length - 1]?.closingBalance || 0)}
                    </span>
                </span>
            </div>
        </div>
    );
}
