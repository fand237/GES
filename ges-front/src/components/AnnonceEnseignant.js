import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UseAuthEnseignant from './UseAuth';
import { io } from 'socket.io-client';
import config from "../config/config";

const AnnonceEnseignant = () => {
    const { idens } = UseAuthEnseignant();
    const [classes, setClasses] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState('');
    const [annonce, setAnnonce] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(
                    `${config.api.baseUrl}/Classe/responsable/${idens}`,
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

        const newSocket = io(`${config.api.baseUrl}`, {
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
                `${config.api.baseUrl}/Conversation/annonceClasse/${classeId}`,
                {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                }
            );
            setHistorique(response.data);
        } catch (error) {
            console.error("Erreur de chargement de l'historique:", error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const removeFile = () => {
        setFile(null);
        setFileName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClasse || (!annonce.trim() && !file)) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('contenu', annonce);
            formData.append('classeId', selectedClasse);
            if (file) {
                formData.append('file', file);
            }

            const response = await axios.post(
                `${config.api.baseUrl}/Conversation/annonceInst`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        accessToken: localStorage.getItem("accessToken")
                    }
                }
            );

            setAnnonce('');
            setFile(null);
            setFileName('');
            loadHistorique(selectedClasse); // Recharger l'historique
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
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Fichier joint</label>
                        {!file ? (
                            <div className="flex items-center">
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border border-gray-300">
                                    <span>Sélectionner un fichier</span>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                <span className="truncate">{fileName}</span>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    ×
                                </button>
                            </div>
                        )}
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
                                {msg.fichierJoint && (
                                    <div className="mt-2">
                                        <a
                                            href={`${config.api.baseUrl}/uploads/${msg.fichierJoint}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                            {msg.fichierJoint.split('_').pop()}
                                        </a>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mt-2">
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