import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import useSession from "../hooks/useSession";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[]; // Added roles for access control
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "approver"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Vehicles",
    href: "/dashboard/vehicles",
    roles: ["admin"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Vehicle Booking",
    href: "/dashboard/bookings",
    roles: ["admin"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Booking Approvals",
    href: "/dashboard/approvals",
    roles: ["admin", "approver"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    label: "Drivers",
    href: "/dashboard/drivers",
    roles: ["admin"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Employees",
    href: "/dashboard/employees",
    roles: ["admin"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Locations",
    href: "/dashboard/locations",
    roles: ["admin"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  // {
  //   label: "Reports",
  //   href: "/dashboard/reports",
  //   icon: (
  //     <svg
  //       className="w-5 h-5"
  //       fill="none"
  //       stroke="currentColor"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={1.8}
  //         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  //       />
  //     </svg>
  //   ),
  // },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean; // New prop for mobile control
  onCloseMobile?: () => void; // New prop to close sidebar on mobile
}

function Sidebar({ collapsed, onToggle, isMobileOpen, onCloseMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSession();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

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

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-50 shadow-sm
          ${collapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <p className="text-slate-800 dark:text-white font-bold text-sm leading-tight truncate">Sekawan Mining</p>
              <p className="text-amber-600 dark:text-amber-400 text-xs truncate">VMS Portal</p>
            </div>
          )}
          <button
            onClick={onCloseMobile || onToggle}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200 flex-shrink-0 lg:ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {filteredNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <span className={`flex-shrink-0 ${active ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 dark:border-slate-800 p-3">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-200 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold font-mono">
              {user?.name?.substring(0, 2).toUpperCase() || "AD"}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-white text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
