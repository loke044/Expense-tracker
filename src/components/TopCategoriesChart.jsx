import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopCategoriesChart({ expenses }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Group by category
    const categoryTotals = {};
    expenses.forEach(row => {
        const amount = parseVal(row[2]);
        const category = row[4] || "Others";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    // Get top 5
    const top5 = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (top5.length === 0) {
        return <p className="text-gray-500 text-center py-10">No expense data</p>;
    }

    const data = {
        labels: top5.map(([cat]) => cat),
        datasets: [{
            label: "Amount (₹)",
            data: top5.map(([, amt]) => amt),
            backgroundColor: [
                "#4338ca",
                "#059669",
                "#dc2626",
                "#d97706",
                "#0891b2"
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
                font: { size: 16, weight: "bold" }
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div style={{ height: "300px" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
