import ExpenseChart from "../components/ExpenseChart";
import IncomeChart from "../components/IncomeChart";
import ComparisonChart from "../components/ComparisonChart";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import TopCategoriesChart from "../components/TopCategoriesChart";
import MonthlySummaryTable from "../components/MonthlySummaryTable";

export default function Analysis({ expenses, incomes, totalExpenses, totalIncome }) {
    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">Analysis</h1>
                <p className="text-gray-500">Comprehensive breakdown of your finances.</p>
            </header>

            {/* 1. Financial Summary Cards (MOST IMPORTANT) */}
            <FinancialSummaryCards
                expenses={expenses}
                incomes={incomes}
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
            />

            {/* 2. Monthly Trend Chart (Full Width) */}
            <div className="mb-8">
                <MonthlyTrendChart expenses={expenses} incomes={incomes} />
            </div>

            {/* 4. Top Categories + Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TopCategoriesChart expenses={expenses} />
                <ExpenseChart expenses={expenses} />
            </div>

            {/* 5. Income Breakdown + Comparison Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <IncomeChart incomes={incomes} />
                <ComparisonChart income={totalIncome} expense={totalExpenses} />
            </div>

            {/* 6. Monthly Summary Table */}
            <MonthlySummaryTable expenses={expenses} incomes={incomes} />
        </div>
    );
}
