import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UseAuth from './UseAuth';
import config from "../config/config";


const NoteForm = () => {
  const { idens } = UseAuth();
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [typesEvaluation, setTypeEvaluation] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState('');
  const [selectedTypeEvaluation, setSelectedTypeEvaluation] = useState('');
  const [dateEvaluation, setDateEvaluation] = useState("");

  const [sequenceError, setSequenceError] = useState(false);
  const [typeEvaluationError, setTypeEvaluationError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [notesError, setNotesError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état


  useEffect(() => {
    const fetchSequenceList = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Sequence`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setSequences(response.data);
        console.log("les sequences sont:",response.data);

      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des séquences :', error);
      }
    };

    fetchSequenceList();
  }, []);

  useEffect(() => {
    const fetchTypeEvaluationList = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Type_Evaluation`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        console.log("les evaluations sont:",response.data);
        setTypeEvaluation(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des types d\'évaluation :', error);
      }
    };

    fetchTypeEvaluationList();
  }, []);

  useEffect(() => {
    const fetchCoursList = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Cours/byens/${idens}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const classeDetails = await axios.get(`${config.api.baseUrl}/Classe/${course.classe}`,{
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            });
            return {
              ...course,
              classe: classeDetails.data,
            };
          })
        );
        console.log("les cours sont:",coursesWithDetails);
        setCoursList(coursesWithDetails);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des cours :', error);
      }
    };

    fetchCoursList();
  }, [idens]);

  const fetchElevesForCours = async (classeId) => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/Eleve/byclasse/${classeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves pour le cours :', error);
      return [];
    }
  };

  const handleCoursChange = async (coursId) => {
    setSequenceError(false);
    setTypeEvaluationError(false);
    setDateError(false);
    setNotesError(false);

    const selectedCours = coursList.find((cours) => cours.id === parseInt(coursId));
    setSelectedCours(selectedCours);

    const elevesForCours = await fetchElevesForCours(selectedCours.classe.id);
    setEleves(elevesForCours);
    
    elevesForCours.forEach(eleve => handleNoteChange(eleve.id, null));
  };

  const handletypeChange = async (typeId) => {
    const selectedTypeEvaluation = typesEvaluation.find((typeeval) => typeeval.id === parseInt(typeId));
    setSelectedTypeEvaluation(selectedTypeEvaluation);
  };

  const handlesequenceChange = async (sequenceId) => {
    const selectedSequence = sequences.find((sequence) => sequence.id === parseInt(sequenceId));
    setSelectedSequence(selectedSequence);
  };

  const handleNoteChange = (eleveId, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [eleveId]: value,
    }));
  };

  const handleSaveNotes = async () => {
    if (!selectedSequence) {
      setSequenceError(true);
      return;
    }

    if (!selectedTypeEvaluation) {
      setTypeEvaluationError(true);
      return;
    }

    if (!dateEvaluation) {
      setDateError(true);
      return;
    }

    if (Object.values(notes).some((note) => note < 0 || note > 20)) {
      setNotesError(true);
      return;
    }

    setSequenceError(false);
    setTypeEvaluationError(false);
    setDateError(false);
    setNotesError(false);

    eleves.forEach(eleve => {
      const note = notes[eleve.id];
      axios.post(`${config.api.baseUrl}/Note`, {
        eleve: eleve.id,
        cours: selectedCours.id,
        note: note,
        dateEvaluation: dateEvaluation,
        type_Evaluation: selectedTypeEvaluation.id,
        sequence: selectedSequence.id,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        console.log(`Note de ${note} enregistrée pour l'élève avec l'ID ${eleve.id}`);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            const errorMessage = error.response.data.error;
            if (errorMessage.includes("note")) {
              alert("Cette note existe deja.");
            } else {
              alert(`Erreur du serveur: ${errorMessage}`);
            }
          } else {
            alert(`Erreur du serveur: ${error.response.data.error}`);
          }
        } else if (error.request) {
          console.error("Aucune réponse reçue du serveur.");
        } else {
          console.error("Erreur de configuration de la requête :", error.message);
        }
        console.error(`Erreur lors de l'enregistrement de la note : `, error);
      });
    });
    console.log("notes ajoute avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 5000);
  };

  return (
      <div className="p-2 md:p-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Enregistrement des Notes</h2>
        {sequenceError && <p className="text-red-500 text-sm md:text-base">Veuillez sélectionner une séquence.</p>}
        {typeEvaluationError && <p className="text-red-500 text-sm md:text-base">Veuillez sélectionner un type d'évaluation.</p>}
        {dateError && <p className="text-red-500 text-sm md:text-base">Veuillez sélectionner une date d'évaluation.</p>}
        {notesError && <p className="text-red-500 text-sm md:text-base">Veuillez saisir des notes valides (entre 0 et 20).</p>}

        {/* Conteneur des sélecteurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Sélection du cours */}
          <div className="mb-2">
            <label className="block font-medium mb-1 text-sm md:text-base">Cours :</label>
            <select
                onChange={(e) => handleCoursChange(e.target.value)}
                value={selectedCours ? selectedCours.id : ''}
                className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
            >
              <option value="" disabled>Sélectionnez un Cours</option>
              {coursList.map((cours) => (
                  <option key={cours.id} value={cours.id}>
                    {cours.matiere} {cours.classe.classe}
                  </option>
              ))}
            </select>
          </div>

          {/* Sélection de la séquence */}
          <div className="mb-2">
            <label className="block font-medium mb-1 text-sm md:text-base">Séquence :</label>
            <select
                onChange={(e) => handlesequenceChange(e.target.value)}
                value={selectedSequence ? selectedSequence.id : ''}
                className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
            >
              <option value="" disabled>Sélectionnez une séquence</option>
              {sequences.map((sequence) => (
                  <option key={sequence.id} value={sequence.id}>
                    {sequence.sequence}
                  </option>
              ))}
            </select>
          </div>

          {/* Date d'évaluation */}
          <div className="mb-2">
            <label className="block font-medium mb-1 text-sm md:text-base">Date :</label>
            <input
                type="date"
                value={dateEvaluation}
                onChange={(e) => setDateEvaluation(e.target.value)}
                className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
            />
          </div>

          {/* Type d'évaluation */}
          <div className="mb-2">
            <label className="block font-medium mb-1 text-sm md:text-base">Type :</label>
            <select
                onChange={(e) => handletypeChange(e.target.value)}
                value={selectedTypeEvaluation ? selectedTypeEvaluation.id : ''}
                className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
            >
              <option value="" disabled>Sélectionnez le type</option>
              {typesEvaluation.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des notes */}
        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
            <tr className="bg-gray-200">
              <th className="p-2 md:p-4 border-b text-sm md:text-base">Nom de l'élève</th>
              <th className="p-2 md:p-4 border-b text-sm md:text-base">Note</th>
            </tr>
            </thead>
            <tbody>
            {eleves.map((eleve) => (
                <tr key={eleve.id} className="border-b">
                  <td className="p-2 md:p-4 text-sm md:text-base">{`${eleve.nom} ${eleve.prenom}`}</td>
                  <td className="p-2 md:p-4">
                    <input
                        type="number"
                        min="0"
                        max="20"
                        value={notes[eleve.id] || ''}
                        onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                        className="w-full p-1 text-sm md:text-base border border-gray-300 rounded"
                    />
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center">
          <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base"
          >
            Enregistrer les Notes
          </button>
          {showSuccessMessage && (
              <div className="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm md:text-base">
                Notes ajoutées avec succès !
              </div>
          )}
        </div>
      </div>
  );
};

export default NoteForm;
