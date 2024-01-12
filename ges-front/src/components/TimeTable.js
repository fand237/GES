import React, { useState, useEffect } from 'react';
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
      style={{ ...draggableStyle }}
      draggable
      onDragStart={(e) => handleDragStart(e, course)}
    >
      <p>{course.matiere}</p>
      <p>{course.Enseignant.nom}</p>
    </div>
  );
};

const TimetableDropArea = ({ classes, jours,selectedClass, handleClassChange }) => {

  const createEmptyTimetable = () => {
    return Array.from({ length: 10 }, () => Array(6).fill(null)); // 10 créneaux, 7 jours
  };

  const [timetable, setTimetable] = useState(createEmptyTimetable());

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

  const handleDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData('application/json'));

    // Créer une copie de l'emploi du temps existant
    const newTimetable = timetable.map((row) => [...row]);

    // Placer l'élément dans la case spécifiée
    newTimetable[rowIndex][colIndex] = draggedItem.course;

    // Mettre à jour l'emploi du temps avec la nouvelle configuration
    setTimetable(newTimetable);
  };

  const renderTimetableRows = () => {
    const timeSlots = [
      '7:30 - 8:20',
      '8:20 - 9:10',
      '9:10 - 10:00',
      '10:00 - 10:15(pause)',
      '10:15 - 11:05',
      '11:05 - 11:55',
      '11:55 - 12:25(pause)',
      '12:25 - 13:15',
      '13:15 - 14:05',
      '14:05 - 14:55',
    ];
    return timetable.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((course, colIndex) => (
          <div
            key={colIndex}
            style={{
              ...draggableStyle,
              width: colIndex === 0 ? '100px' : '80px', // ajustez la largeur selon vos besoins
              height: '50px',
            }}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            onDragOver={(e) => e.preventDefault()}
          >
            {colIndex === 0 && rowIndex !== -1 ? (
              <p>{`${timeSlots[rowIndex]}`}</p>
            ) : course ? (
              <>
                <p>{course.matiere}</p>
                <p>{course.Enseignant.nom}</p>
              </>
            ) : (
              <p>Vide</p>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div style={{ ...timetableStyle, border: '1px solid black', padding: '5px' }}>
      <h2>Emploi du temps</h2>
      <div>
        <label htmlFor="classSelect">Sélectionner la classe : </label>
        <select
          id="classSelect"
          onChange={(e) => handleClassChange(e.target.value)}
          value={selectedClass ? selectedClass.id : ''}
        >
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.classe}
            </option>
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


  useEffect(() => {
    const fetchClasse = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe");
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
        .get(`http://localhost:3001/Cours/byclasse/${selectedClass.id}`)
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
  }, [selectedClass]);

  const handleDragStart = (e, course) => {
    // Convertir l'objet course en chaîne JSON et le définir comme données de glisser-déposer
    e.dataTransfer.setData('application/json', JSON.stringify({ course }));
  };

  const handleClassChange = (selectedClassId) => {
    const newSelectedClass = classes.find((classe) => classe.id === parseInt(selectedClassId));
    setSelectedClass(newSelectedClass);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h2>Cours</h2>
        {listOfCours.map((value, key) => (
          <DraggableItem
            key={key}
            course={value}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
      <TimetableDropArea
        classes={classes}
        jours={jours}
        selectedClass={selectedClass}
        handleClassChange={handleClassChange}
      />
    </div>
  );
};

export default TimeTable;
