import React from 'react';

const COLORS = {
  yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  green: 'text-green-400 bg-green-400/10 border-green-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  red: 'text-red-400 bg-red-400/10 border-red-400/20',
  orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  teal: 'text-teal-400 bg-teal-400/10 border-teal-400/20'
};

export default function StatsCard({ title, value, icon: Icon, color = 'blue', subtext = '' }) {
  const colorClasses = COLORS[color] || COLORS.blue;

  return (
    <div className="bg-gray-900 backdrop-blur border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-all hover:bg-gray-800/60">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1 truncate">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ml-4 ${colorClasses} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
}
