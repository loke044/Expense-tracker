import { Line } from "react-chartjs-2";
import { formatNumber } from "../utils/formatNumber";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AllMonthsTrendChart({ expenses, incomes, theme, currency }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
    const isDark = theme === "dark";

    // ... (rest of data logic same)
    const allDates = [
        ...expenses.map(row => new Date(row[1])),
        ...incomes.map(row => new Date(row[1]))
    ].filter(d => !isNaN(d.getTime()));

    if (allDates.length === 0) {
        return <p className="text-gray-500 text-center py-10">No data available for trend</p>;
    }

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const months = [];
    let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const last = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    while (current <= last) {
        months.push({
            key: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`,
            label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
        current.setMonth(current.getMonth() + 1);
    }

    const expenseByMonth = {};
    const incomeByMonth = {};

    expenses.forEach(row => {
        const date = new Date(row[1]);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + parseVal(row[2]);
    });

    incomes.forEach(row => {
        const date = new Date(row[1]);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + parseVal(row[2]);
    });

    const expenseData = months.map(m => expenseByMonth[m.key] || 0);
    const incomeData = months.map(m => incomeByMonth[m.key] || 0);

    const data = {
        labels: months.map(m => m.label),
        datasets: [
            {
                label: "Income",
                data: incomeData,
                borderColor: "#10b981",
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Expenses",
                data: expenseData,
                borderColor: "#ef4444",
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" }
                }
            },
            title: {
                display: true,
                text: "Overall Monthly Trend (All Months)",
                color: isDark ? "#f8fafc" : "#1f2937",
                font: { size: 16, weight: "bold" }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                },
                ticks: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" },
                    callback: (value) => `${currency}${formatNumber(value)}`
                }
            },
            x: {
                grid: {
                    color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                },
                ticks: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" }
                }
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div style={{ height: "350px" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
