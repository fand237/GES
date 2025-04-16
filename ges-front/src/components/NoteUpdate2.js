import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from "../config/config";

const NoteUpdate2 = () => {
  const { idCours, idClasse, idSequence, idType, date } = useParams();

  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState({});
  const [notesError, setNotesError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état


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

    return () => {
      // Add cleanup logic here if needed
    };
  }, [idCours, idSequence, idType, date, idClasse]);

  const fetchElevesForCours = async (classeId) => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/Eleve/byclasse/${classeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves pour le cours :', error);
      return [];
    }
  };

  const fetchExistingNotes = async (coursId, sequenceId, typeEvaluationId, date) => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/Note/forupdate/${coursId}/${sequenceId}/${typeEvaluationId}/${date}`);
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

      axios.post(`${config.api.baseUrl}/Note`, {
        eleve: eleve.id,
        cours: idCours,
        note: note,
        dateEvaluation: date,
        type_Evaluation: idType,
        sequence: idSequence,
      },{
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then(() => {
          console.log(`Note de ${note} enregistrée pour l'élève avec l'ID ${eleve.id}`);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'enregistrement de la note :', error);
        });
    });
    console.log("notes mis a jour avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Enregistrement des Notes</h2>

      {notesError && <p className="text-red-500">Veuillez saisir des notes valides (entre 0 et 20).</p>}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Nom de l'élève</th>
            <th className="py-2 px-4 border-b">Note</th>
          </tr>
        </thead>
        <tbody>
          {eleves.map((eleve) => (
            <tr key={eleve.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{`${eleve.nom} ${eleve.prenom}`}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={notes[eleve.id] !== undefined ? notes[eleve.id] : ''}
                  onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSaveNotes}
        className="save-button"
      >
        Modifier les Notes
      </button>

      {showSuccessMessage && (
          <div className="success-message">
            Notes mis a jour avec succès !
          </div>
        )}
    </div>
  );
};

export default NoteUpdate2;
