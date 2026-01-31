import { Moon, Sun, User, Landmark, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Settings({ theme, setTheme }) {
    return (
        <div className="p-6 max-w-4xl mx-auto w-full min-h-[calc(100vh-80px)] flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your application preferences.</p>
            </header>

            <div className="space-y-6 flex-1">
                {/* Theme Setting */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            {theme === "light" ? <Sun size={28} /> : <Moon size={28} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Appearance</h3>
                            <p className="text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
                    >
                        {theme === "light" ? (
                            <>
                                <Moon size={20} /> Dark Mode
                            </>
                        ) : (
                            <>
                                <Sun size={20} /> Light Mode
                            </>
                        )}
                    </button>
                </div>

                {/* Info Card */}
                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Theme Preference</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400 opacity-80">
                        The application will remember your theme choice and apply it automatically every time you visit.
                    </p>
                </div>
            </div>

            {/* About / Footer */}
            <div className="pt-12 pb-6 text-center text-gray-400 dark:text-gray-600 text-sm border-t border-gray-100 dark:border-slate-800">
                <p className="font-medium">Expense Tracker Pro v1.2.0</p>
                <p className="mt-1">Hand-crafted for financial clarity.</p>
            </div>
        </div>
    );
}
