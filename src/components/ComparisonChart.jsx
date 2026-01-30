import { Bar } from "react-chartjs-2";
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

export default function ComparisonChart({ income, expense }) {
    const data = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: "Amount",
                data: [income, expense],
                backgroundColor: ["#22C55E", "#EF4444"], // Green for Income, Red for Expense
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // No need for legend since colors/labels explain it
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
                formatter: (value) => `₹${value.toLocaleString()}`
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: "#f3f4f6"
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Income vs Expenses</h2>
            <div className="flex-1 w-full min-h-[300px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
