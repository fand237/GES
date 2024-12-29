import React, { useState } from 'react';
import BulletinSequence from './BulletinSequence';

const DashboardEleve = () => {
    const [activeTab, setActiveTab] = useState('BulletinSequence');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <nav className="fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gradient-to-b from-purple-500 to-purple-800 text-white shadow-lg">
                <div className="p-4">
                <h1 className="text-xl font-bold mb-6 text-center">
                        Eleve Dashboard
                    </h1>
                    <ul className="space-y-4">
                        <li>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    activeTab === 'BulletinSequence'
                                        ? 'bg-purple-600 font-semibold'
                                        : 'hover:bg-purple-700'
                                }`}
                                onClick={() => handleTabChange('BulletinSequence')}
                            >
                                Bulletin
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-purple-700"
                                onClick={() => alert('Nouvelle section bientôt disponible !')}
                            >
                                Nouvelle Section
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
                {activeTab === 'BulletinSequence' && <BulletinSequence />}
            </div>
        </div>
    );
};

export default DashboardEleve;
