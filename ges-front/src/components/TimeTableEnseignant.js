import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UseAuth from './UseAuth';
import config from "../config/config";
import autoTable from 'jspdf-autotable';

const TimetableDropArea = ({ classes, jours, ensId, enseignantNom }) => {
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

  const createEmptyTimetable = () => {
    return Array.from({ length: 10 }, () => Array(6).fill(null));
  };

  const [timetable, setTimetable] = useState(createEmptyTimetable());
  const [preFilledCourses, setPreFilledCourses] = useState([]);
  const timetableRef = useRef(null);

  const fetchPreFilledCourses = useCallback(async () => {
    if (ensId) {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Jour_Cours/byens/${ensId}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const coursDetails = await axios.get(`${config.api.baseUrl}/Cours/${course.cours}`, {
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                },
              });
              const enseignantDetails = await axios.get(`${config.api.baseUrl}/Enseignants/${coursDetails.data.Enseignant}`, {
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                },
              });
              const classeDetails = await axios.get(`${config.api.baseUrl}/Classe/${coursDetails.data.classe}`, {
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                },
              });

              return {
                ...course,
                cours: coursDetails.data,
                Enseignant: enseignantDetails.data,
                classe: classeDetails.data,
              };
            })
        );
        setPreFilledCourses(coursesWithDetails);
      } catch (error) {
        console.error('Erreur lors de la récupération des cours pré-remplis : ', error);
      }
    }
  }, [ensId]);

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
    return timetable.map((row, rowIndex) => (
        <div key={rowIndex} className="flex overflow-x-auto">
          {row.map((course, colIndex) => {
            const isPauseRow = (rowIndex === 3 && colIndex) || (rowIndex === 6 && colIndex);
            const cellId = `cell-${rowIndex}-${colIndex}`;
            let preFilledCourse = null;

            if (colIndex > 0) {
              for (let i = 0; i < preFilledCourses.length; i++) {
                const c = preFilledCourses[i];
                if (c.jour === jours[colIndex - 1].id && c.heureDebut === timeSlots[rowIndex].heureDebut) {
                  preFilledCourse = c;
                  break;
                }
              }
            }

            return (
                <div
                    key={colIndex}
                    id={cellId}
                    className={`p-1 md:p-2 ${colIndex === 0 ? 'w-24 md:w-40' : 'w-24 md:w-40'} h-16 md:h-20 text-center border flex-shrink-0 ${isPauseRow ? 'bg-gray-100' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                >
                  {isPauseRow ? (
                      <p className="text-xs md:text-sm">Pause</p>
                  ) : (
                      <>
                        {colIndex === 0 && rowIndex !== -1 ? (
                            <p className="text-xs md:text-sm">{`${timeSlots[rowIndex].heureDebut.substring(0, 5)} - ${timeSlots[rowIndex].heureFin.substring(0, 5)}`}</p>
                        ) : (
                            <div className="overflow-hidden">
                              {preFilledCourse ? (
                                  <>
                                    <p className="text-xs md:text-sm font-medium truncate">{preFilledCourse.classe.classe}</p>
                                    <p className="text-xs md:text-sm text-black-500 truncate">{preFilledCourse.cours.matiere}</p>
                                  </>
                              ) : course ? (
                                  <>
                                    <p className="text-xs md:text-sm font-medium truncate">{course.matiere}</p>
                                    <p className="text-xs md:text-sm text-black-500 truncate">{course.Enseignant.nom}</p>
                                  </>
                              ) : (
                                  <p className="text-xs text-gray-500">Vide</p>
                              )}
                            </div>
                        )}
                      </>
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
    doc.text(`Emploi du temps de ${enseignantNom}`, 105, 15, { align: 'center' });

    // Préparation des données
    const headers = ['Créneau', ...jours.map(j => j.jour)];
    const body = timeSlots.map((slot, rowIndex) => {
      const row = [
        `${slot.heureDebut.substring(0, 5)} - ${slot.heureFin.substring(0, 5)}`,
        ...jours.map((jour, colIndex) => {
          const isPauseRow = (rowIndex === 3 || rowIndex === 6);
          if (isPauseRow) return 'PAUSE';

          const preFilledCourse = preFilledCourses.find(c =>
              c.jour === jour.id && c.heureDebut === slot.heureDebut
          );

          if (preFilledCourse) {
            return `${preFilledCourse.classe.classe}\n${preFilledCourse.cours.matiere}`;
          }

          const course = timetable[rowIndex][colIndex + 1]; // +1 car première colonne est le créneau
          return course
              ? `${course.matiere}\n${course.Enseignant?.nom || ''}`
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

    doc.save(`Emploi du temps - ${enseignantNom}.pdf`);
  };  return (
      <div className="p-2 md:p-4">
        <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-4">{`Emploi du temps de ${enseignantNom}`}</h2>
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

const TimeTableEnseignant = () => {
  const [listOfCours, setListOfCours] = useState([]);
  const [classes, setClasse] = useState([]);
  const [jours, setJours] = useState([]);
  const [ensId, setEnsId] = useState(null);
  const [enseignantNom, setEnseignantNom] = useState("");
  const { idens } = UseAuth();

  const fetchData = async () => {
    const coursResponse = await axios.get(`${config.api.baseUrl}/Cours`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    setListOfCours(coursResponse.data);

    const classeResponse = await axios.get(`${config.api.baseUrl}/Classe`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    setClasse(classeResponse.data);

    const joursResponse = await axios.get(`${config.api.baseUrl}/Jour`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });
    setJours(joursResponse.data);
  };

  const fetchEnseignantNom = async () => {
    if (ensId) {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Enseignants/${ensId}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        console.log("le resultat de enseignant",response.data)
        const nom = response.data.civilite+' '+response.data.nom+' '+response.data.prenom;
        setEnseignantNom(nom);
      } catch (error) {
        console.error('Erreur lors de la récupération du nom de l\'enseignant : ', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setEnsId(idens);
  }, [idens]);

  useEffect(() => {
    fetchEnseignantNom();
  }, [ensId]);

  return (
      <div>
        <TimetableDropArea
            classes={classes}
            jours={jours}
            ensId={ensId}
            enseignantNom={enseignantNom}
        />
      </div>
  );
};

export default TimeTableEnseignant;