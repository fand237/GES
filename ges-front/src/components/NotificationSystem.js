import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import UseAuthEleve from './UseAuthEleve';
import config from "../config/config";

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const NotificationSystem = () => {
    const { idEleve } = UseAuthEleve();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const socketRef = useRef();

    useEffect(() => {
        if (!idEleve) return;

        const socket = io('http://localhost:3001', {
            transports: ['websocket'],
            auth: {
                token: localStorage.getItem('accessToken')
            }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connecté aux notifications');
        });

        socket.on('newNotification', (notification) => {
            setNotifications(prev => [{
                ...notification,
                id: Date.now(), // Génère un ID unique basé sur le timestamp
                date: new Date()
            }, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, [idEleve]);

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const handleNotificationClick = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 relative focus:outline-none"
            >
                <BellIcon />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {notifications.filter(n => !n.read).length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b">
                        <span className="font-medium">Notifications</span>
                        <button
                            onClick={clearAllNotifications}
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            Tout effacer
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-4 text-center text-gray-500">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b cursor-pointer ${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
                                    onClick={() => handleNotificationClick(notification.id)}
                                >
                                    <div className="font-medium text-gray-900">
                                        {notification.title}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {notification.message}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {notification.date.toLocaleTimeString()}
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