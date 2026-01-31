import React, { useState, useEffect } from "react";
import { editTransaction } from "../services/api";

const TransactionModal = ({ isOpen, type, onClose, onSubmit, categories, editMode = false, transactionId, initialData }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        // Pre-fill form with existing transaction data
        setForm({
          date: initialData.date,
          amount: parseFloat(String(initialData.amount).replace(/[^0-9.]/g, "")) || "",
          description: initialData.description,
          category: initialData.category
        });
      } else {
        // Reset form for new transaction
        setForm({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          description: "",
          category: "",
        });
      }
    }
  }, [isOpen, type, editMode, initialData]);

  if (!isOpen) return null;

  const currentCategories = type === "expense" ? categories.expenses : categories.incomes;
  const isExpense = type === "expense";
  const themeColor = isExpense ? "bg-red-500" : "bg-green-500";
  const buttonColor = isExpense ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editMode) {
        // Edit existing transaction
        await editTransaction(type, transactionId, form);
        window.location.reload(); // Refresh to show changes
      } else {
        // Add new transaction
        await onSubmit({ ...form, type });
      }
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 border dark:border-slate-700">

        {/* Header */}
        <div className={`${themeColor} px-6 py-5 flex justify-between items-center`}>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {editMode ? 'EDIT' : 'ADD'} {type.toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl leading-none font-medium"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Date Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount ({localStorage.getItem("currency") || "₹"})</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{localStorage.getItem("currency") || "₹"}</span>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full pl-8 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-2xl font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all placeholder-gray-300 dark:placeholder-gray-700"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Description</label>
            <input
              type="text"
              placeholder={isExpense ? "What did you spend on?" : "Income source"}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="" disabled className="text-gray-400">Select Category</option>
                {currentCategories?.map((catObj, i) => (
                  <option key={i} value={catObj.name}>
                    {catObj.icon} {catObj.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 mt-4 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg transform transition-all active:scale-[0.98] ${buttonColor} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? 'Processing...' : (editMode ? 'Update' : 'Confirm')} {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;