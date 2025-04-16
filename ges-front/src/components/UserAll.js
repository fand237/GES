import React, { useState } from 'react';
import EleveAll from './EleveAll';
import EnseignantAll from './EnseignantAll';
import ParentAll from './ParentAll';
import config from "../config/config";

const UserAll = () => {
  const [activeTab, setActiveTab] = useState('enseignant');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => handleTabChange('eleve')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'eleve' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Élève
        </button>
        <button
          onClick={() => handleTabChange('enseignant')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'enseignant' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Enseignant
        </button>
        <button
          onClick={() => handleTabChange('parent')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'parent' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Parent
        </button>
      </div>
      <div className="p-6 bg-white shadow-md rounded-lg">
        {activeTab === 'enseignant' && <EnseignantAll />}
        {activeTab === 'eleve' && <EleveAll />}
        {activeTab === 'parent' && <ParentAll />}
      </div>
    </div>
  );
};

export default UserAll;
