import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import config from "../config/config";

const PlanningExamen = () => {
    // États
    const [niveaux, setNiveaux] = useState([]);
    const [sequences, setSequences] = useState([]);
    const [anneesAcademiques, setAnneesAcademiques] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedNiveau, setSelectedNiveau] = useState('');
    const [selectedSequence, setSelectedSequence] = useState('');
    const [selectedAnneeAcademique, setSelectedAnneeAcademique] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState('');

    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('07:30');
    const [selectedDuree, setSelectedDuree] = useState('60');

    const [planning, setPlanning] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Référence pour le PDF
    const { toPDF, targetRef } = usePDF({
        filename: 'planning_examens.pdf',
        page: {
            margin: 20,
            format: 'a4',
            orientation: 'portrait'
        }
    });

    // Chargement des données initiales
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [niveauxRes, sequencesRes, anneesRes] = await Promise.all([
                    axios.get(`${config.api.baseUrl}/Niveau`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get(`${config.api.baseUrl}/Sequence`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get(`${config.api.baseUrl}/Annee_Academique`, {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    })
                ]);

                setNiveaux(niveauxRes.data);
                setSequences(sequencesRes.data);
                setAnneesAcademiques(anneesRes.data);
            } catch (error) {
                console.error('Erreur chargement données:', error);
                alert('Erreur lors du chargement des données initiales');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Chargement des matières et classes quand le niveau change
    useEffect(() => {
        const loadMatieresEtClasses = async () => {
            if (selectedNiveau) {
                try {
                    const [matieresRes, classesRes] = await Promise.all([
                        axios.get(`${config.api.baseUrl}/Cours/byNiveau/${selectedNiveau}`, {
                            headers: { accessToken: localStorage.getItem("accessToken") }
                        }),
                        axios.get(`${config.api.baseUrl}/Classe/byNiveau/${selectedNiveau}`, {
                            headers: { accessToken: localStorage.getItem("accessToken") }
                        })
                    ]);
                    setMatieres(matieresRes.data);
                    setClasses(classesRes.data);
                    setSelectedMatiere('');
                } catch (error) {
                    console.error('Erreur chargement matières et classes:', error);
                }
            }
        };

        loadMatieresEtClasses();
    }, [selectedNiveau]);

    // Chargement automatique du planning
    useEffect(() => {
        const loadPlanning = async () => {
            if (selectedSequence && selectedAnneeAcademique && selectedNiveau) {
                setIsLoading(true);
                try {
                    const response = await axios.get(
                        `${config.api.baseUrl}/PlanningExamen`,
                        {
                            params: {
                                sequenceId: selectedSequence,
                                anneeAcademiqueId: selectedAnneeAcademique,
                                niveauId: selectedNiveau
                            },
                            headers: { accessToken: localStorage.getItem("accessToken") }
                        }
                    );

                    const sortedData = response.data.sort((a, b) => {
                        const dateCompare = new Date(a.date) - new Date(b.date);
                        if (dateCompare !== 0) return dateCompare;
                        return a.heureDebut.localeCompare(b.heureDebut);
                    });

                    setPlanning(sortedData);

                    if (sortedData.length > 0) {
                        setStartTime(sortedData[sortedData.length - 1].heureFin);
                    } else {
                        setStartTime('07:30');
                    }
                } catch (error) {
                    console.error('Erreur chargement planning:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPlanning([]);
            }
        };

        loadPlanning();
    }, [selectedSequence, selectedAnneeAcademique, selectedNiveau]);

    // Fonctions utilitaires
    const formatDuration = (minutes) => {
        const mins = parseInt(minutes);
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}h${remainingMins > 0 ? `${remainingMins}` : ''}`;
    };

    const calculateEndTime = (start, duration) => {
        const [hours, mins] = start.split(':').map(Number);
        const totalMins = hours * 60 + mins + parseInt(duration);
        const endHours = Math.floor(totalMins / 60) % 24;
        const endMins = totalMins % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    };

    const formatFrenchDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options)
            .replace(/(\d+)/, (match) => {
                return match === '1' ? '1er' : match;
            });
    };

    // Gestion des tranches
    const handleAddOrUpdate = () => {
        if (!selectedMatiere || !selectedDuree || !selectedDate) {
            alert('Veuillez sélectionner une matière, une durée et une date');
            return;
        }

        const matiereSelectionnee = matieres.find(m => m.id == selectedMatiere);

        const newItem = {
            date: selectedDate,
            heureDebut: startTime,
            heureFin: calculateEndTime(startTime, selectedDuree),
            duree: selectedDuree,
            matiereNom: matiereSelectionnee?.matiere || selectedMatiere,
            matiereId: selectedMatiere,
            niveauId: selectedNiveau,
            sequenceId: selectedSequence,
            anneeAcademiqueId: selectedAnneeAcademique,
            classes: classes
        };

        let updatedPlanning;
        if (editingIndex !== null) {
            updatedPlanning = [...planning];
            updatedPlanning[editingIndex] = newItem;
        } else {
            updatedPlanning = [...planning, newItem];
        }

        updatedPlanning.sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.heureDebut.localeCompare(b.heureDebut);
        });

        setPlanning(updatedPlanning);
        setEditingIndex(null);
        setStartTime(newItem.heureFin);
    };

    const handleDelete = (index) => {
        const updated = [...planning];
        updated.splice(index, 1);
        setPlanning(updated);

        if (updated.length === 0 || index === planning.length - 1) {
            setStartTime(updated.length > 0
                ? updated[updated.length - 1].heureFin
                : '07:30');
        }
    };

    const handleSave = async () => {
        if (planning.length === 0) {
            alert('Le planning est vide');
            return;
        }

        try {
            await axios.post(
                `${config.api.baseUrl}/PlanningExamen`,
                {
                    planning: planning.map(item => ({
                        ...item,
                        matiere: item.matiereId
                    })),
                    sequenceId: selectedSequence,
                    anneeAcademiqueId: selectedAnneeAcademique,
                    niveauId: selectedNiveau
                },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            );
            alert('Planning sauvegardé avec succès!');
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    // Grouper par date
    const groupedPlanning = planning.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Gestion du Planning d'Examens par Niveau</h1>

            {/* Bouton d'export PDF */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => toPDF()}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={planning.length === 0}
                >
                    Exporter en PDF
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Séquence</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedSequence}
                            onChange={(e) => setSelectedSequence(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Sélectionnez...</option>
                            {sequences.map(seq => (
                                <option key={seq.id} value={seq.id}>{seq.sequence}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Année Académique</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedAnneeAcademique}
                            onChange={(e) => setSelectedAnneeAcademique(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Sélectionnez...</option>
                            {anneesAcademiques.map(annee => (
                                <option key={annee.id} value={annee.id}>{annee.annee}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Niveau</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedNiveau}
                            onChange={(e) => setSelectedNiveau(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Sélectionnez...</option>
                            {niveaux.map(niveau => (
                                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedNiveau && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Classes du niveau:</h3>
                        <div className="flex flex-wrap gap-2">
                            {classes.map(classe => (
                                <span key={classe.id} className="bg-gray-100 px-3 py-1 rounded">
                                    {classe.classe}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Formulaire d'ajout */}
            {selectedSequence && selectedAnneeAcademique && selectedNiveau && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-semibold mb-3">Ajouter une épreuve</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Matière</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedMatiere}
                                onChange={(e) => setSelectedMatiere(e.target.value)}
                                disabled={isLoading || !selectedNiveau}
                            >
                                <option value="">Sélectionnez...</option>
                                {matieres.map(mat => (
                                    <option key={mat.id} value={mat.id}>{mat.matiere}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Heure début</label>
                            <input
                                type="time"
                                className="w-full p-2 border rounded"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Durée</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedDuree}
                                onChange={(e) => setSelectedDuree(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                                <option value="60">1h</option>
                                <option value="90">1h30</option>
                                <option value="120">2h</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddOrUpdate}
                            className={`px-4 py-2 rounded text-white ${editingIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={isLoading}
                        >
                            {editingIndex !== null ? 'Modifier' : 'Ajouter'}
                        </button>

                        {editingIndex !== null && (
                            <button
                                onClick={() => {
                                    setEditingIndex(null);
                                    setStartTime(planning.length > 0
                                        ? planning[planning.length - 1].heureFin
                                        : '07:30');
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                        )}

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
                            disabled={isLoading || planning.length === 0}
                        >
                            Sauvegarder Planning
                        </button>
                    </div>
                </div>
            )}



            {/* Affichage interactif du planning */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaire</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(groupedPlanning).map(([date, items]) => (
                            <React.Fragment key={date}>
                                <tr className="bg-gray-100">
                                    <td colSpan="5" className="px-6 py-3 font-medium">
                                        {formatFrenchDate(date)}
                                    </td>
                                </tr>
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap"></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.matiereNom}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.heureDebut} - {item.heureFin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDuration(item.duree)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedMatiere(item.matiereId);
                                                    setSelectedDate(item.date);
                                                    setStartTime(item.heureDebut);
                                                    setSelectedDuree(item.duree);
                                                    setEditingIndex(planning.findIndex(i => i === item));
                                                }}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(planning.findIndex(i => i === item))}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>

                    {planning.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            {selectedSequence && selectedAnneeAcademique && selectedNiveau
                                ? "Aucun examen programmé pour cette sélection"
                                : "Veuillez sélectionner une séquence, une année académique et un niveau"}
                        </div>
                    )}
                </div>
                {/* Contenu à exporter en PDF */}
                <div ref={targetRef} className="p-4 bg-white">
                    {/* Espace pour l'en-tête */}
                    <div className="h-24 mb-8 border-b-2 border-gray-200"></div>

                    {/* Titre du planning */}
                    <h2 className="text-xl font-bold text-center mb-2">PLANNING DES EXAMENS</h2>

                    {/* Niveau sélectionné */}
                    {selectedNiveau && (
                        <h3 className="text-lg font-semibold text-center mb-6">
                            Niveau: {niveaux.find(n => n.id == selectedNiveau)?.nom}
                        </h3>
                    )}

                    {/* Tableau du planning */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Matière</th>
                                <th className="border border-gray-300 px-4 py-2">Horaire</th>
                                <th className="border border-gray-300 px-4 py-2">Durée</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(groupedPlanning).map(([date, items]) => (
                                <React.Fragment key={date}>
                                    <tr className="bg-gray-50">
                                        <td colSpan="4" className="border border-gray-300 px-4 py-2 font-semibold">
                                            {formatFrenchDate(date)}
                                        </td>
                                    </tr>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2"></td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.matiereNom}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.heureDebut} - {item.heureFin}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {formatDuration(item.duree)}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>

                        {planning.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                Aucun examen programmé
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanningExamen;