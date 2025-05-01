import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UseAuthEleve from './UseAuthEleve';
import config from "../config/config";
import autoTable from 'jspdf-autotable';

const TimetableDropAreaClasse = ({ classes, jours, classeNom }) => {
    const { idEleve } = UseAuthEleve();


    const timeSlots = [
        { heureDebut: '07:30:00', heureFin: '08:20:00' },
        { heureDebut: '08:20:00', heureFin: '09:10:00' },
        { heureDebut: '09:10:00', heureFin: '10:00:00' },
        { heureDebut: '10:00:00', heureFin: '10:15:00' },  // Pause
        { heureDebut: '10:15:00', heureFin: '11:05:00' },
        { heureDebut: '11:05:00', heureFin: '11:55:00' },
        { heureDebut: '11:55:00', heureFin: '12:25:00' },  // Pause
        { heureDebut: '12:25:00', heureFin: '13:15:00' },
        { heureDebut: '13:15:00', heureFin: '14:05:00' },
        { heureDebut: '14:05:00', heureFin: '14:55:00' },
    ];

    const [preFilledCourses, setPreFilledCourses] = useState([]);
    const timetableRef = useRef(null);

    const fetchPreFilledCourses = useCallback(async () => {
            try {
                const response = await axios.get(`${config.api.baseUrl}/Jour_Cours/byele/${idEleve}`, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                });

                const coursesWithDetails = await Promise.all(
                    response.data.map(async (course) => {
                        const coursDetails = await axios.get(`${config.api.baseUrl}/Cours/${course.cours.id}`, {
                            headers: {
                                accessToken: localStorage.getItem("accessToken"),
                            },
                        });
                        const enseignantDetails = await axios.get(`${config.api.baseUrl}/Enseignants/${coursDetails.data.Enseignant}`, {
                            headers: {
                                accessToken: localStorage.getItem("accessToken"),
                            },
                        });

                        return {
                            ...course,
                            cours: coursDetails.data,
                            enseignant: enseignantDetails.data,
                        };
                    })
                );
                setPreFilledCourses(coursesWithDetails);
            } catch (error) {
                console.error('Erreur lors de la récupération des cours : ', error);
            }

    }, [idEleve]);

    useEffect(() => {
        fetchPreFilledCourses();
    }, [fetchPreFilledCourses]);

    const renderDayHeaders = (jours) => {
        return (
            <div className="flex border-b border-black overflow-x-auto">
                <div className="p-2 w-24 md:w-40 h-16 md:h-20 flex-shrink-0"></div>
                {jours.map((jour, index) => (
                    <div key={index} className="p-2 w-24 md:w-40 h-16 md:h-20 text-center flex-shrink-0">
                        <p className="text-xs md:text-base">{jour.jour}</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderTimetableRows = () => {
        return timeSlots.map((slot, rowIndex) => (
            <div key={rowIndex} className="flex overflow-x-auto">
                {/* Time slot column */}
                <div className="p-1 md:p-2 w-24 md:w-40 h-16 md:h-20 text-center border flex-shrink-0">
                    <p className="text-xs md:text-sm">{`${slot.heureDebut.substring(0, 5)} - ${slot.heureFin.substring(0, 5)}`}</p>
                </div>

                {/* Course columns */}
                {jours.map((jour, colIndex) => {
                    const isPauseRow = (rowIndex === 3 || rowIndex === 6);
                    const cellId = `cell-${rowIndex}-${colIndex}`;

                    const course = preFilledCourses.find(c =>
                        c.jour === jour.id && c.heureDebut === slot.heureDebut
                    );

                    return (
                        <div
                            key={colIndex}
                            id={cellId}
                            className={`p-1 md:p-2 w-24 md:w-40 h-16 md:h-20 text-center border flex-shrink-0 ${isPauseRow ? 'bg-gray-100' : ''}`}
                        >
                            {isPauseRow ? (
                                <p className="text-xs md:text-sm">Pause</p>
                            ) : course ? (
                                <div className="overflow-hidden">
                                    <p className="text-xs md:text-sm font-medium truncate">{course.cours.matiere}</p>
                                    <p className="text-xs md:text-sm text-black-500 truncate">
                                        {course.enseignant.nom} {course.enseignant.prenom}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">Vide</p>
                            )}
                        </div>
                    );
                })}
            </div>
        ));
    };

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm'
        });

        // Titre
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Emploi du temps de la classe ${classeNom}`, 105, 15, { align: 'center' });

        // Préparation des données
        const headers = ['Créneau', ...jours.map(j => j.jour)];
        const body = timeSlots.map((slot, rowIndex) => {
            const isPauseRow = (rowIndex === 3 || rowIndex === 6);

            const row = [
                `${slot.heureDebut.substring(0, 5)} - ${slot.heureFin.substring(0, 5)}`,
                ...jours.map(jour => {
                    if (isPauseRow) return 'PAUSE';

                    const course = preFilledCourses.find(c =>
                        c.jour === jour.id && c.heureDebut === slot.heureDebut
                    );

                    return course
                        ? `${course.cours.matiere}\n${course.enseignant.nom} ${course.enseignant.prenom}`
                        : 'Vide';
                })
            ];
            return row;
        });

        // Génération du tableau
        autoTable(doc, {
            head: [headers],
            body: body,
            startY: 25,
            headStyles: {
                fillColor: '#f0f0f0',
                textColor: '#000',
                fontSize: 10,
                bold: true
            },
            bodyStyles: {
                fontSize: 8,
                textColor: '#000'
            },
            alternateRowStyles: {
                fillColor: '#f9f9f9'
            },
            columnStyles: {
                0: { cellWidth: 25 }
            },
            margin: { top: 20 },
            styles: {
                cellPadding: 2,
                overflow: 'linebreak'
            },
            didDrawCell: (data) => {
                if (data.cell.raw === 'PAUSE') {
                    doc.setFillColor('#e0e0e0');
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                }
            }
        });

        doc.save(`Emploi du temps - ${classeNom}.pdf`);
    };

    return (
        <div className="p-2 md:p-4">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-4">{`Emploi du temps de la classe ${classeNom}`}</h2>
            <div className="overflow-x-auto">
                <div ref={timetableRef} className="border p-2 md:p-5 min-w-max">
                    {renderDayHeaders(jours)}
                    {renderTimetableRows()}
                </div>
            </div>
            <button
                onClick={generatePDF}
                className="mt-2 md:mt-4 px-3 py-1 md:p-2 bg-blue-500 text-white rounded text-sm md:text-base hover:bg-blue-600 transition-colors"
            >
                Télécharger PDF
            </button>
        </div>
    );
};

const TimeTableClasse = () => {
    const [jours, setJours] = useState([]);
    const { idEleve } = UseAuthEleve();
    const [eleveNom, setEleveNom] = useState("");

    const fetchData = async () => {
        try {
            // Récupérer les jours
            const joursResponse = await axios.get(`${config.api.baseUrl}/Jour`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            });
            setJours(joursResponse.data);

        } catch (error) {
            console.error('Erreur lors de la récupération des données : ', error);
        }
    };

    const fetchEleveNom = async () => {
        if (idEleve) {
            try {
                const response = await axios.get(`${config.api.baseUrl}/Eleve/${idEleve}`, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                });
                console.log("le resultat de eleve",response.data)
                const nom = response.data.civilite+' '+response.data.nom+' '+response.data.prenom;
                setEleveNom(nom);
            } catch (error) {
                console.error('Erreur lors de la récupération du nom de l\'eleve : ', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        fetchEleveNom();
    }, [idEleve]);



    return (
        <div>
                <TimetableDropAreaClasse
                    jours={jours}
                    classeNom={eleveNom}

                />


        </div>
    );
};

export default TimeTableClasse;