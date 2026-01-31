import { formatNumber } from "../utils/formatNumber";

export default function StatCard({ title, value, color }) {
  const currency = localStorage.getItem("currency") || "₹";
  return (
    <div className={`p-6 rounded-2xl shadow-lg ${color} text-white min-w-[200px] flex-1 transform transition-transform hover:scale-105`}>
      <h3 className="text-sm font-medium opacity-90 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold mt-2">
        {currency} {formatNumber(value)}
      </p>
    </div>
  );
}
