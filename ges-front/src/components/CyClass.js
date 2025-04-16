import React, { useState } from 'react';
import CycleForm from './CycleForm';
import ClasseForm from './ClasseForm';
import GroupeForm from './GroupeForm';
import MatiereForm from './MatiereForm';
import JourForm from './JourForm';
import SequenceForm from './SequenceForm';
import TypeEvaluationForm from './TypeEvaluationForm';
import AnneeAcademiqueForm from "./AnneeAcademiqueForm";
import config from "../config/config";



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
          onClick={() => handleTabChange('GroupeForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'GroupeForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Groupes des matieres
        </button>
        <button
          onClick={() => handleTabChange('MatiereForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'MatiereForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Matieres
        </button>
        <button
          onClick={() => handleTabChange('ClasseForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ClasseForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Classes
        </button>
        <button
          onClick={() => handleTabChange('JourForm')}
          className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'JourForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Jours
        </button>

        <button
            onClick={() => handleTabChange('SequenceForm')}
            className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'SequenceForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Sequences
        </button>

        <button
            onClick={() => handleTabChange('TypeEvaluationForm')}
            className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'TypeEvaluationForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Types d'Evaluation
        </button>

        <button
            onClick={() => handleTabChange('AnneeAcademiqueForm')}
            className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'AnneeAcademiqueForm' ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Annee Academique
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

      {activeTab === 'GroupeForm' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <GroupeForm />
        </div>
      )}

      {activeTab === 'MatiereForm' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <MatiereForm />
        </div>
      )}

      {activeTab === 'JourForm' && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <JourForm />
        </div>
      )}

      {activeTab === 'SequenceForm' && (
          <div className="p-6 bg-white shadow-md rounded-lg">
            <SequenceForm />
          </div>
      )}

      {activeTab === 'TypeEvaluationForm' && (
          <div className="p-6 bg-white shadow-md rounded-lg">
            <TypeEvaluationForm />
          </div>
      )}

      {activeTab === 'AnneeAcademiqueForm' && (
          <div className="p-6 bg-white shadow-md rounded-lg">
            <AnneeAcademiqueForm />
          </div>
      )}
    </div>
  );

};

export default CyClass;
