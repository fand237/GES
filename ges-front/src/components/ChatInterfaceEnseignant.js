import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import UseAuthEleve from './UseAuthEleve';
import config from "../config/config";

const ChatInterfaceEnseignant = ({ classeId }) => {
    const { idEleve } = UseAuthEleve();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [enseignants, setEnseignants] = useState([]);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les conversations ET les enseignants en parallèle
                const [conversationsRes, enseignantsRes] = await Promise.all([
                    axios.get(`${config.api.baseUrl}/Conversation/Enseignant/${idEleve}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get(`${config.api.baseUrl}/Enseignants/enseignantsParEleve/${idEleve}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }).catch(err => {
                        console.error("Détails de l'erreur enseignantsParEleve:", {
                            status: err.response?.status,
                            data: err.response?.data,
                            headers: err.response?.headers
                        });
                        throw err;
                    })
                ]);

                setConversations(conversationsRes.data);

                // Filtrer les enseignants avec qui l'élève a déjà une conversation
                const existingParticipants = new Set(
                    conversationsRes.data.flatMap(conv =>
                        conv.participantsEnseignants.map(p => p.id)
                    )
                );

                setEnseignants(
                    enseignantsRes.data.filter(e =>
                        !existingParticipants.has(e.id)
                    )
                );

                setLoading(false);
            } catch (error) {
                console.error("Erreur de chargement:", error);
                setLoading(false);
            }
        };

        fetchData();

        // Configuration Socket.io
        const socket = io(`${config.api.baseUrl}`, {
            transports: ['websocket'],
            auth: {
                token: localStorage.getItem("accessToken")
            },
            withCredentials: true,
            extraHeaders: {
                "Access-Control-Allow-Origin": "http://localhost:3000"
            }
        });

        socket.on('connect', () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                socket.emit('authenticate', token);
            } else {
                console.error('Aucun token trouvé dans le localStorage');
            }
        });

        socketRef.current = socket;

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

        if (selectedConversation) {
            socket.emit('joinConversation', selectedConversation.id);
        }

        return () => {
            socket.disconnect();
        };

    }, [idEleve, classeId, selectedConversation]);

    const loadMessages = async (conversation) => {
        try {
            setSelectedConversation(conversation);

            const response = await axios.get(
                `${config.api.baseUrl}/Conversation/Enseignant/${conversation.id}/messages`,
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

    const startNewConversation = async (enseignantId) => {
        try {
            const response = await axios.post(
                `${config.api.baseUrl}/Conversation/Enseignant`,
                {
                    enseignantId,
                    eleveId: idEleve
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            );

            setConversations(prev => [...prev, response.data]);
            setEnseignants(prev => prev.filter(e => e.id !== enseignantId));
            loadMessages(response.data);
        } catch (error) {
            console.error("Détails de l'erreur:", error.response?.data || error.message);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await axios.post(
                `${config.api.baseUrl}/Conversation/Enseignant/${selectedConversation.id}/messages`,
                { contenu: newMessage, envoyeurId: idEleve },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );

            setNewMessage('');
        } catch (error) {
            console.error("Erreur d'envoi de message:", error);
        }
    };

    const getInterlocutor = (conversation) => {
        return conversation.participantsEnseignants[0];
    };

    if (loading) return <div className="flex justify-center p-8">Chargement...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Messagerie Enseignants</h2>
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
                                selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
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
                                        msg.envoyeurType === 'eleve' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.envoyeurType === 'eleve'
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
                        <h3 className="text-lg font-bold">Nouvelle conversation avec un enseignant</h3>
                        <button
                            onClick={() => document.getElementById('new-chat-modal').close()}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {enseignants.length > 0 ? (
                            enseignants.map(enseignant => (
                                <div
                                    key={enseignant.id}
                                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center"
                                    onClick={() => {
                                        startNewConversation(enseignant.id);
                                        document.getElementById('new-chat-modal').close();
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-medium">
                                            {enseignant.prenom.charAt(0)}{enseignant.nom.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Prof. {enseignant.nom}</p>
                                        <p className="text-sm text-gray-500">{enseignant.matiere}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Aucun enseignant disponible pour une nouvelle conversation
                            </p>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ChatInterfaceEnseignant;