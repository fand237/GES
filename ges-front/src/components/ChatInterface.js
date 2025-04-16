import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import UseAuthEleve from './UseAuthEleve';
import config from "../config/config";


const ChatInterface = ({ classeId }) => {
    const { idEleve } = UseAuthEleve();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [classmates, setClassmates] = useState([]); // Renommé pour plus de clarté
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les conversations ET les camarades de classe en parallèle
                const [conversationsRes, classmatesRes] = await Promise.all([
                    axios.get(`${config.api.baseUrl}/Conversation/${idEleve}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get(`${config.api.baseUrl}/Eleve/classmates/${idEleve}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    })
                ]);

                setConversations(conversationsRes.data);
                console.log("les conversations sont ", conversationsRes.data)

                // Filtrer l'élève actuel et ceux avec qui il a déjà une conversation
                const existingParticipants = new Set(
                    conversationsRes.data.flatMap(conv =>
                        conv.participants.map(p => p.id)
                    )
                );

                setClassmates(
                    classmatesRes.data.filter(e =>
                        e.id !== idEleve && !existingParticipants.has(e.id)
                    )
                );

                setLoading(false);
            } catch (error) {
                console.error("Erreur de chargement:", error);
                setLoading(false);
            }
        };

        fetchData();

        // 1. Création de la connexion Socket.io
        const socket = io(`${config.api.baseUrl}`, {
            transports: ['websocket'], // Force WebSocket
            auth: {
                token: localStorage.getItem("accessToken")
            },
            withCredentials: true,
            extraHeaders: {
                "Access-Control-Allow-Origin": "http://localhost:3000"
            }
        });

        // Après la connexion, envoyer le token
        socket.on('connect', () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                socket.emit('authenticate', token); // Envoyer juste le token directement
            } else {
                console.error('Aucun token trouvé dans le localStorage');
                // Gérer le cas où l'utilisateur n'est pas connecté
            }
        });

        // 2. Stocker la référence du socket
        socketRef.current = socket;

        // 3. Écoute des événements
        socket.on('newMessage', (message) => {
            if (selectedConversation?.id === message.conversationId) {
                setMessages(prev => [...prev, message]);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        // 4. Rejoindre la room de la conversation actuelle SI une conversation est sélectionnée
        if (selectedConversation) {
            socket.emit('joinConversation', selectedConversation.id);
        }

        // 5. Nettoyage
        return () => {
            socket.disconnect();
        };


    }, [idEleve, classeId, selectedConversation]);


    const handleNewMessage = (message) => {
        if (selectedConversation?.id === message.conversationId) {
            setMessages(prev => [...prev, message]);
        }
    };

    const loadMessages = async (conversation) => {
        try {
            setSelectedConversation(conversation);

            const response = await axios.get(
                `${config.api.baseUrl}/Conversation/${conversation.id}/messages`,
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
            setMessages(response.data);

            if (socketRef.current) {
                socketRef.current.emit('joinConversation', conversation.id);
            }

        } catch (error) {
            console.error("Erreur de chargement des messages:", error);
        }
    };

    const startNewConversation = async (classmateId) => {
        try {
            console.log("Tentative de création avec:", idEleve, classmateId);

            const response = await axios.post(
                `${config.api.baseUrl}/Conversation`, // Notez le /api/ ajouté
                {
                    eleveId: idEleve,
                    participantId: classmateId
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }

            );
            console.log("resuktat du post de nouveau conversation",response.data);
            setConversations(prev => [...prev, response.data]);
            setClassmates(prev => prev.filter(e => e.id !== classmateId));
            loadMessages(response.data);
        } catch (error) {
            console.error("Détails de l'erreur:", error.response?.data || error.message);
        }
    };
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const response = await axios.post(
                `${config.api.baseUrl}/Conversation/${selectedConversation.id}/messages`,
                { contenu: newMessage, envoyeurId: idEleve },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );

            setNewMessage('');

        } catch (error) {
            console.error("Erreur d'envoi de message:", error);
        }
    };

    const getInterlocutor = (conversation) => {
        return conversation.participants.find(p => p.id !== idEleve);
    };

    if (loading) return <div className="flex justify-center p-8">Chargement...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Messagerie</h2>
                    <button
                        onClick={() => document.getElementById('new-chat-modal').showModal()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Nouvelle conversation
                    </button>
                </div>

                {/* Liste des conversations existantes */}
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                selectedConversation?.id == conv.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => loadMessages(conv)}
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <span className="text-blue-600 font-medium">
                                        {getInterlocutor(conv)?.prenom.charAt(0)}
                                        {getInterlocutor(conv)?.nom.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {getInterlocutor(conv)?.prenom} {getInterlocutor(conv)?.nom}
                                    </p>
                                    {conv.messages[0] && (
                                        <p className="text-sm text-gray-500 truncate">
                                            {conv.messages[0].contenu}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de conversation principale */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b bg-white flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-medium">
                                    {getInterlocutor(selectedConversation)?.prenom.charAt(0)}
                                    {getInterlocutor(selectedConversation)?.nom.charAt(0)}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold">
                                {getInterlocutor(selectedConversation)?.prenom} {getInterlocutor(selectedConversation)?.nom}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`mb-4 flex ${
                                        msg.envoyeur.id === idEleve ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.envoyeur.id === idEleve
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white border border-gray-200'
                                    }`}>
                                        <p>{msg.contenu}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t bg-white">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 border p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Écrivez un message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation sélectionnée</h3>
                            <p className="text-gray-500">Sélectionnez une conversation ou démarrez-en une nouvelle</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal pour nouvelle conversation */}
            <dialog id="new-chat-modal" className="modal">
                <div className="modal-box max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Nouvelle conversation</h3>
                        <button
                            onClick={() => document.getElementById('new-chat-modal').close()}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {classmates.length > 0 ? (
                            classmates.map(classmate => (
                                <div
                                    key={classmate.id}
                                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center"
                                    onClick={() => {
                                        startNewConversation(classmate.id);
                                        document.getElementById('new-chat-modal').close();
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-medium">
                                            {classmate.prenom.charAt(0)}{classmate.nom.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{classmate.prenom} {classmate.nom}</p>
                                        <p className="text-sm text-gray-500">{classmate.nomUtilisateur}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Aucun nouveau camarade de classe disponible
                            </p>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ChatInterface;