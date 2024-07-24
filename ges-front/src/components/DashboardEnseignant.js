import React, { useState } from 'react';

import FicheAppel from './FicheAppel';
import NoteForm from './NoteForm';
import NoteEval from './NoteEval';

const DashboardEnseignant = () => {
    const [activeTab, setActiveTab] = useState('FicheAppel');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-200 p-4">
                <h1 className="text-xl font-bold mb-4">Tableau de bord de l'Enseignant</h1>
                <ul>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'FicheAppel' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('FicheAppel')}
                        >
                            Fiche de Presence
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'NoteForm' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('NoteForm')}
                        >
                            Remplissage des notes
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'NoteEval' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('NoteEval')}
                        >
                            gerer les notes
                        </button>
                    </li>
                    
                </ul>
            </div>
            <div className="w-3/4 p-4 bg-white overflow-auto">
                
                {activeTab === 'FicheAppel' && <FicheAppel />}
                {activeTab === 'NoteForm' && <NoteForm />}
                {activeTab === 'NoteEval' && <NoteEval />}


            </div>
        </div>
    );
}

export default DashboardEnseignant;
