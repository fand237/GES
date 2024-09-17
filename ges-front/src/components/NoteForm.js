import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UseAuth from './UseAuth';


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

  useEffect(() => {
    const fetchSequenceList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Sequence',{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setSequences(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des séquences :', error);
      }
    };

    fetchSequenceList();
  }, []);

  useEffect(() => {
    const fetchTypeEvaluationList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Type_Evaluation',{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
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
        const response = await axios.get(`http://localhost:3001/Cours/byens/${idens}`,{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const classeDetails = await axios.get(`http://localhost:3001/Classe/${course.classe}`,{
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
      const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${classeId}`);
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
      axios.post('http://localhost:3001/Note', {
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
        console.error(`Erreur lors de l'enregistrement de la note : `, error);
      });
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Enregistrement des Notes</h2>
      {sequenceError && <p className="text-red-500">Veuillez sélectionner une séquence.</p>}
      {typeEvaluationError && <p className="text-red-500">Veuillez sélectionner un type d'évaluation.</p>}
      {dateError && <p className="text-red-500">Veuillez sélectionner une date d'évaluation.</p>}
      {notesError && <p className="text-red-500">Veuillez saisir des notes valides (entre 0 et 20).</p>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Sélectionnez un cours :</label>
        <select
          onChange={(e) => handleCoursChange(e.target.value)}
          value={selectedCours ? selectedCours.id : ''}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Sélectionnez un Cours</option>
          {coursList.map((cours) => (
            <option key={cours.id} value={cours.id}>{cours.matiere} {cours.classe.classe}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Sélectionnez une séquence :</label>
        <select
          onChange={(e) => handlesequenceChange(e.target.value)}
          value={selectedSequence ? selectedSequence.id : ''}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Sélectionnez une séquence</option>
          {sequences.map((sequence) => (
            <option key={sequence.id} value={sequence.id}>{sequence.sequence}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Date d'évaluation :</label>
        <input
          type="date"
          value={dateEvaluation}
          onChange={(e) => setDateEvaluation(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Sélectionnez le type d'évaluation :</label>
        <select
          onChange={(e) => handletypeChange(e.target.value)}
          value={selectedTypeEvaluation ? selectedTypeEvaluation.id : ''}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Sélectionnez le type d'évaluation</option>
          {typesEvaluation.map((type) => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border-b">Nom de l'élève</th>
              <th className="p-4 border-b">Note</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((eleve) => (
              <tr key={eleve.id} className="border-b">
                <td className="p-4">{`${eleve.nom} ${eleve.prenom}`}</td>
                <td className="p-4">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={notes[eleve.id] || ''}
                    onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSaveNotes}
        className="save-button"
      >
        Enregistrer les Notes
      </button>
    </div>
  );
};

export default NoteForm;
