import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UseAuthEleve from './UseAuthEleve';
import { io } from 'socket.io-client';
import config from "../config/config";


const AnnonceEleve = () => {
    const { idEleve } = UseAuthEleve();
    const [classeInfo, setClasseInfo] = useState({});
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nouvelleAnnonce, setNouvelleAnnonce] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        let socket;

        const initialize = async () => {
            try {
                // 1. Récupérer les infos de la classe
                const classeResponse = await axios.get(
                    `${config.api.baseUrl}/Eleve/${idEleve}`,
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                );

                if (!isMounted) return;

                const classeData = classeResponse.data.classeEleve;
                setClasseInfo(classeData);

                // 2. Récupérer les annonces existantes
                const annoncesResponse = await axios.get(
                    `${config.api.baseUrl}/Conversation/annonceClasseEleve/${classeData.id}`,
                    { headers: { accessToken: localStorage.getItem("accessToken") } }
                );

                if (isMounted) {
                    const annoncesTriees = [...annoncesResponse.data].sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setAnnonces(annoncesTriees);
                    setLoading(false);
                }

                // 3. Configurer Socket.IO
                socket = io(config.api.baseUrl, {
                    auth: { token: localStorage.getItem("accessToken") },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000
                });

                socket.on('connect', () => {
                    socket.emit('join_classe', `classe_${classeData.id}`);
                });

                socket.on('nouvelle_annonce', (message) => {
                    if (isMounted) {
                        setAnnonces(prev => [message, ...prev]);
                        setNouvelleAnnonce(message);
                        setTimeout(() => setNouvelleAnnonce(null), 5000);
                    }
                });

                socketRef.current = socket;

            } catch (error) {
                console.error("Erreur d'initialisation:", error);
                if (isMounted) setLoading(false);
            }
        };

        if (idEleve) {
            initialize();
        }

        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.off('nouvelle_annonce');
                socketRef.current.disconnect();
            }
        };
    }, [idEleve]);

    // Fonction pour gérer le téléchargement
    const handleDownload = async (filename) => {
        try {
            const response = await axios.get(
                `${config.api.baseUrl}/Conversation/download/${encodeURIComponent(filename)}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    responseType: 'blob'
                }
            );

            // Extraire le nom de fichier
            let downloadFilename = filename;
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match) downloadFilename = match[1];
            }

            // Créer le lien de téléchargement
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erreur de téléchargement:", error);
            if (error.response?.status === 404) {
                alert("Fichier non trouvé sur le serveur");
            } else if (error.response?.status === 403) {
                alert("Vous n'avez pas la permission de télécharger ce fichier");
            } else {
                alert("Échec du téléchargement");
            }
        }
    };    if (loading) return <div>Chargement...</div>;
    if (!classeInfo.id) return <div>Erreur: Impossible de charger les informations de la classe</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Annonces - {classeInfo.classe}</h2>

            {nouvelleAnnonce && (
                <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500">
                    <p className="font-medium">Nouvelle annonce!</p>
                    <p>{nouvelleAnnonce.contenu}</p>
                    {nouvelleAnnonce.fichierJoint && (
                        <button
                            onClick={() => handleDownload(nouvelleAnnonce.fichierJoint)}
                            className="mt-2 text-blue-600 hover:underline flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Télécharger le fichier joint
                        </button>
                    )}
                    <p className="text-sm text-gray-600">
                        {new Date(nouvelleAnnonce.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            )}

            {annonces.length === 0 ? (
                <p>Aucune annonce pour le moment</p>
            ) : (
                <div className="space-y-3">
                    {annonces.map((annonce) => (
                        <div key={annonce.id} className="p-3 bg-white rounded shadow">
                            <p>{annonce.contenu}</p>

                            {annonce.fichierJoint && (
                                <button
                                    onClick={() => handleDownload(annonce.fichierJoint)}
                                    className="mt-2 text-blue-600 hover:underline flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                    </svg>
                                    Télécharger le fichier joint
                                </button>
                            )}

                            <div className="flex justify-between mt-2 text-sm text-gray-500">
                                <span>
                                    {annonce.envoyeurEnseignant?.prenom} {annonce.envoyeurEnseignant?.nom}
                                </span>
                                <span>
                                    {new Date(annonce.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnonceEleve;