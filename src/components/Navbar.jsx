import { NavLink } from "react-router-dom";
import { Home, PieChart, CreditCard, Layers, Menu, Settings } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(true);

    const navItems = [
        { name: "Home", path: "/", icon: <Home size={20} /> },
        { name: "Analysis", path: "/analysis", icon: <PieChart size={20} /> },
        { name: "Transactions", path: "/transactions", icon: <CreditCard size={20} /> },
        { name: "Categories", path: "/categories", icon: <Layers size={20} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    ];

    return (
        <nav className={`fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 md:static md:h-screen md:border-r md:border-t-0 flex md:flex-col shadow-lg z-50 transition-all duration-300 ${isOpen ? "md:w-64" : "md:w-20"}`}>
            <div className={`hidden md:flex items-center ${isOpen ? "justify-between px-4" : "justify-center"} h-20 border-b border-gray-100 dark:border-slate-800`}>
                {isOpen && (
                    <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 leading-tight">
                        Expense <br /> Tracker
                    </h1>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex flex-1 justify-around md:justify-start md:flex-col md:p-2 gap-2 md:mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col md:flex-row items-center p-2 rounded-xl transition-all duration-200 ${isActive
                                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 font-bold"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                            } ${isOpen ? "md:justify-start md:px-4" : "md:justify-center"}`
                        }
                    >
                        <div className="min-w-[20px]">{item.icon}</div>

                        <span className={`text-xs md:text-sm font-medium mt-1 md:mt-0 md:ml-3 transition-opacity duration-200 ${isOpen ? "md:opacity-100" : "md:opacity-0 md:w-0 md:hidden"}`}>
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
