import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import UseAuthEnseignant from './UseAuth';
import config from "../config/config";

const ChatInterfaceDesEnseignant = ({ classeId }) => {
    const { idens } = UseAuthEnseignant();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [eleves, setEleves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const socketRef = useRef();
    const messagesEndRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [conversationsRes, elevesRes] = await Promise.all([
                    axios.get(`${config.api.baseUrl}/Conversation/Enseignant/${idens}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get(`${config.api.baseUrl}/Eleve/elevesParEnseignant/${idens}`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    })
                ]);

                setConversations(conversationsRes.data);
                const existingParticipants = new Set(
                    conversationsRes.data.flatMap(conv =>
                        conv.participants.map(p => p.id)
                    )
                );
                setEleves(elevesRes.data.filter(e => !existingParticipants.has(e.id)));
                setLoading(false);
            } catch (error) {
                console.error("Erreur de chargement:", error);
                setLoading(false);
            }
        };

        fetchData();

        const socket = io(`${config.api.baseUrl}`, {
            transports: ['websocket'],
            auth: { token: localStorage.getItem("accessToken") },
            withCredentials: true,
            extraHeaders: { "Access-Control-Allow-Origin": "http://localhost:3000" }
        });

        socket.on('connect', () => {
            const token = localStorage.getItem("accessToken");
            if (token) socket.emit('authenticate', token);
        });

        socketRef.current = socket;

        socket.on('newMessage', (message) => {
            if (selectedConversation?.id === message.conversationId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => socket.disconnect();
    }, [idens, classeId, selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async (conversation) => {
        try {
            setSelectedConversation(conversation);
            const response = await axios.get(
                `${config.api.baseUrl}/Conversation/Enseignant/${conversation.id}/messages`,
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
            setMessages(response.data);
            if (socketRef.current) socketRef.current.emit('joinConversation', conversation.id);
        } catch (error) {
            console.error("Erreur de chargement des messages:", error);
        }
    };

    const startNewConversation = async (eleveId) => {
        try {
            const response = await axios.post(
                `${config.api.baseUrl}/Conversation/Enseignant`,
                { enseignantId: idens, eleveId },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
            setConversations(prev => [...prev, response.data]);
            setEleves(prev => prev.filter(e => e.id !== eleveId));
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
                { contenu: newMessage, envoyeurId: idens },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
            setNewMessage('');
        } catch (error) {
            console.error("Erreur d'envoi de message:", error);
        }
    };

    const getInterlocutor = (conversation) => {
        return conversation.participants[0];
    };

    if (loading) return <div className="flex justify-center p-8">Chargement...</div>;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-300">
                <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                    <h1 className="text-xl font-semibold">Messagerie</h1>
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-100" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                                <ul className="py-2 px-3">
                                    <li>
                                        <button
                                            onClick={() => {
                                                document.getElementById('new-chat-modal').showModal();
                                                setMenuOpen(false);
                                            }}
                                            className="block px-4 py-2 text-gray-800 hover:text-gray-400 w-full text-left"
                                        >
                                            Nouvelle conversation
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>

                <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${
                                selectedConversation?.id === conv.id ? 'bg-gray-200' : ''
                            }`}
                            onClick={() => loadMessages(conv)}
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium">
                                        {getInterlocutor(conv)?.prenom.charAt(0)}
                                        {getInterlocutor(conv)?.nom.charAt(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">
                                    {getInterlocutor(conv)?.prenom} {getInterlocutor(conv)?.nom}
                                </h2>
                                <p className="text-gray-600 truncate">
                                    {conv.messages[0]?.contenu || 'Aucun message'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        <header className="bg-white p-4 text-gray-700 border-b border-gray-300">
                            <h1 className="text-xl font-semibold">
                                {getInterlocutor(selectedConversation)?.prenom} {getInterlocutor(selectedConversation)?.nom}
                                <span className="text-sm text-gray-500 ml-2">
                                    {getInterlocutor(selectedConversation)?.classeEleve?.classe}
                                </span>
                            </h1>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex mb-4 ${msg.envoyeurType === 'enseignant' ? 'justify-end' : ''}`}
                                >
                                    {msg.envoyeurType !== 'enseignant' && (
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 text-sm font-medium">
                                                    {getInterlocutor(selectedConversation)?.prenom.charAt(0)}
                                                    {getInterlocutor(selectedConversation)?.nom.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`flex max-w-96 rounded-lg p-3 gap-3 ${
                                        msg.envoyeurType === 'enseignant'
                                            ? 'bg-indigo-500 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 rounded-bl-none'
                                    }`}>
                                        <p>{msg.contenu}</p>
                                    </div>
                                    {msg.envoyeurType === 'enseignant' && (
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 text-sm font-medium">ME</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="bg-white border-t border-gray-300 p-4">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-indigo-600"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6">
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
                        {eleves.length > 0 ? (
                            eleves.map(eleve => (
                                <div
                                    key={eleve.id}
                                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center"
                                    onClick={() => {
                                        startNewConversation(eleve.id);
                                        document.getElementById('new-chat-modal').close();
                                    }}
                                >
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium">
                                                {eleve.prenom.charAt(0)}{eleve.nom.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">{eleve.prenom} {eleve.nom}</p>
                                        <p className="text-sm text-gray-500">{eleve.classeNom}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Aucun élève disponible pour une nouvelle conversation
                            </p>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ChatInterfaceDesEnseignant;