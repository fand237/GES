import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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

    // Chargement des données initiales
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [niveauxRes, sequencesRes, anneesRes] = await Promise.all([
                    axios.get('http://localhost:3001/Niveau', {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get('http://localhost:3001/Sequence', {
                        headers: { accessToken: localStorage.getItem("accessToken") }
                    }),
                    axios.get('http://localhost:3001/Annee_Academique', {
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
                        axios.get(`http://localhost:3001/Cours/byNiveau/${selectedNiveau}`, {
                            headers: { accessToken: localStorage.getItem("accessToken") }
                        }),
                        axios.get(`http://localhost:3001/Classe/byNiveau/${selectedNiveau}`, {
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
                        'http://localhost:3001/PlanningExamen',
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
            .replace(/(\d+)/, (match) => match === '1' ? '1er' : match);
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
            setStartTime(updated.length > 0 ? updated[updated.length - 1].heureFin : '07:30');
        }
    };

    const handleSave = async () => {
        if (planning.length === 0) {
            alert('Le planning est vide');
            return;
        }

        try {
            await axios.post(
                'http://localhost:3001/PlanningExamen',
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

    // Exportation en PDF avec jsPDF uniquement
    const exportToPDF = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        let yPos = 20;

        // En-tête
        pdf.setFontSize(18);
        pdf.text(`Planning des évaluations de la ${sequences.find(s => s.id == selectedSequence)?.sequence || ''}`,
            pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
        yPos += 10;

        pdf.setFontSize(14);
        pdf.text(`Niveau: ${niveaux.find(n => n.id == selectedNiveau)?.nom || ''}`,
            pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
        yPos += 10;

        pdf.text(`Année académique: ${anneesAcademiques.find(a => a.id == selectedAnneeAcademique)?.annee || ''}`,
            pdf.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
        yPos += 20;

        // En-têtes de colonnes
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        const headers = ['Date', 'Matière', 'Horaire', 'Durée'];
        const colWidths = [40, 80, 40, 30];
        let xPos = margin;

        headers.forEach((header, i) => {
            pdf.text(header, xPos + colWidths[i] / 2, yPos, { align: 'center' });
            xPos += colWidths[i];
        });

        yPos += 10;
        pdf.setFont(undefined, 'normal');
        pdf.setDrawColor(200);
        pdf.line(margin, yPos - 5, margin + pageWidth, yPos - 5);

        // Contenu du tableau
        Object.entries(groupedPlanning).forEach(([date, items]) => {
            // Vérifier si on a besoin d'une nouvelle page
            if (yPos > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage();
                yPos = 20;
            }

            // Date groupée
            pdf.setFont(undefined, 'bold');
            pdf.text(formatFrenchDate(date), margin, yPos);
            yPos += 10;

            pdf.setFont(undefined, 'normal');
            items.forEach(item => {
                // Vérifier si on a besoin d'une nouvelle page pour l'item
                if (yPos > pdf.internal.pageSize.getHeight() - 20) {
                    pdf.addPage();
                    yPos = 20;
                }

                xPos = margin;
                const rowData = [
                    '', // La date est déjà affichée
                    item.matiereNom,
                    `${item.heureDebut} - ${item.heureFin}`,
                    formatDuration(item.duree)
                ];

                rowData.forEach((text, i) => {
                    pdf.text(text, xPos + colWidths[i] / 2, yPos, { align: 'center' });
                    xPos += colWidths[i];
                });

                yPos += 10;
                pdf.line(margin, yPos - 5, margin + pageWidth, yPos - 5);
            });
        });

        pdf.save(`planning-${selectedSequence}-${selectedNiveau}.pdf`);
    };

    // Exportation en Word (inchangé)
    const exportToWord = async () => {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: `Planning des évaluations de la ${sequences.find(s => s.id == selectedSequence)?.sequence || ''}`,
                        heading: HeadingLevel.HEADING_1,
                        alignment: 'center',
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Niveau: ${niveaux.find(n => n.id == selectedNiveau)?.nom || ''}`,
                                bold: true
                            })
                        ],
                        alignment: 'center',
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Année académique: ${anneesAcademiques.find(a => a.id == selectedAnneeAcademique)?.annee || ''}`,
                                bold: true
                            })
                        ],
                        alignment: 'center',
                        spacing: { after: 200 }
                    }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: 'single', size: 8, color: 'AAAAAA' },
                            bottom: { style: 'single', size: 8, color: 'AAAAAA' },
                            left: { style: 'single', size: 8, color: 'AAAAAA' },
                            right: { style: 'single', size: 8, color: 'AAAAAA' },
                            insideHorizontal: { style: 'single', size: 8, color: 'AAAAAA' },
                            insideVertical: { style: 'single', size: 8, color: 'AAAAAA' }
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Date")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                                    new TableCell({ children: [new Paragraph("Matière")], width: { size: 35, type: WidthType.PERCENTAGE } }),
                                    new TableCell({ children: [new Paragraph("Horaire")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                    new TableCell({ children: [new Paragraph("Durée")], width: { size: 20, type: WidthType.PERCENTAGE } })
                                ]
                            }),
                            ...Object.entries(groupedPlanning).flatMap(([date, items]) => [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(formatFrenchDate(date))],
                                            rowSpan: items.length,
                                            verticalAlign: VerticalAlign.CENTER
                                        }),
                                        new TableCell({ children: [new Paragraph(items[0].matiereNom)] }),
                                        new TableCell({ children: [new Paragraph(`${items[0].heureDebut} - ${items[0].heureFin}`)] }),
                                        new TableCell({ children: [new Paragraph(formatDuration(items[0].duree))] })
                                    ]
                                }),
                                ...items.slice(1).map(item => new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph(item.matiereNom)] }),
                                        new TableCell({ children: [new Paragraph(`${item.heureDebut} - ${item.heureFin}`)] }),
                                        new TableCell({ children: [new Paragraph(formatDuration(item.duree))] })
                                    ]
                                }))
                            ])
                        ]
                    })
                ]
            }]
        });

        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, `planning-${selectedSequence}-${selectedNiveau}.docx`);
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
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            disabled={isLoading || planning.length === 0}
                        >
                            Sauvegarder
                        </button>

                        <button
                            onClick={exportToPDF}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            disabled={isLoading || planning.length === 0}
                        >
                            Exporter PDF
                        </button>

                        <button
                            onClick={exportToWord}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            disabled={isLoading || planning.length === 0}
                        >
                            Exporter Word
                        </button>
                    </div>
                </div>
            )}

            {/* Affichage du planning */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
            </div>
        </div>
    );
};

export default PlanningExamen;