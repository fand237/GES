import React, { useState } from 'react';

import BulletinSequence from './BulletinSequence';


const DashboardEleve = () => {
    const [activeTab, setActiveTab] = useState('BulletinSequence');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-200 p-4">
                <h1 className="text-xl font-bold mb-4">Tableau de bord de l'Eleve</h1>
                <ul>
                    <li>
                        <button
                            className={`dashboard-button ${activeTab === 'BulletinSequence' ? 'bg-gray-300' : ''}`}
                            onClick={() => handleTabChange('BulletinSequence')}
                        >
                            Bulletin
                        </button>
                    </li>
                   
                    
                </ul>
            </div>
            <div className="w-3/4 p-4 bg-white overflow-auto">
                
                {activeTab === 'BulletinSequence' && <BulletinSequence />}
                


            </div>
        </div>
    );
}

export default DashboardEleve;
