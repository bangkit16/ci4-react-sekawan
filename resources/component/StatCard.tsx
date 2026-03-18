import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: 'amber' | 'blue' | 'green' | 'red';
}

const accentMap = {
  amber: { iconBg: 'bg-amber-50 dark:bg-amber-500/10', iconColor: 'text-amber-500 dark:text-amber-400' },
  blue:  { iconBg: 'bg-blue-50 dark:bg-blue-500/10',   iconColor: 'text-blue-500 dark:text-blue-400'   },
  green: { iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-500 dark:text-emerald-400' },
  red:   { iconBg: 'bg-red-50 dark:bg-red-500/10',     iconColor: 'text-red-500 dark:text-red-400'     },
};

function StatCard({ title, value, icon, trend, trendUp, accent = 'amber' }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-sm dark:hover:shadow-none transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.iconBg}`}>
          <span className={colors.iconColor}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            trendUp
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400'
          }`}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
    </div>
  );
}

export default StatCard;
