import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NoteUpdate2 = () => {
  const { idCours, idClasse, idSequence, idType, date } = useParams();

  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState({});
  const [notesError, setNotesError] = useState(false);

  useEffect(() => {
    const fetchElevesAndNotes = async () => {
      try {
        if (idCours && idSequence && idType && date) {
          const elevesForCours = await fetchElevesForCours(idClasse);
          setEleves(elevesForCours);

          const existingNotes = await fetchExistingNotes(idCours, idSequence, idType, date);
          setNotes(existingNotes);
        }
      } catch (error) {
        console.error('Erreur lors du pré-remplissage des notes :', error);
      }
    };

    fetchElevesAndNotes();

    // Cleanup function to cancel any ongoing asynchronous operations
    return () => {
      // Add cleanup logic here if needed
    };
  }, [idCours, idSequence, idType, date, idClasse]);

  const fetchElevesForCours = async (classeId) => {
    try {
      const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${classeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves pour le cours :', error);
      return [];
    }
  };

  const fetchExistingNotes = async (coursId, sequenceId, typeEvaluationId, date) => {
    try {
      const response = await axios.get(`http://localhost:3001/Note/forupdate/${coursId}/${sequenceId}/${typeEvaluationId}/${date}`);
      const existingNotes = {};
      response.data.forEach((note) => {
        existingNotes[note.eleve] = note.note;
      });
      return existingNotes;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes existantes :', error);
      return {};
    }
  };

  const handleNoteChange = (eleveId, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [eleveId]: value,
    }));
  };

  const handleSaveNotes = async () => {
    if (Object.values(notes).some((note) => note < 0 || note > 20)) {
      setNotesError(true);
      return;
    }

    setNotesError(false);

    eleves.forEach((eleve) => {
      const note = notes[eleve.id];

      axios.post('http://localhost:3001/Note', {
        eleve: eleve.id,
        cours: idCours,
        note: note,
        dateEvaluation: date,
        type_Evaluation: idType,
        sequence: idSequence,
      })
        .then(() => {
          console.log(`Note de ${note} enregistrée pour l'élève avec l'ID ${eleve.id}`);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'enregistrement de la note :', error);
        });
    });
  };

  return (
    <div>
      <h2>Enregistrement des Notes</h2>

      {notesError && <p>Veuillez saisir des notes valides (entre 0 et 20).</p>}

      <table>
        <thead>
          <tr>
            <th>Nom de l'élève</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {eleves.map((eleve) => (
            <tr key={eleve.id}>
              <td>{`${eleve.nom} ${eleve.prenom}`}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={notes[eleve.id] || ''}
                  onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSaveNotes}>Modifier les Notes</button>
    </div>
  );
};

export default NoteUpdate2;
