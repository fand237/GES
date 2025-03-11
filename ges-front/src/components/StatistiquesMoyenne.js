import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StatistiquesMoyenne() {
    const [statistiques, setStatistiques] = useState({
        totalEleves: 0,
        totalGarcons: 0,
        totalFilles: 0,
        elevesAvecMoyenne: 0,
        elevesSousMoyenne: 0,
        pourcentageReussiteGarcons: 0,
        pourcentageReussiteFilles: 0,
        pourcentageReussiteTotal: 0,
    }); // Initialiser avec des valeurs par défaut
    const [classes, setClasses] = useState([]); // Pour stocker la liste des classes
    const [matieres, setMatieres] = useState([]); // Pour stocker la liste des matières
    const [sequences, setSequences] = useState([]); // Pour stocker la liste des séquences
    const [annees, setAnnees] = useState([]); // Pour stocker la liste des années académiques

    // États pour les filtres
    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [selectedSequence, setSelectedSequence] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');

    const navigate = useNavigate();

    // Charger les données initiales (classes, matières, séquences, années)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les classes
                const classesResponse = await axios.get('http://localhost:3001/Classe',{
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                });
                setClasses(classesResponse.data);

                // Récupérer les matières
                const matieresResponse = await axios.get('http://localhost:3001/Cours');
                setMatieres(matieresResponse.data);

                // Récupérer les séquences
                const sequencesResponse = await axios.get('http://localhost:3001/Sequence');
                setSequences(sequencesResponse.data);

                // Récupérer les années académiques
                const anneesResponse = await axios.get('http://localhost:3001/Annee_Academique');
                setAnnees(anneesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    // Charger les statistiques en fonction des filtres sélectionnés
    useEffect(() => {
        const fetchStatistiques = async () => {
            if (selectedClasse && selectedMatiere && selectedSequence && selectedAnnee) {
                try {
                    const response = await axios.get(
                        `http://localhost:3001/Moyenne/statistiques/${selectedClasse}/${selectedMatiere}/${selectedSequence}/${selectedAnnee}`
                    );
                    setStatistiques(response.data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des statistiques :', error);
                }
            }
        };

        fetchStatistiques();
    }, [selectedClasse, selectedMatiere, selectedSequence, selectedAnnee]);

    return (
        <div className="p-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Statistiques par Classe et Matière</h2>

            {/* Filtres */}
            <div className="flex justify-center space-x-6 mb-8">
                {/* Filtre pour les classes */}
                <select
                    className="p-3 border rounded bg-white shadow"
                    value={selectedClasse}
                    onChange={(e) => setSelectedClasse(e.target.value)}
                >
                    <option value="">Sélectionnez une classe</option>
                    {classes.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                            {classe.classe}
                        </option>
                    ))}
                </select>

                {/* Filtre pour les matières */}
                <select
                    className="p-3 border rounded bg-white shadow"
                    value={selectedMatiere}
                    onChange={(e) => setSelectedMatiere(e.target.value)}
                >
                    <option value="">Sélectionnez une matière</option>
                    {matieres.map((matiere) => (
                        <option key={matiere.id} value={matiere.id}>
                            {matiere.matiere}
                        </option>
                    ))}
                </select>

                {/* Filtre pour les séquences */}
                <select
                    className="p-3 border rounded bg-white shadow"
                    value={selectedSequence}
                    onChange={(e) => setSelectedSequence(e.target.value)}
                >
                    <option value="">Sélectionnez une séquence</option>
                    {sequences.map((sequence) => (
                        <option key={sequence.id} value={sequence.id}>
                            {sequence.sequence}
                        </option>
                    ))}
                </select>

                {/* Filtre pour les années académiques */}
                <select
                    className="p-3 border rounded bg-white shadow"
                    value={selectedAnnee}
                    onChange={(e) => setSelectedAnnee(e.target.value)}
                >
                    <option value="">Sélectionnez une année</option>
                    {annees.map((annee) => (
                        <option key={annee.id} value={annee.id}>
                            {annee.annee}
                        </option>
                    ))}
                </select>
            </div>

            {/* Affichage des statistiques */}
            {statistiques && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Résultats des statistiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Total élèves :</strong> {statistiques.totalEleves}</p>
                        <p><strong>Total garçons :</strong> {statistiques.totalGarcons}</p>
                        <p><strong>Total filles :</strong> {statistiques.totalFilles}</p>
                        <p><strong>Élèves avec la moyenne :</strong> {statistiques.elevesAvecMoyenne}</p>
                        <p><strong>Élèves sous la moyenne :</strong> {statistiques.elevesSousMoyenne}</p>
                        <p><strong>Garçons avec la moyenne :</strong> {statistiques.garconsAvecMoyenne}</p>
                        <p><strong>Filles avec la moyenne :</strong> {statistiques.fillesAvecMoyenne}</p>
                        <p>
                            <strong>Pourcentage de réussite garçons :</strong>{' '}
                            {statistiques.pourcentageReussiteGarcons
                                ? statistiques.pourcentageReussiteGarcons.toFixed(2)
                                : 0}%
                        </p>
                        <p>
                            <strong>Pourcentage de réussite filles :</strong>{' '}
                            {statistiques.pourcentageReussiteFilles
                                ? statistiques.pourcentageReussiteFilles.toFixed(2)
                                : 0}%
                        </p>
                        <p>
                            <strong>Pourcentage de réussite total :</strong>{' '}
                            {statistiques.pourcentageReussiteTotal
                                ? statistiques.pourcentageReussiteTotal.toFixed(2)
                                : 0}%
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatistiquesMoyenne;