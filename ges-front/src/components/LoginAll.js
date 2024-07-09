// LoginAll.jsx
import React, { useState } from 'react';
import EleveConnect from './EleveConnect';
import EnseignantConnect from './EnseignantConnect';
import AdminConnect from './AdminConnect';


const LoginAll = () => {
  const [activeTab, setActiveTab] = useState('enseignant');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tab-buttons">
      <button className={activeTab === 'eleve' ? 'active' : ''} onClick={() => handleTabChange('eleve')}>Élève</button>
        <button className={activeTab === 'enseignant' ? 'active' : ''} onClick={() => handleTabChange('enseignant')}>Enseignant</button>
        <button className={activeTab === 'admin' ? 'active' : ''} onClick={() => handleTabChange('admin')}>Administrateur</button>


        
      </div>
      {activeTab === 'enseignant' && <EnseignantConnect />}
      {activeTab === 'eleve' && <EleveConnect />}
      {activeTab === 'admin' && <AdminConnect />}
    </div>
  );
};

export default LoginAll;
