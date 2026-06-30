// src/components/TabBar.js
import React from 'react';
import './TabBar.css'
// Note: Styling for this component should be included in BookingList.css or Shared.css

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;