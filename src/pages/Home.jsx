import StatCard from "../components/StatCard";

export default function Home({ expenses, incomes, totalExpenses, totalIncome, setModal }) {
    const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.-]+/g, "")) || 0;

    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's your financial summary.</p>
            </header>

            {/* OVERALL STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
                <StatCard title="Total Expenses" value={totalExpenses} color="bg-red-500" />
                <StatCard title="Total Income" value={totalIncome} color="bg-green-500" />
                <StatCard title="Balance" value={totalIncome - totalExpenses} color="bg-indigo-600" />
            </div>

            {/* MONTHLY STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
                <StatCard
                    title="This Month Expenses"
                    value={expenses.reduce((sum, row) => {
                        const rowDate = new Date(row[1]);
                        const now = new Date();
                        const amount = parseVal(row[2]);
                        const category = String(row[4] || "").toLowerCase();

                        const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
                        const isNotLend = category !== "lend";

                        if (isThisMonth && isNotLend) {
                            return sum + amount;
                        }
                        return sum;
                    }, 0)}
                    color="bg-orange-500"
                />
                <StatCard
                    title="This Month Income"
                    value={incomes.reduce((sum, row) => {
                        const rowDate = new Date(row[1]);
                        const now = new Date();
                        const amount = parseVal(row[2]);
                        const category = String(row[4] || "").toLowerCase();

                        const isThisMonth = rowDate.getMonth() === now.getMonth() && rowDate.getFullYear() === now.getFullYear();
                        const isNotReturnLend = category !== "return(lend)";

                        if (isThisMonth && isNotReturnLend) {
                            return sum + amount;
                        }
                        return sum;
                    }, 0)}
                    color="bg-teal-500"
                />
            </div>

            {/* QUICK ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                    onClick={() => setModal({ isOpen: true, type: "expense" })}
                    className="flex-1 px-6 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg"
                >
                    - Add Expense
                </button>
                <button
                    onClick={() => setModal({ isOpen: true, type: "income" })}
                    className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg"
                >
                    + Add Income
                </button>
            </div>
        </div>
    );
}
