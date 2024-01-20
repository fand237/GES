import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// eslint-disable-next-line
import { PDFDocument } from 'pdf-lib';



const draggableStyle = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
};

const timetableStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  width: '900px', // Ajuster la largeur en fonction de vos besoins
};

 // eslint-disable-next-line
const DraggableItem = ({ course, handleDragStart }) => {
  return (
    <div
      style={{ ...draggableStyle }}
      draggable
      onDragStart={(e) => handleDragStart(e, course)}
    >
      <p>{course.matiere}</p>
      <p>{course.Enseignant.nom}</p>
    </div>
  );
};

const TimetableDropArea = ({ classes, jours, selectedClass, handleClassChange, timetableId }) => {
  
 
  
  const createEmptyTimetable = () => {
    return Array.from({ length: 10 }, () => Array(6).fill(null)); // 10 créneaux, 7 jours
  };

// eslint-disable-next-line
  const [timetable, setTimetable] = useState(createEmptyTimetable());

  // État pour les cours pré-remplis
  const [preFilledCourses, setPreFilledCourses] = useState([]);

  const timetableRef = useRef(null);


  // Fonction pour récupérer les cours associés à l'emploi du temps sélectionné
  const fetchPreFilledCourses = useCallback(async () => {
    if (timetableId) {
      try {
        const response = await axios.get(`http://localhost:3001/Jour_Cours/byens/${timetableId}`);
        
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const coursDetails = await axios.get(`http://localhost:3001/Cours/${course.cours}`);

            const enseignantDetails = await axios.get(
              `http://localhost:3001/Enseignants/${coursDetails.data.Enseignant}`
            );

            const classeDetails = await axios.get(
              `http://localhost:3001/Classe/${coursDetails.data.classe}`
            );

            
            return {
              ...course,
              cours:coursDetails.data,
              Enseignant: enseignantDetails.data,
              classe: classeDetails.data,
            };
          })
        );
        setPreFilledCourses(coursesWithDetails);
        console.log(coursesWithDetails)
      } catch (error) {
        console.error('Erreur lors de la récupération des cours pré-remplis : ', error);
      }
    }
  }, [timetableId]);
  
  

  useEffect(() => {
    fetchPreFilledCourses();
  }, [fetchPreFilledCourses]);



  const renderDayHeaders = (jours) => {
    return (
      <div style={{ display: 'flex', borderBottom: '1px solid black' }}>
        <div
          style={{ ...draggableStyle, width: '100px', height: '50px' }}
        ></div>
        {jours.map((jour, index) => (
          <div
            key={index}
            style={{ ...draggableStyle, width: '80px', height: '50px' }}
          >
            <p>{jour.jour}</p>
          </div>
        ))}
      </div>
    );
  };



  const renderTimetableRows = () => {
    const timeSlots = [
      { heureDebut: '07:30:00', heureFin: '08:20:00' },
      { heureDebut: '08:20:00', heureFin: '09:10:00' },
      { heureDebut: '09:10:00', heureFin: '10:00:00' },
      { heureDebut: '10:00:00', heureFin: '10:15:00' },
      { heureDebut: '10:15:00', heureFin: '11:05:00' },
      { heureDebut: '11:05:00', heureFin: '11:55:00' },
      { heureDebut: '11:55:00', heureFin: '12:25:00' },
      { heureDebut: '12:25:00', heureFin: '13:15:00' },
      { heureDebut: '13:15:00', heureFin: '14:05:00' },
      { heureDebut: '14:05:00', heureFin: '14:55:00' },
    ];

    return timetable.map((row, rowIndex) => (
      
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((course, colIndex) => {
          const isPauseRow = (rowIndex === 3 && colIndex) || (rowIndex === 6 && colIndex);
          const cellId = `cell-${rowIndex}-${colIndex}`;
          // Trouver le cours pré-rempli correspondant à la cellule actuelle
          let preFilledCourse = null;

        if (colIndex > 0) {
          
          for (let i = 0; i < preFilledCourses.length; i++) {
            const c = preFilledCourses[i];
            //console.log('Itération de la boucle, examen du cours :', c);

            if (c.jour === jours[colIndex - 1].id && c.heureDebut === timeSlots[rowIndex].heureDebut) {
              preFilledCourse = c;
              console.log('Cours pré-rempli trouvé ! Contenu de preFilledCourse :', preFilledCourse);
              break;
            }
          }

          //console.log('---- Fin de la recherche ----');
        }
          

         // console.log('contenu de tout les prefile',preFilledCourses)
          //console.log('contenu de prefile',preFilledCourse)



          return (
            <div
              key={colIndex}
              id={cellId}
              style={{
                ...draggableStyle,
                width: colIndex === 0 ? '100px' : '80px',
                height: '50px',
              }}
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
                        // Si le cours pré-rempli existe, affichez-le
                        <>
                          <p>{preFilledCourse.classe.classe}</p>
                          <p>{preFilledCourse.cours.matiere}</p>
                          
                          
                        </>
                      ) : course ? (
                        // Sinon, affichez le cours existant
                        <>
                          <p>{course.matiere}</p>
                          <p>{course.Enseignant.nom}</p>
                        </>
                      ) : (
                        <p>Vide</p>
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
  
      // Définir la taille du PDF en fonction de la zone capturée
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('emploi_du_temps.pdf');
    });
  };
  

  return (
   <div>
    
    <h2>Emploi du temps de</h2>
    <label htmlFor="classSelect">Sélectionner l'enseignant : </label>
        <select
          id="classSelect"
          onChange={(e) => handleClassChange(e.target.value)}
          value={selectedClass ? selectedClass.id : ''}
        >
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.nom}
            </option>
          ))}
        </select>
    <div ref={timetableRef}  style={{ ...timetableStyle, border: '1px solid black', padding: '5px', position: 'relative'  }}>
      
      <div>
        
      </div>
      {renderDayHeaders(jours)}
      {renderTimetableRows()}
      <button onClick={generatePDF}>Télécharger PDF</button>
      
    </div>
    </div>
  );
};
const TimeTableEnseignant = () => {
   // eslint-disable-next-line
  const [listOfCours, setListOfCours] = useState([]);
  const [classes, setClasse] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [jours, setJours] = useState([]);
  const [timetableId, setTimetableId] = useState(null); // Ajouter l'état pour l'ID de l'emploi du temps


  // Fonction pour mettre à jour l'emploi du temps dans la base de données
  const updateTimetable = useCallback(async () => {
    try {
      // Vérifiez si la classe est sélectionnée
      if (selectedClass) {
        // Vérifiez si un emploi du temps existe déjà pour cette classe
        const existingTimetable = await axios.get(`http://localhost:3001/Emplois_temps/byclasse/${selectedClass.id}`);

        let id;


        // Si l'emploi du temps n'existe pas, créez-en un
        if (!existingTimetable.data) {
         
           console.log("ID de l'emploi du temps n'existe pas");
           // eslint-disable-next-line
          const createdTimetable = await axios.post('http://localhost:3001/Emplois_temps', {
            classe: selectedClass.id,
          });
          id = selectedClass.id;
        } else {
          // Si l'emploi du temps existe, récupérez son ID
          console.log("ID de l'emploi du temps existe déjà");
          id = selectedClass.id;
        }

        // Mettez à jour l'état de l'ID de l'emploi du temps
        setTimetableId(id);

        // Utilisez timetableId selon vos besoins
        console.log("ID de l'emploi du temps :", id);

        // Continuez avec la mise à jour de l'emploi du temps dans la base de données si nécessaire
        // ...
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'emploi du temps côté client : ', error);
    }
  }, [selectedClass]);

  useEffect(() => {
    const fetchClasse = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Enseignants");
        setClasse(response.data);
        // Mettre à jour la classe sélectionnée avec la première classe
        setSelectedClass(response.data.length > 0 ? response.data[0] : null);
      } catch (error) {
        console.error("Erreur lors de la récupération des classe : ", error);
      }
    };

    fetchClasse();
  }, []);

  useEffect(() => {
    const fetchJours = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Jour");
        setJours(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jours : ", error);
      }
    };

    fetchJours();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`http://localhost:3001/Cours/byens/${selectedClass.id}`)
        .then(async (response) => {
          const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const enseignantDetails = await axios.get(
                `http://localhost:3001/Enseignants/${course.Enseignant}`
              );
              const joursDetails = await axios.get(
                `http://localhost:3001/Jour/${course.jour}`
              );
              return {
                ...course,
                Enseignant: enseignantDetails.data,
                jour: joursDetails.data,
              };
            })
          );

          setListOfCours(coursesWithDetails);
        })
        .catch((error) => {
          console.error(
            'Erreur lors de la récupération des cours, enseignants et jours : ',
            error
          );
          if (error.response) {
            // La requête a été faite et le serveur a répondu avec un code d'erreur
            console.error("Réponse du serveur :", error.response.data);
          } else if (error.request) {
            // La requête a été faite, mais aucune réponse n'a été reçue
            console.error("Aucune réponse reçue du serveur.");
          } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error("Erreur de configuration de la requête :", error.message);
          }
        });
    }
  }, [selectedClass, updateTimetable]);

  useEffect(() => {
    updateTimetable();
  }, [selectedClass, updateTimetable]);


  const handleClassChange = (selectedClassId) => {
    const newSelectedClass = classes.find((classe) => classe.id === parseInt(selectedClassId));
    setSelectedClass(newSelectedClass);
  };

  return (
      
      <div style={{ marginLeft: '220px', overflowX: 'auto' }}>
      <TimetableDropArea
        classes={classes}
        jours={jours}
        selectedClass={selectedClass}
        handleClassChange={handleClassChange}
        timetableId={timetableId} // Passer timetableId comme prop

      />
      </div>
  );
};

export default TimeTableEnseignant;