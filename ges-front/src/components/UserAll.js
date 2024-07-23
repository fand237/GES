// LoginAll.jsx
import React, { useState } from 'react';
import EleveAll from './EleveAll';
import EnseignantAll from './EnseignantAll';
import ParentAll from './ParentAll';


const UserAll = () => {
  const [activeTab, setActiveTab] = useState('enseignant');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tab-buttons">
      <button className={activeTab === 'eleve' ? 'active' : ''} onClick={() => handleTabChange('eleve')}>Élève</button>
        <button className={activeTab === 'enseignant' ? 'active' : ''} onClick={() => handleTabChange('enseignant')}>Enseignant</button>
        <button className={activeTab === 'parent' ? 'active' : ''} onClick={() => handleTabChange('parent')}>Parent</button>


        
      </div>
      {activeTab === 'enseignant' && <EnseignantAll />}
      {activeTab === 'eleve' && <EleveAll />}
      {activeTab === 'parent' && <ParentAll />}
    </div>
  );
};

export default UserAll;
