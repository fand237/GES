import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import config from "../config/config";
import config from "../config/config";

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('');
    const navigate = useNavigate();

    const handleTabChange = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <nav className="fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gradient-to-b from-purple-500 to-purple-800 text-white shadow-lg">
                <div className="p-4">
                    <h1 className="text-xl font-bold mb-6 text-center">
                        Admin Dashboard
                    </h1>
                    <ul className="space-y-4">
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'FormAll'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('FormAll', '/DashboardAdmin/FormAll')}
                            >
                                Enregistrement utilisateurs
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'EmploisTemps'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('EmploisTemps', '/DashboardAdmin/EmploisTemps')}
                            >
                                Gérer les emplois de temps
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'UserAll'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('UserAll', '/DashboardAdmin/UserAll')}
                            >
                                Gérer les Utilisateurs
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'CoursAll'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('CoursAll', '/DashboardAdmin/CoursAll')}
                            >
                                Gérer les cours
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'CoursForm'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('CoursForm', '/DashboardAdmin/CoursForm')}
                            >
                                Enregistrement des Cours
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'CyClass'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('CyClass', '/DashboardAdmin/CyClass')}
                            >
                                Enregistrement des Cycles et Classes
                            </button>
                        </li>
                        
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'CyClassAll'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('CyClassAll', '/DashboardAdmin/CyClassAll')}
                            >
                                Gérer les Cycles et Classes
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'PresenceRapport'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('PresenceRapport', '/DashboardAdmin/PresenceRapport')}
                            >
                                Rapport des présences
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'StatistiquesMoyenne'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('StatistiquesMoyenne', '/DashboardAdmin/StatistiquesMoyenne')}
                            >
                                Rapport des Statistiques
                            </button>
                        </li>

                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'PlanningExamen'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('PlanningExamen', '/DashboardAdmin/PlanningExamen')}
                            >
                                Plannifier les Examens
                            </button>
                        </li>

                    </ul>
                </div>
                <footer className="absolute bottom-4 w-full text-center text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} Tous droits réservés.{' '}
                        Gestionnaire d'établissement scolaire
                    </p>
                </footer>
            </nav>

            {/* Main Content */}
            <div className="ml-64 mt-16 flex-1 bg-gray-100 p-6 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardAdmin;
