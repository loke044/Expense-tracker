import { Line } from "react-chartjs-2";
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

export default function MonthlyTrendChart({ expenses, incomes }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
    }

    // Aggregate data by month
    const expenseByMonth = {};
    const incomeByMonth = {};

    expenses.forEach(row => {
        const date = new Date(row[1]);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + parseVal(row[2]);
    });

    incomes.forEach(row => {
        const date = new Date(row[1]);
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
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Expenses",
                data: expenseData,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
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
            },
            title: {
                display: true,
                text: "Income vs Expenses Trend",
                font: { size: 16, weight: "bold" }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div style={{ height: "300px" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
