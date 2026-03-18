import DashboardLayout from "../component/DashboardLayout";
import StatCard from "../component/StatCard";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#ef4444", "#10b981"];

function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => DashboardService.getStats(),
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Dashboard" breadcrumb="Sekawan Mining · VMS">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  const data = dashboardData?.data;
  const stats = [
    {
      title: "Total Vehicles",
      value: data?.stats?.total_vehicles || 0,
      accent: "amber" as const,
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      title: "Active Bookings",
      value: data?.stats?.active_bookings || 0,
      accent: "blue" as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Total Drivers",
      value: data?.stats?.total_drivers || 0,
      accent: "green" as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: "All Bookings",
      value: data?.stats?.total_bookings || 0,
      accent: "amber" as const,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  // Merge costs for combined chart
  const combinedCosts = data?.fuelMonthly?.map((fuel: any) => {
    const maintenance = data.maintenanceMonthly?.find(
      (m: any) => m.month === fuel.month
    );
    return {
      month: fuel.month,
      fuel: parseFloat(fuel.total_fuel) || 0,
      maintenance: maintenance ? parseFloat(maintenance.total_maintenance) || 0 : 0,
    };
  }) || [];

  return (
    <DashboardLayout pageTitle="Dashboard" breadcrumb="Sekawan Mining · VMS">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
          VMS Dashboard 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Overview of fleet operations and costs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
            accent={s.accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Cost Chart */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-slate-800 dark:text-white font-semibold mb-4">
            Monthly Operational Costs
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combinedCosts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="fuel" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Fuel Cost" />
                <Bar dataKey="maintenance" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Maintenance Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distance Chart */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-slate-800 dark:text-white font-semibold mb-4">
            Vehicle Usage (Distance)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.usageMonthly?.map((u: any) => ({
                  month: u.month,
                  distance: parseFloat(u.total_distance),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-slate-800 dark:text-white font-semibold mb-4">
            Vehicle Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusDistribution?.map((s: any) => ({
                    name: s.vehicle_status,
                    value: parseInt(s.count),
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.statusDistribution?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

