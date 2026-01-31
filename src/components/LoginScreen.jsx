import { useAuth } from "../context/AuthContext";
import { ShieldCheck, LayoutDashboard } from "lucide-react";

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-indigo-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                        <LayoutDashboard size={40} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Finance</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Your personal expense tracker, powered by your own Google Sheets.
                </p>

                {!clientId ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100">
                        <strong>Missing Client ID</strong><br />
                        Please create a <code>.env</code> file in the project root and add:<br />
                        <code>VITE_GOOGLE_CLIENT_ID=your_id_here</code>
                    </div>
                ) : (
                    <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl border border-gray-300 shadow-sm transition-all transform active:scale-95"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        Sign in / Sign up with Google
                    </button>
                )}

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={14} />
                    <span>Secure • Private • Your Data</span>
                </div>
            </div>
        </div>
    );
}
