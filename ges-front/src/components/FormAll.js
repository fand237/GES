// LoginAll.jsx
import React, { useState } from 'react';
import EleveForm from './EleveForm';
import EnseignantForm from './EnseignantForm';
import ParentForm from './ParentForm';


const FormAll = () => {
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
      {activeTab === 'enseignant' && <EnseignantForm />}
      {activeTab === 'eleve' && <EleveForm />}
      {activeTab === 'parent' && <ParentForm />}

    </div>
  );
};

export default FormAll;
