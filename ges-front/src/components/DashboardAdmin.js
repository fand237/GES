import React, { useState } from 'react';
import FormAll from './FormAll';
import TimeTable from './TimeTable';
import UserAll from './UserAll';
import CoursForm from './CoursForm'
import CoursAll from './CoursAll'

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('FormAll');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-200 p-4">
                <h1 className="text-xl font-bold mb-4">Tableau de bord de l'Administrateur</h1>
                <ul>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'FormAll' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('FormAll')}
                        >
                            Enregistrement utilisateurs
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'TimeTable' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('TimeTable')}
                        >
                            Gérer les emplois de temps
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'UserAll' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('UserAll')}
                        >
                            Gérer les Utilisateurs
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'CoursAll' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('CoursAll')}
                        >
                            Gérer les cours
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'CoursForm' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('CoursForm')}
                        >
                            Enregistrement des Cours
                        </button>
                    </li>
                    
                </ul>
            </div>
            <div className="w-3/4 p-4 bg-white overflow-auto">
                {activeTab === 'TimeTable' && <TimeTable />}
                {activeTab === 'FormAll' && <FormAll />}
                {activeTab === 'UserAll' && <UserAll />}
                {activeTab === 'CoursForm' && <CoursForm />}
                {activeTab === 'CoursAll' && <CoursAll />}


            </div>
        </div>
    );
}

export default DashboardAdmin;