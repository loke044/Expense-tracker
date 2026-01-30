import ExpenseChart from "../components/ExpenseChart";
import IncomeChart from "../components/IncomeChart";
import ComparisonChart from "../components/ComparisonChart";

export default function Analysis({ expenses, incomes, totalExpenses, totalIncome }) {
    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Analysis</h1>
                <p className="text-gray-500">Visual breakdown of your finances.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <ExpenseChart expenses={expenses} />
                <IncomeChart incomes={incomes} />
                <div className="lg:col-span-2">
                    <ComparisonChart income={totalIncome} expense={totalExpenses} />
                </div>
            </div>
        </div>
    );
}
