import React from 'react';

export default function DashboardTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-700/50 mb-8 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center px-6 py-4 relative font-medium flex-shrink-0 transition-all duration-300
              ${isActive 
                ? 'text-cyan-300 border-b-2 border-cyan-500 bg-gradient-to-t from-cyan-500/5 to-transparent' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }
            `}
          >
             {tab.icon && (
               <span className={`mr-3 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                 {React.isValidElement(tab.icon) ? tab.icon : <tab.icon className="w-5 h-5"/>}
               </span>
             )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
