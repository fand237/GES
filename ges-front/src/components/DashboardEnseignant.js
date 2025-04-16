import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import UseAuth from './UseAuth';
import config from "../config/config";

const DashboardEnseignant = () => {
    const { idens } = UseAuth();
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
                        Tableau de bord de l'Enseignant
                    </h1>
                    <ul className="space-y-4">
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'FicheAppel'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('FicheAppel', `/DashboardEnseignant/FicheAppel/${idens}`)}
                            >
                                Fiche de Présence
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'NoteForm'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('NoteForm', `/DashboardEnseignant/NoteForm/${idens}`)}
                            >
                                Remplissage des Notes
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'NoteEval'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('NoteEval', `/DashboardEnseignant/NoteEval/${idens}`)}
                            >
                                Gérer les Notes
                            </button>
                        </li>
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'EmploisTemps'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('EmploisTemps', `/DashboardEnseignant/EmploisTempsEnseignant`)}
                            >
                                Mon Emplois de temps
                            </button>
                        </li>

                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'ChatEnseignantAll'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('ChatEnseignantAll', `/DashboardEnseignant/ChatEnseignantAll`)}
                            >
                                Chat et Annonce
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
}

export default DashboardEnseignant;