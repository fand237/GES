import React, { useState } from 'react';
import ChatInterfaceDesEnseignant from './ChatInterfaceDesEnseignant';
import AnnonceEnseignant from "./AnnonceEnseignant";

const ChatEnseignantAll = () => {
    const [activeTab, setActiveTab] = useState('ChatInterfaceDesEnseignant');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex space-x-4">
                <button
                    onClick={() => handleTabChange('ChatInterfaceDesEnseignant')}
                    className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ChatInterfaceDesEnseignant' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Chat Eleve
                </button>

                <button
                    onClick={() => handleTabChange('AnnonceEnseignant')}
                    className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'AnnonceEnseignant' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Annonce
                </button>
            </div>
            {activeTab === 'ChatInterfaceDesEnseignant' && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <ChatInterfaceDesEnseignant />
                </div>
            )}


            {activeTab === 'AnnonceEnseignant' && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <AnnonceEnseignant />
                </div>
            )}

        </div>
    );
};

export default ChatEnseignantAll;
