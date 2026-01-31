import { Bar } from "react-chartjs-2";
import { formatNumber } from "../utils/formatNumber";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function TopCategoriesChart({ expenses, theme, currency, categories }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;
    const isDark = theme === "dark";

    const getIcon = (catName) => {
        const cat = categories.expenses.find(c => c.name === catName);
        return cat ? cat.icon : "";
    };

    // ... (rest same)
    const categoryTotals = {};
    expenses.forEach(row => {
        const amount = parseVal(row[2]);
        const category = row[4] || "Others";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    const top5 = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (top5.length === 0) {
        return <p className="text-gray-500 text-center py-10">No expense data</p>;
    }

    const data = {
        labels: top5.map(([cat]) => {
            const icon = getIcon(cat);
            return icon ? `${icon} ${cat}` : cat;
        }),
        datasets: [{
            label: `Amount (${currency})`,
            data: top5.map(([, amt]) => amt),
            backgroundColor: [
                "#6366f1",
                "#10b981",
                "#f43f5e",
                "#f59e0b",
                "#06b6d4"
            ]
        }]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Top 5 Expense Categories",
                color: isDark ? "#f8fafc" : "#1f2937",
                font: { size: 16, weight: "bold" }
            },
            datalabels: {
                color: '#ffffff',
                font: {
                    weight: 'bold',
                    size: 11
                },
                anchor: 'center',
                align: 'center',
                formatter: (value) => `${currency}${formatNumber(value)}`
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                },
                ticks: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" },
                    callback: (value) => `${currency}${formatNumber(value)}`
                }
            },
            y: {
                grid: {
                    display: false
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
            <div style={{ height: "300px" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
