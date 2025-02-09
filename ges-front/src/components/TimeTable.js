import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

const DraggableItem = ({ course, handleDragStart }) => {
  return (
    <div
      className="border border-dashed border-gray-400 bg-white p-2 cursor-move mb-2"
      draggable
      onDragStart={(e) => handleDragStart(e, course)}
    >
      <p className="text-sm font-medium">{course.matiere}</p>
      <p className="text-xs text-gray-500">{course.Enseignant.nom}</p>
    </div>
  );
};

const TimetableDropArea = ({ classes, jours, selectedClass, handleClassChange, timetableId }) => {

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

  const createEmptyTimetable = () => {
    return Array.from({ length: 10 }, () => Array(6).fill(null)); // 10 créneaux, 7 jours
  };

  const [timetable, setTimetable] = useState(createEmptyTimetable());

  // État pour les cours pré-remplis
  const [preFilledCourses, setPreFilledCourses] = useState([]);

  // Fonction pour récupérer les cours associés à l'emploi du temps sélectionné
  const fetchPreFilledCourses = useCallback(async () => {
    if (timetableId) {
      try {
        const response = await axios.get(`http://localhost:3001/Jour_Cours/byemplois/${timetableId}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const coursDetails = await axios.get(`http://localhost:3001/Cours/${course.cours}`,{
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            });

            const enseignantDetails = await axios.get(
              `http://localhost:3001/Enseignants/${coursDetails.data.Enseignant}`, {
                headers: {
                  accessToken: localStorage.getItem("accessToken"),
                },
              }
            );

            return {
              ...course,
              cours: coursDetails.data,
              Enseignant: enseignantDetails.data,
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
      <div className="flex border-b border-gray-300">
        <div className="w-32 h-16 border-r border-gray-300 flex items-center justify-center bg-gray-100 font-medium">
          <p>Heures</p>
        </div>
        {jours.map((jour, index) => (
          <div
            key={index}
            className="w-32 h-16 border-r border-gray-300 flex items-center justify-center bg-gray-100 font-medium"
          >
            <p>{jour.jour}</p>
          </div>
        ))}
      </div>
    );
  };

  const deleteJour_Cours = async (jourCoursId) => {
    try {
      // Faites une requête DELETE pour supprimer le Jour_Cours côté serveur
      const response = await axios.delete(`http://localhost:3001/Jour_Cours/${jourCoursId}`,{
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      if (response.data.success) {
        console.log('Jour_Cours supprimé avec succès.');
        return true; // Indiquez que la suppression a réussi
      } else {
        console.error('Échec de la suppression du Jour_Cours.');
        return false; // Indiquez que la suppression a échoué
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du Jour_Cours : ', error);
      return false; // Indiquez que la suppression a échoué en cas d'erreur
    }
  };

  const handleCellClick = async (rowIndex, colIndex, clickedItem) => {



    console.log('Ancien timetable :', timetable);



    // Vérifiez si la cellule contient un cours
    if (clickedItem) {
      // Demander une confirmation avant la suppression
      const isConfirmed = window.confirm("Voulez-vous vraiment supprimer cet élément de l'emploi du temps?");

      if (isConfirmed) {
        // Supprimer le JourCours côté serveur
        const deleteSuccess = await deleteJour_Cours(clickedItem.id);


        if (deleteSuccess) {
          setPreFilledCourses((prevPreFilledCourses) =>
            prevPreFilledCourses.filter((course) => course.id !== clickedItem.id)
          );
          // Mettez à jour l'emploi du temps en supprimant l'élément de la cellule correspondante
          const newTimetable = timetable.map((row) => [...row]);
          newTimetable[rowIndex][colIndex] = null;
          setTimetable(newTimetable);
          console.log('Nouveau timetable :', newTimetable);
        }
      }
    }
  };

  const handleDrop = async (e, rowIndex, colIndex) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData('application/json'));

    // Vérifier si la cellule est une pause ou a la valeur 'Pause'
    const isPauseCell = (rowIndex === 3 && colIndex) || (rowIndex === 6 && colIndex);
    const hasPauseValue = timetable[rowIndex][colIndex] === 'Pause';


    if (isPauseCell || hasPauseValue) {
      // Ne rien faire si la cellule est une pause ou a la valeur 'Pause'
      return;
    }

    try {

      console.log("les donnees sont:", draggedItem.course.id,
        jours[colIndex - 1].id,
        timeSlots[rowIndex].heureDebut,
        timeSlots[rowIndex].heureFin,
        draggedItem.course.Enseignant.id,
        timetableId,
        draggedItem.course)
      const response = await axios.post('http://localhost:3001/Jour_Cours/create', {
        coursId: draggedItem.course.id,
        jourId: jours[colIndex - 1].id,
        heureDebut: timeSlots[rowIndex].heureDebut,
        heureFin: timeSlots[rowIndex].heureFin,
        enseignantId: draggedItem.course.Enseignant.id,
        emplois_TempsId: timetableId,
      },{
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      // Si aucune chevauchement, continuer avec la mise à jour du tableau et de la base de données
      // Créer une copie de l'emploi du temps existant
      const newTimetable = timetable.map((row) => [...row]);

      // Placer l'élément dans la case spécifiée
      newTimetable[rowIndex][colIndex] = draggedItem.course;

      // Mettre à jour l'emploi du temps avec la nouvelle configuration
      setTimetable(newTimetable);



      // Mise à jour de preFilledCourses après l'ajout
      const newCourse = {
        ...response.data,
        cours: { ...response.data.cours },
        Enseignant: { ...response.data.Enseignant }
      };

      console.log('le nouveau cours est', newCourse)

      // Mettre à jour immédiatement les cours pré-remplis
      fetchPreFilledCourses();



      console.log("JourCours créé avec succès dans la base de données.");
    } catch (error) {
      console.error('Erreur lors de la création de JourCours : ', error);
      // Récupérez et affichez l'erreur à l'utilisateur
      if (error.response) {
        // Il y a une réponse du serveur avec un statut différent de 2xx
        alert(`Erreur du serveur: ${error.response.data.error}`);
      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue du serveur.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur de configuration de la requête :', error.message);
      }
    }


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
            //console.log('---- Début de la recherche ----');
            /* console.log('Contenu de preFilledCourses :', preFilledCourses);
             console.log('Valeur de iJ :', colIndex-1);
             console.log('Contenu de jours :', jours);
             console.log('Contenu de jours[iJ] :', jours[colIndex-1]);
             console.log('Contenu de timeSlots[rowIndex].heureDebut :', timeSlots[rowIndex].heureDebut);
 */
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
              className={`w-32 h-16 border-r border-gray-300 flex items-center justify-center ${isPauseRow ? 'bg-gray-200' : 'bg-white'}`}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => handleCellClick(rowIndex, colIndex, preFilledCourse)} // Ajoutez un gestionnaire de clic pour la suppression

            >
              {isPauseRow ? (
                <p className="text-base font-medium">Pause</p>
              ) : (
                <>
                  {colIndex === 0 && rowIndex !== -1 ? (
                    <p className="text-base font-medium">{`${timeSlots[rowIndex].heureDebut} - ${timeSlots[rowIndex].heureFin}`}</p>
                  ) : (
                    <div>
                      {preFilledCourse ? (
                        // Si le cours pré-rempli existe, affichez-le
                        <>
                          <p className="text-base font-medium">{preFilledCourse.Enseignant.nom}</p>
                          <p className="text-sm text-gray-500">{preFilledCourse.cours.matiere}</p>

                        </>
                      ) : (
                        <p className="text-sm text-gray-400">Vide</p>
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

  return (
    <div className="p-4">
      <div className="mb-4">

      <h2>Emploi du temps de </h2>
      <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Sélectionner la classe : </label>
      <select
        id="class-select"
        name="class"
          className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={(e) => handleClassChange(e.target.value)}
        value={selectedClass ? selectedClass.id : ''}
      >
        <option value="" disabled>Sélectionnez une classe</option>
          {classes.map((cl) => (
            <option key={cl.id} value={cl.id}>{cl.classe}</option>
        ))}
      </select>

      </div>

        {renderDayHeaders(jours)}
        {renderTimetableRows()}

    </div>
  );
};
const TimeTable = () => {
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
          const createdTimetable = await axios.post('http://localhost:3001/Emplois_temps', {
            classe: selectedClass.id,
          });
          id = createdTimetable.data.id;
        } else {
          // Si l'emploi du temps existe, récupérez son ID
          console.log("ID de l'emploi du temps existe déjà");
          id = existingTimetable.data.id;
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
        const response = await axios.get("http://localhost:3001/Classe",
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
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
        const response = await axios.get("http://localhost:3001/Jour",{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
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
        .get(`http://localhost:3001/Cours/byclasse/${selectedClass.id}`,
        {
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        }
        )
        .then(async (response) => {
          if(response.data.error){
            console.log(response.data.error);
          }else{
          
          const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const enseignantDetails = await axios.get(
                `http://localhost:3001/Enseignants/${course.Enseignant}`,{
                  headers:{
                    accessToken: localStorage.getItem("accessToken"),
                  },
                }
              );
              const joursDetails = await axios.get(
                "http://localhost:3001/Jour/${course.jour}",{
                  headers: {
                    accessToken: localStorage.getItem("accessToken"),
                  },
                }
              );
              return {
                ...course,
                Enseignant: enseignantDetails.data,
                jour: joursDetails.data,
              };
            })
          );

          setListOfCours(coursesWithDetails);
        }
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

  const handleDragStart = (e, course) => {
    // Convertir l'objet course en chaîne JSON et le définir comme données de glisser-déposer
    e.dataTransfer.setData('application/json', JSON.stringify({ course }));
  };

  const handleClassChange = (selectedClassId) => {
    const newSelectedClass = classes.find((classe) => classe.id === parseInt(selectedClassId));
    setSelectedClass(newSelectedClass);
  };

  return (
    <div className="flex">
  <div className="w-60 h-screen bg-gray-50 border-r border-gray-300 overflow-y-auto p-4 flex-shrink-0">
    <h2 className="text-lg font-semibold mb-4">Cours</h2>
    {listOfCours.map((value, key) => (
      <DraggableItem
        key={key}
        course={value}
        handleDragStart={handleDragStart}
      />
    ))}
  </div>
  <div className="flex-1 p-4">
    <TimetableDropArea
      classes={classes}
      jours={jours}
      selectedClass={selectedClass}
      handleClassChange={handleClassChange}
      timetableId={timetableId} // Passer timetableId comme prop
    />
  </div>
</div>

  );
};

export default TimeTable;