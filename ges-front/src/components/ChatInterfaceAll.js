import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import ChatInterfaceEnseignant from './ChatInterfaceEnseignant';
import AnnonceEleve from "./AnnonceEleve";
import config from "../config/config";

const ChatInterfaceAll = () => {
    const [activeTab, setActiveTab] = useState('ChatInterface');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex space-x-4">
                <button
                    onClick={() => handleTabChange('ChatInterface')}
                    className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ChatInterface' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Chat Camarade
                </button>
                <button
                    onClick={() => handleTabChange('ChatInterfaceEnseignant')}
                    className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'ChatInterfaceEnseignant' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Chat Enseignant
                </button>
                <button
                    onClick={() => handleTabChange('AnnonceEleve')}
                    className={`px-4 py-2 font-semibold text-sm rounded-md focus:outline-none ${activeTab === 'AnnonceEleve' ? ' bg-purple-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Annonce
                </button>
            </div>

            {activeTab === 'ChatInterface' && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <ChatInterface />
                </div>
            )}

            {activeTab === 'ChatInterfaceEnseignant' && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <ChatInterfaceEnseignant />
                </div>
            )}

            {activeTab === 'AnnonceEleve' && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <AnnonceEleve />
                </div>
            )}

        </div>
    );
};

export default ChatInterfaceAll;
