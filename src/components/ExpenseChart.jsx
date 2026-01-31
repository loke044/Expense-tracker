import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses, theme, currency, categories }) {
  const isDark = theme === "dark";

  // Helper to match App.jsx parsing
  const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

  const getIcon = (catName) => {
    const list = categories?.expenses || [];
    const cat = list.find(c => c.name === catName);
    return cat ? cat.icon : "";
  };

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center w-full min-h-[400px] justify-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-center">No expense data available</p>
      </div>
    );
  }

  // Calculate Total Expenses exactly like App.jsx (for the Center Text)
  const totalExpenses = expenses.reduce((sum, row) => sum + parseVal(row[2]), 0);

  // Group by category and calculate totals for Chart Slices
  const categoryTotals = {};
  expenses.forEach((row) => {
    const amount = parseVal(row[2]);
    const category = row[4] || "Others";
    if (amount > 0) {
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    }
  });

  // 2. Convert to array and Sort by Value (Desc)
  const sortedData = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a) // Sort by amount descending
    .map(([label, value]) => {
      const icon = getIcon(label);
      return {
        label: icon ? `${icon} ${label}` : label,
        value
      };
    });

  const labels = sortedData.map((item) => item.label);
  const values = sortedData.map((item) => item.value);

  // Professional Color Palette (Distinct 12 colors)
  const colors = [
    "#6366f1", // Indigo 500
    "#10b981", // Emerald 500
    "#f43f5e", // Rose 500
    "#f59e0b", // Amber 500
    "#06b6d4", // Cyan 500
    "#8b5cf6", // Violet 500
    "#ec4899", // Pink 500
    "#64748b", // Slate 500
    "#84cc16", // Lime 500
    "#f97316", // Orange 500
    "#0ea5e9", // Sky 500
    "#a855f7", // Purple 500
  ];

  const chartColors = labels.map((_, i) => colors[i % colors.length]);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors,
        hoverOffset: 10,
        borderColor: isDark ? "#1e293b" : "#ffffff",
        borderWidth: 2,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false, // Disabling built-in legend to use custom one
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(0, 0, 0, 0.8)",
        titleColor: isDark ? "#f8fafc" : "#ffffff",
        bodyColor: isDark ? "#f8fafc" : "#ffffff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = ((value / totalExpenses) * 100).toFixed(1) + "%";
            return ` ${label}: ${currency}${value.toLocaleString()} (${percentage})`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  // 3. Center Text Plugin
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      const chartArea = chart.chartArea;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.fillStyle = isDark ? "#94a3b8" : "#374151";
      ctx.font = "500 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Total Expenses", centerX, centerY - 12);

      ctx.fillStyle = isDark ? "#f8fafc" : "#111827";
      ctx.font = "bold 18px Inter, sans-serif";
      const valueText = `${currency}${totalExpenses.toLocaleString()}`;
      ctx.fillText(valueText, centerX, centerY + 12);
      ctx.restore();
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col w-full transition-colors h-full min-h-[450px]">
      <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Expenses Breakdown</h2>

      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 flex-1 w-full min-h-0">
        {/* Chart Area */}
        <div className="w-full xl:w-1/2 h-[280px] sm:h-[320px] relative">
          <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
        </div>

        {/* Custom Legend Area */}
        <div className="w-full xl:w-1/2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            {sortedData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chartColors[i] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                    {item.label}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {currency}{item.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
