import React, { useState } from 'react';
import CycleAll from './CycleAll';
import ClasseAll from './ClasseAll';
import config from "../config/config";

const CyClassAll = () => {
  const [activeTab, setActiveTab] = useState('CycleAll');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => handleTabChange('CycleAll')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'CycleAll' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Cycles
        </button>
        <button
          onClick={() => handleTabChange('ClasseAll')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ClasseAll' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Classes
        </button>
      </div>
      {activeTab === 'CycleAll' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <CycleAll />
        </div>
      )}
      {activeTab === 'ClasseAll' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <ClasseAll />
        </div>
      )}
    </div>
  );
};

export default CyClassAll;
