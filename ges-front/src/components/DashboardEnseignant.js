import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import UseAuth from './UseAuth';


const DashboardEnseignant = () => {
    const { idens } = UseAuth();

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-200 p-4 fixed top-15 left-0 h-full">
                <h1 className="text-xl font-bold mb-4">Tableau de bord de l'Enseignant</h1>
                <ul>
                    <li>
                            <Link to={`/DashboardEnseignant/FicheAppel/${idens}`}>
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Fiche de Présence
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/DashboardEnseignant/NoteForm/${idens}`}>
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Remplissage des Notes
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/DashboardEnseignant/NoteEval/${idens}`}>
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Gérer les Notes
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/DashboardEnseignant/EmploisTempsEnseignant`}>
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Mon Emplois de temps
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-6 bg-white">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardEnseignant;
