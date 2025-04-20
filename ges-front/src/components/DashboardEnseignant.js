import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UseAuth from './UseAuth';
import {
    FiMenu,
    FiX,
    FiChevronRight,
    FiChevronLeft,
    FiUserCheck,
    FiEdit,
    FiList,
    FiCalendar,
    FiMessageSquare,
    FiBook
} from 'react-icons/fi';

const DashboardEnseignant = () => {
    const { idens } = UseAuth();
    const [activeTab, setActiveTab] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTabChange = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
        if (isMobile) setMobileMenuOpen(false);
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const menuItems = [
        {
            tab: 'FicheAppel',
            path: `/DashboardEnseignant/FicheAppel/${idens}`,
            label: 'Fiche de Présence',
            icon: <FiUserCheck className="flex-shrink-0" />
        },
        {
            tab: 'NoteForm',
            path: `/DashboardEnseignant/NoteForm/${idens}`,
            label: 'Remplissage des Notes',
            icon: <FiEdit className="flex-shrink-0" />
        },
        {
            tab: 'NoteEval',
            path: `/DashboardEnseignant/NoteEval/${idens}`,
            label: 'Gérer les Notes',
            icon: <FiList className="flex-shrink-0" />
        },
        {
            tab: 'EmploisTemps',
            path: '/DashboardEnseignant/EmploisTempsEnseignant',
            label: 'Mon Emplois de temps',
            icon: <FiCalendar className="flex-shrink-0" />
        },
        {
            tab: 'ChatEnseignantAll',
            path: '/DashboardEnseignant/ChatEnseignantAll',
            label: 'Chat et Annonce',
            icon: <FiMessageSquare className="flex-shrink-0" />
        },
        {
            tab: 'CreerLecons',
            path: '/DashboardEnseignant/LeconGen',
            label: 'Créer des leçons',
            icon: <FiBook className="flex-shrink-0" />
        }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Bouton de menu pour mobile */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
            >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Sidebar */}
            <nav className={`
                fixed md:relative top-16 left-0 h-[calc(100%-4rem)] bg-gradient-to-b from-purple-500 to-purple-800 text-white shadow-lg
                transition-all duration-300 ease-in-out z-40
                ${isMobile ?
                (mobileMenuOpen ? 'w-64 translate-x-0' : '-translate-x-full') :
                (isCollapsed ? 'w-20' : 'w-64')
            }
            `}>
                <div className="p-4 h-full flex flex-col">
                    {/* En-tête avec bouton de repli */}
                    <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'} mb-6`}>
                        {(!isCollapsed || isMobile) && (
                            <h1 className="text-xl font-bold">
                                {isMobile ? 'Menu' : 'Tableau de bord'}
                            </h1>
                        )}
                        {!isMobile && (
                            <button
                                onClick={toggleSidebar}
                                className="text-white hover:bg-purple-700 p-1 rounded-full"
                            >
                                {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
                            </button>
                        )}
                    </div>

                    {/* Menu items */}
                    <ul className="flex-1 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <li key={item.tab}>
                                <button
                                    className={`
                                        w-full flex items-center px-4 py-3 rounded-lg transition
                                        ${activeTab === item.tab ?
                                        'bg-purple-600 font-semibold' :
                                        'hover:bg-purple-700'
                                    }
                                    `}
                                    onClick={() => handleTabChange(item.tab, item.path)}
                                    title={isCollapsed && !isMobile ? item.label : ''}
                                >
                                    <span className="mr-3 flex items-center justify-center" style={{ minWidth: '24px' }}>
                                        {item.icon}
                                    </span>
                                    {(!isCollapsed || isMobile) && (
                                        <span>{item.label}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Pied de page */}
                    {(!isCollapsed || isMobile) && (
                        <footer className="mt-auto pt-4 text-center text-xs">
                            <p>
                                &copy; {new Date().getFullYear()} Tous droits réservés.<br />
                                Gestionnaire d'établissement scolaire
                            </p>
                        </footer>
                    )}
                </div>
            </nav>

            {/* Main Content */}

            <div className={`
                flex-1 bg-gray-100 p-6 overflow-auto
                transition-all duration-300 ease-in-out
                ${isMobile ? 'ml-0 mt-16' : (isCollapsed ? 'ml-0' : 'ml-0 mt-16')} ml-0 mt-16'}
            `}>
                        <Outlet />
                    </div>
        </div>
    );
};

export default DashboardEnseignant;