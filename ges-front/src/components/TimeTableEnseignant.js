import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UseAuth from './UseAuth';
import config from "../config/config";

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
    return Array.from({ length: 10 }, () => Array(6).fill(null)); // 10 créneaux, 6 jours
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
      <div className="flex border-b border-black">
        <div className="p-2 w-40 h-20"></div> {/* Augmentation de la largeur et de la hauteur */}
        {jours.map((jour, index) => (
          <div key={index} className="p-2 w-40 h-20 text-center"> {/* Augmentation de la largeur et de la hauteur */}
            <p>{jour.jour}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const renderTimetableRows = () => {
    return timetable.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
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
              className={`p-4 ${colIndex === 0 ? 'w-40' : 'w-40'} h-20 text-center border`} // Augmentation des marges et de la taille des cellules
              onDragOver={(e) => e.preventDefault()}
            >
              {isPauseRow ? (
                <p>Pause</p>
              ) : (
                <>
                  {colIndex === 0 && rowIndex !== -1 ? (
                    <p>{`${timeSlots[rowIndex].heureDebut} - ${timeSlots[rowIndex].heureFin}`}</p>
                  ) : (
                    <div>
                      {preFilledCourse ? (
                        <>
                          <p className="text-sm font-medium">{preFilledCourse.classe.classe}</p>
                          <p className="text-sm text-black-500">{preFilledCourse.cours.matiere}</p>
                        </>
                      ) : course ? (
                        <>
                          <p className="text-sm font-medium">{course.matiere}</p>
                          <p className="text-sm text-black-500">{course.Enseignant.nom}</p>
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
    if (!timetableRef.current) {
      return;
    }

    const pdf = new jsPDF();
    const options = {
      scale: 5, // Ajustez la valeur pour augmenter la résolution de capture
      useCORS: true, // Autoriser l'utilisation de ressources cross-origin
    };

    html2canvas(timetableRef.current, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('emploi_du_temps.pdf');
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{`Emploi du temps de ${enseignantNom}`}</h2> {/* Afficher le nom de l'enseignant */}
      <div ref={timetableRef} className="border p-5 relative">
        {renderDayHeaders(jours)}
        {renderTimetableRows()}
      </div>
      <button onClick={generatePDF} className="mt-4 p-2 bg-blue-500 text-white rounded">Télécharger PDF</button>
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
        enseignantNom={enseignantNom} // Passer le nom de l'enseignant en tant que prop
      />
    </div>
  );
};

export default TimeTableEnseignant;
