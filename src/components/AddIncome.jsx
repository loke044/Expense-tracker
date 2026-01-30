import { useState } from "react";

export default function AddIncome({ onSubmit, categories = [] }) {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ date: "", amount: "", description: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-3 border-t-4 border-green-500">
      <h2 className="font-semibold text-lg text-green-700">Add Income</h2>

      <input type="date" name="date" value={form.date} onChange={handleChange}
        className="w-full border p-2 rounded" required />

      <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange}
        className="w-full border p-2 rounded" required />

      <input type="text" name="description" placeholder="Source" value={form.description} onChange={handleChange}
        className="w-full border p-2 rounded" />

      {/* Dynamic Dropdown for Incomes */}
      <select name="category" value={form.category} onChange={handleChange}
        className="w-full border p-2 rounded bg-white" required>
        <option value="">Select Income Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold">
        Add Income
      </button>
    </form>
  );
}