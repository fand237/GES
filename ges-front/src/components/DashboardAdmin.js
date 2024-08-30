import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const DashboardAdmin = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-200 p-4 fixed top-15 left-0 h-full">
                <h1 className="text-xl font-bold mb-4">Tableau de bord de l'Administrateur</h1>
                <ul>
                    <li>
                        <Link to="/DashboardAdmin/FormAll">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Enregistrement utilisateurs
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/EmploisTemps">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Gérer les emplois de temps
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/UserAll">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Gérer les Utilisateurs
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/CoursAll">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Gérer les cours
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/CoursForm">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Enregistrement des Cours
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/CyClass">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Enregistrement des Cycles et Classes
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/CyClassAll">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Gérer les Cycles et Classes
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/DashboardAdmin/PresenceRapport">
                            <button className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-300">
                                Rapport des presences
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

export default DashboardAdmin;
