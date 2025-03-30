import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import UseAuthEleve from './UseAuthEleve';


const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const NotificationSystem = () => {
    const { idEleve } = UseAuthEleve();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = React.useRef();

    useEffect(() => {
        if (!idEleve) return;

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Configuration de la connexion avec gestion des erreurs
        const socketOptions = {
            path: '/socket.io',
            transports: ['websocket'],
            auth: { token },
            query: { userId: idEleve },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000
        };

        socketRef.current = io('http://localhost:3001', socketOptions);

        // Gestion des événements
        socketRef.current.on('connect', () => {
            console.log('Connecté au serveur Socket.IO');
            socketRef.current.emit('authenticate', token);
        });

        socketRef.current.on('newNotification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('Déconnecté:', reason);
            if (reason === 'io server disconnect') {
                socketRef.current.connect();
            }
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Erreur de connexion:', err.message);
            setTimeout(() => socketRef.current.connect(), 1000);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.off('newNotification');
                socketRef.current.disconnect();
            }
        };
    }, [idEleve]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        socketRef.current?.emit('markNotificationAsRead', id);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="py-1 max-h-96 overflow-y-auto">
                        <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100">
                            Notifications
                        </div>
                        {notifications.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-2 text-sm cursor-pointer ${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="font-medium text-gray-900">
                                        {notification.title}
                                    </div>
                                    <div className="text-gray-500">
                                        {notification.message}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.date).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationSystem;