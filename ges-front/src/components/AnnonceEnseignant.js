// components/AnnoncesEnseignant.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UseAuthEnseignant from './UseAuth';
import { io } from 'socket.io-client';


const AnnonceEnseignant = () => {
    const { idens } = UseAuthEnseignant();
    const [classes, setClasses] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [annonce, setAnnonce] = useState('');
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Charger les classes dont l'enseignant est responsable
        const fetchClasses = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3001/Classe/responsable/${idens}`,
                    {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }
                );
                setClasses(response.data);
                if (response.data.length > 0) {
                    setSelectedClasse(response.data[0].id);
                }
            } catch (error) {
                console.error("Erreur de chargement des classes:", error);
            }
        };

        fetchClasses();

        // Configurer Socket.IO
        const newSocket = io('http://localhost:3001', {
            auth: { token: localStorage.getItem("accessToken") }
        });
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [idens]);

    useEffect(() => {
        if (selectedClasse) {
            loadHistorique(selectedClasse);
        }
    }, [selectedClasse]);

    const loadHistorique = async (classeId) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/Conversation/annonceClasse/${classeId}`,
                {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                }
            );
            setHistorique(response.data);
        } catch (error) {
            console.error("Erreur de chargement de l'historique:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClasse || !annonce.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:3001/Conversation/annonceInst',
                { contenu: annonce, classeId: selectedClasse },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );

            setAnnonce('');
            // Pas besoin de recharger l'historique, le socket s'en charge
        } catch (error) {
            console.error("Erreur d'envoi d'annonce:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Envoyer une annonce</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Classe</label>
                        <select
                            value={selectedClasse}
                            onChange={(e) => setSelectedClasse(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id}>
                                    {classe.classe}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Message</label>
                        <textarea
                            value={annonce}
                            onChange={(e) => setAnnonce(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="3"
                            placeholder="Écrivez votre annonce ici..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer'}
                    </button>
                </form>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Historique des annonces</h2>

                {historique.length === 0 ? (
                    <p>Aucune annonce envoyée pour cette classe</p>
                ) : (
                    <div className="space-y-4">
                        {historique.map((msg) => (
                            <div key={msg.id} className="p-4 border-b">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium">{msg.contenu}</p>
                                    <span className="text-sm text-gray-500">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Envoyé par: {msg.envoyeurEnseignant?.prenom} {msg.envoyeurEnseignant?.nom}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default AnnonceEnseignant;