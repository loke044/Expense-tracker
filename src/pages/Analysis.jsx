import ExpenseChart from "../components/ExpenseChart";
import IncomeChart from "../components/IncomeChart";
import ComparisonChart from "../components/ComparisonChart";
import FinancialSummaryCards from "../components/FinancialSummaryCards";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import TopCategoriesChart from "../components/TopCategoriesChart";
import MonthlySummaryTable from "../components/MonthlySummaryTable";
import AllMonthsTrendChart from "../components/AllMonthsTrendChart";
import CategoryComparisonTable from "../components/CategoryComparisonTable";

export default function Analysis({ expenses, incomes, totalExpenses, totalIncome, theme, currency, categories }) {
    return (
        <div className="p-6 max-w-7xl mx-auto w-full transition-colors">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Analysis</h1>
                <p className="text-gray-500 dark:text-gray-400">Comprehensive breakdown of your finances.</p>
            </header>

            {/* 1. Financial Summary Cards */}
            <FinancialSummaryCards
                expenses={expenses}
                incomes={incomes}
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
                currency={currency}
            />

            {/* 2. Monthly Trend (Last 6 Months) */}
            <div className="mb-8">
                <MonthlyTrendChart expenses={expenses} incomes={incomes} theme={theme} currency={currency} />
            </div>

            {/* 3. Overall Trend (All Months) - NEW */}
            <div className="mb-8">
                <AllMonthsTrendChart expenses={expenses} incomes={incomes} theme={theme} currency={currency} />
            </div>

            {/* 4. Top Categories + Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TopCategoriesChart expenses={expenses} theme={theme} currency={currency} categories={categories} />
                <ExpenseChart expenses={expenses} theme={theme} currency={currency} categories={categories} />
            </div>

            {/* 5. Income Breakdown + Comparison Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <IncomeChart incomes={incomes} theme={theme} currency={currency} categories={categories} />
                <ComparisonChart income={totalIncome} expense={totalExpenses} theme={theme} currency={currency} />
            </div>

            {/* 6. Category Comparison Table - NEW */}
            <div className="mb-8">
                <CategoryComparisonTable expenses={expenses} currency={currency} categories={categories} />
            </div>

            {/* 7. Monthly Summary Table */}
            <MonthlySummaryTable expenses={expenses} incomes={incomes} currency={currency} />
        </div>
    );
}
