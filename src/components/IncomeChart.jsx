import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeChart({ incomes }) {
    if (!Array.isArray(incomes) || incomes.length === 0) {
        return <p className="text-gray-500 text-center py-10">No income data available</p>;
    }

    // Helper to match App.jsx parsing
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    // Calculate Total Income (summing all, matching App.jsx)
    const totalIncome = incomes.reduce((sum, row) => sum + parseVal(row[2]), 0);

    // Group by category and calculate totals for Chart Slices
    const categoryTotals = {};
    incomes.forEach((row) => {
        const amount = parseVal(row[2]);
        const category = row[4] || "Others";
        if (amount > 0) {
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
    });

    // Convert to array and Sort by Value (Desc)
    const sortedData = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a) // Sort by amount descending
        .map(([label, value]) => ({ label, value }));

    const labels = sortedData.map((item) => item.label);
    const values = sortedData.map((item) => item.value);

    // Palette (using same distinct colors)
    const colors = [
        "#059669", // Emerald 600
        "#4338ca", // Indigo 700
        "#d97706", // Amber 600
        "#dc2626", // Red 600
        "#0891b2", // Cyan 600
        "#7c3aed", // Violet 600
        "#db2777", // Pink 600
        "#4b5563", // Gray 600
        "#65a30d", // Lime 600
        "#ea580c", // Orange 600
        "#0284c7", // Sky 600
        "#9333ea", // Purple 600
    ];

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                hoverOffset: 4,
                borderColor: "#ffffff",
                borderWidth: 2,
                cutout: "75%",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 20,
        },
        plugins: {
            legend: {
                display: true,
                position: "right",
                align: "center",
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: 500,
                    },
                    color: "#374151",
                    generateLabels: (chart) => {
                        const data = chart.data;
                        return data.labels.map((label, i) => ({
                            text: `${label} - ₹${data.datasets[0].data[i].toLocaleString()}`,
                            fillStyle: data.datasets[0].backgroundColor[i],
                            strokeStyle: data.datasets[0].backgroundColor[i],
                            hidden: isNaN(data.datasets[0].data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                            index: i,
                        }));
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const percentage = ((value / totalIncome) * 100).toFixed(1) + "%";
                        return ` ${label}: ₹${value.toLocaleString()} (${percentage})`;
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    const centerTextPlugin = {
        id: "centerText",
        beforeDraw: (chart) => {
            const { width } = chart;
            const { height } = chart;
            const ctx = chart.ctx;
            ctx.restore();

            const chartArea = chart.chartArea;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.fillStyle = "#6b7280";
            ctx.font = "500 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const labelText = "Total Income";
            ctx.fillText(labelText, centerX, centerY - 15);

            ctx.fillStyle = "#111827";
            ctx.font = "bold 20px Inter, sans-serif";
            const valueText = `₹${totalIncome.toLocaleString()}`;
            ctx.fillText(valueText, centerX, centerY + 10);

            ctx.save();
        },
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center w-full">
            <h2 className="text-lg font-bold mb-4 text-green-700 self-start">Income Breakdown</h2>
            <div className="h-[350px] w-full relative">
                <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
            </div>
        </div>
    );
}
