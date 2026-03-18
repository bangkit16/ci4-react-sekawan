import { useNavigate } from "react-router-dom";
import ThemeToggle from "../component/ThemeToggle";
import useSession from "../hooks/useSession";
import { api } from "../lib/axios";

function Home() {
  const { isLoggedIn } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Panggil API logout agar cookie & DB dibersihkan
      await api.post("api/auth/logout");
    } catch {
      // toast.error("Logout failed");
    } finally {
      // Hapus local storage & redirect apa pun yang terjadi
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-slate-800 dark:text-white font-semibold text-sm leading-tight">
                Sekawan Nickel Mining
              </p>
              <p className="text-amber-600 dark:text-amber-400 text-xs">
                Vehicle Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <button
                onClick={() => handleLogout()}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 mb-8">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
            Welcome to the{" "}
            <span className="text-amber-500">Vehicle Rental</span> Management
            System
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            This system helps manage vehicle bookings, drivers, and operational
            transportation across mining locations — including headquarters,
            branch offices, and active Nickel Mining sites.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                ),
                title: "Vehicle Bookings",
                desc: "Schedule and track vehicle assignments in real-time.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                title: "Driver Management",
                desc: "Manage driver profiles, availability, and assignments.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                ),
                title: "Location Tracking",
                desc: "Monitor routes between HQ, offices, and mine sites.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 text-left hover:border-amber-200 dark:hover:border-amber-500/40 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl transition-all duration-200 text-base shadow-md shadow-amber-100 dark:shadow-none active:scale-[0.98]"
          >
            Go to Dashboard
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-slate-800 py-4 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs">
          PT. Sekawan Nickel Mining · Vehicle Management System ·{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default Home;
