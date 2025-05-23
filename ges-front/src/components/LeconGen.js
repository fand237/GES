import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const LeconGen = () => {
    // Charger les messages depuis le localStorage au démarrage
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('leconGenHistory');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Configuration OpenAI
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const MODEL_NAME = "ft:gpt-4o-mini-2024-07-18:personal:lecon-gen-20250416:BMwC7jaZ";

    // Sauvegarder les messages dans le localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('leconGenHistory', JSON.stringify(messages));
    }, [messages]);

    // Exemples de prompts prédéfinis
    const presetPrompts = [
        "cree une lecon sur l'introduction aux base de donnee en classe de Tle A",
        "cree une lecon sur la gestion des compte utilisateurs en classe de 5eme",
        "Génère un cours sur les bases de données relationnelles"
    ];

    // Fonction de formatage inchangée
    const formatResponse = (text) => {
        let formattedText = text
            .replace(/(\n|^)([IVX]+\.\s+[A-ZÀ-Ý][^\n]*)/g, '$1$2\n\n')
            .replace(/(?:^|\n)(\d+\.\d+\.\s.+?)(?=\s*[A-Z0-9])/g, "\n\n$1")
            .replace(/(?:^|\n)(\d+\.\d+\s.+?)(?=\s*[A-Z0-9])/g, "\n\n$1")
            .replace(/(🎯 .+?:)/g, "\n$1\n")
            .replace(/\s*(\d+\.)/g, "\n$1")
            .replace(/\n{3,}/g, '\n\n');

        return formattedText
            .split('\n')
            .map(line => line.trim() === '' ? line : line)
            .join('\n')
            .trim();
    };

    // Envoyer un message (ajout de timestamp)
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            from: 'user',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            if (!API_KEY) {
                throw new Error("Clé API non configurée");
            }
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: MODEL_NAME,
                    messages: [{ role: "user", content: input }],
                    temperature: 0.4,
                    max_tokens: 4000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const generatedText = formatResponse(response.data.choices[0].message.content);
            const botMessage = {
                text: generatedText,
                from: 'bot',
                timestamp: new Date().toISOString(),
                actions: [
                    { label: 'Copier', action: () => navigator.clipboard.writeText(generatedText) },
                    { label: 'Télécharger', action: () => downloadText(generatedText) }
                ]
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Erreur:', error);
            setMessages(prev => [...prev, {
                text: 'Erreur lors de la génération. Veuillez réessayer.',
                from: 'bot',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Télécharger le texte (inchangé)
    const downloadText = (text) => {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lecon-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
    };

    // Gestion des touches (inchangé)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Auto-scroll vers le bas (inchangé)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus sur l'input au chargement (inchangé)
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Fonction pour effacer l'historique
    const clearHistory = () => {
        if (window.confirm("Voulez-vous vraiment effacer tout l'historique ?")) {
            localStorage.removeItem('leconGenHistory');
            setMessages([]);
        }
    };

    // JSX inchangé sauf l'ajout du bouton d'effacement dans l'en-tête
    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header avec bouton de suppression */}
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Générateur de Leçons Pédagogiques</h1>
                {messages.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="text-sm bg-white text-blue-500 hover:bg-gray-200 px-2 py-1 rounded"
                    >
                        Effacer l'historique
                    </button>
                )}
            </div>

            {/* Le reste du JSX reste strictement identique */}
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Message de bienvenue */}
                <div className="flex items-end mb-4">
                    <img
                        src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                        alt="Bot"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl rounded-bl-none max-w-3xl">
                        Bonjour ! Je suis votre assistant pour générer des leçons pédagogiques. Demandez-moi de créer une leçon sur n'importe quel sujet.
                    </div>
                </div>

                {/* Messages de l'historique */}
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-end mb-4 ${message.from === 'bot' ? '' : 'justify-end'}`}>
                        {message.from === 'bot' && (
                            <img
                                src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                                alt="Bot"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                        )}
                        <div className={`px-4 py-2 rounded-xl max-w-3xl ${message.from === 'bot'
                            ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                            : 'bg-blue-500 text-white rounded-br-none'}`}
                        >
                            <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                            {message.from === 'bot' && message.actions && (
                                <div className="flex mt-2 space-x-2">
                                    {message.actions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={action.action}
                                            className="text-xs px-2 py-1 bg-white text-blue-500 rounded hover:bg-gray-200"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {message.from === 'user' && (
                            <img
                                src="https://i.pravatar.cc/100?img=64"
                                alt="User"
                                className="w-8 h-8 rounded-full ml-2"
                            />
                        )}
                    </div>
                ))}

                {/* Indicateur de saisie en cours */}
                {isTyping && (
                    <div className="flex items-end mb-4">
                        <img
                            src="https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                            alt="Bot"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions de prompts */}
            <div className="px-4 pb-2">
                <div className="flex overflow-x-auto space-x-2 pb-2">
                    {presetPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setInput(prompt);
                                inputRef.current.focus();
                            }}
                            className="flex-shrink-0 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
                        >
                            {prompt.length > 40 ? `${prompt.substring(0, 40)}...` : prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="border-t-2 border-gray-200 px-4 pt-2 pb-4">
                <div className="relative flex">
                    <input
                        type="text"
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Dites quelque chose..."
                        className="flex-1 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 pr-12 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeconGen;