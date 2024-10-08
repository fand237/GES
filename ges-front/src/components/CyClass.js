import React, { useState } from 'react';
import CycleForm from './CycleForm';
import ClasseForm from './ClasseForm';



const CyClass = () => {
  const [activeTab, setActiveTab] = useState('CycleForm');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => handleTabChange('CycleForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'CycleForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Cycles
        </button>
        <button
          onClick={() => handleTabChange('ClasseForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ClasseForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Classes
        </button>
      </div>
      
      {activeTab === 'CycleForm' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <CycleForm />
        </div>
      )}
       {activeTab === 'ClasseForm' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <ClasseForm />
        </div>
      )}
    </div>
  );
};

export default CyClass;
