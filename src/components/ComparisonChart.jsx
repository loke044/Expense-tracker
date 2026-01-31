import { Bar } from "react-chartjs-2";
import { formatNumber } from "../utils/formatNumber";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function ComparisonChart({ income, expense, theme, currency }) {
    const isDark = theme === "dark";

    const data = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: "Amount",
                data: [income, expense],
                backgroundColor: isDark ? ["#10b981", "#f43f5e"] : ["#22C55E", "#EF4444"],
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14
                },
                anchor: 'end',
                align: 'start',
                offset: -20,
                formatter: (value) => `${currency}${formatNumber(value)}`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: isDark ? "rgba(255, 255, 255, 0.1)" : "#f3f4f6"
                },
                ticks: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" },
                    callback: (value) => `${currency}${formatNumber(value)}`
                },
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: isDark ? "#94a3b8" : "#374151",
                    font: { weight: "500" }
                },
            }
        },
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col h-full transition-colors">
            <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">Income vs Expenses</h2>
            <div className="flex-1 w-full min-h-[300px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
