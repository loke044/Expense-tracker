import { Moon, Sun, User, Landmark, Trash2, CheckCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings({ theme, setTheme }) {
    const { user, logout } = useAuth();

    return (
        <div className="p-6 max-w-4xl mx-auto w-full min-h-[calc(100vh-80px)] flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your application preferences.</p>
            </header>

            <div className="space-y-6 flex-1">
                {/* Account Section */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <User size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Account</h3>
                            <p className="text-gray-500 dark:text-gray-400">Signed in as {user?.name || "User"}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>

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

            </div>

        </div>
    );
}
