import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NoteForm = () => {
  // Récupérer l'ID de l'enseignant depuis les paramètres d'URL
  const { idEnseignant } = useParams();

  // États pour stocker les données nécessaires
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [typesEvaluation, setTypeEvaluation] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState('');
  const [selectedTypeEvaluation, setSelectedTypeEvaluation] = useState('');
  const [dateEvaluation, setDateEvaluation] = useState("");

  // États pour gérer les erreurs
  const [sequenceError, setSequenceError] = useState(false);
  const [typeEvaluationError, setTypeEvaluationError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [notesError, setNotesError] = useState(false);


  useEffect(() => {
    const fetchSequenceList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Sequence');
        setSequences(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des séquences :', error);
      }
    };

    fetchSequenceList();
  }, []); // Effectuer une seule fois au chargement

  useEffect(() => {
    const fetchTypeEvaluationList = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Type_Evaluation');

        setTypeEvaluation(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des types d\'évaluation :', error);
      }
    };

    fetchTypeEvaluationList();
  }, []); // Effectuer une seule fois au chargement

  // Effet pour récupérer la liste des cours au chargement de la page
  useEffect(() => {
    const fetchCoursList = async () => {
      try {
        // Appeler l'API pour récupérer la liste des cours de l'enseignant
        const response = await axios.get(`http://localhost:3001/Cours/byens/${idEnseignant}`);
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const classeDetails = await axios.get(`http://localhost:3001/Classe/${course.classe}`);


            return {
              ...course,
              classe: classeDetails.data,
            };
          })
        );
        // Mettre à jour l'état avec la liste des cours
        setCoursList(coursesWithDetails);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des cours :', error);
      }
    };

    // Appeler la fonction pour récupérer la liste des cours
    fetchCoursList();
  }, [idEnseignant]);

  // Fonction pour récupérer la liste des élèves pour un cours spécifique
  const fetchElevesForCours = async (classeId) => {
    try {
      // Appeler l'API pour récupérer la liste des élèves pour le cours spécifié
      const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${classeId}`);
      // Retourner la liste des élèves
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves pour le cours :', error);
      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  };

  // Gérer le changement de cours
  const handleCoursChange = async (coursId) => {

    // Réinitialiser les erreurs
    setSequenceError(false);
    setTypeEvaluationError(false);
    setDateError(false);
    setNotesError(false);
    // Trouver le cours sélectionné dans la liste des cours
    const selectedCours = coursList.find((cours) => cours.id === parseInt(coursId));
    // Mettre à jour l'état du cours sélectionné

    setSelectedCours(selectedCours);
    // Récupérer la liste des élèves pour le cours sélectionné
    const elevesForCours = await fetchElevesForCours(selectedCours.classe.id);
    // Mettre à jour l'état avec la liste des élèves
    setEleves(elevesForCours);

    console.log("les eleves apres chargement sont", eleves)

    eleves.forEach(eleve => {

      handleNoteChange(eleve.id, null)
    });
    console.log("les notes apres chargement sont", notes)



  };

  const handletypeChange = async (coursId) => {
    // Trouver le cours sélectionné dans la liste des cours
    const selectedTypeEvaluation = typesEvaluation.find((typeeval) => typeeval.id === parseInt(coursId));
    // Mettre à jour l'état du cours sélectionné
    setSelectedTypeEvaluation(selectedTypeEvaluation);

  };

  const handlesequenceChange = async (coursId) => {
    // Trouver le cours sélectionné dans la liste des cours
    const selectedSequence = sequences.find((sequence) => sequence.id === parseInt(coursId));
    console.log("le selection de sequence est ", selectedSequence)
    // Mettre à jour l'état du cours sélectionné
    setSelectedSequence(selectedSequence);

  };


  // Gérer le changement de note pour un élève
  const handleNoteChange = (eleveId, value) => {
    // Mettre à jour l'état des notes
    setNotes((prevNotes) => ({
      ...prevNotes,
      [eleveId]: value,
    }));
  };

  // Gérer l'enregistrement des notes
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

    console.log("les donnees sont", selectedCours, selectedSequence, selectedTypeEvaluation,dateEvaluation);


    // Réinitialiser les erreurs
    setSequenceError(false);
    setTypeEvaluationError(false);
    setDateError(false);
    setNotesError(false);

    // Enregistrer les retards pour chaque élève
    eleves.forEach(eleve => {
      const note = notes[eleve.id];
      console.log("le type d'evaluation est ", selectedTypeEvaluation)
      console.log("les notes ", notes)

      axios.post('http://localhost:3001/Note', {
        eleve: eleve.id,
        cours: selectedCours.id,
        note: note,
        dateEvaluation: dateEvaluation,
        type_Evaluation: selectedTypeEvaluation.id,
        sequence: selectedSequence.id,
      })
        .then(() => {
          console.log(`note de ${note} minutes enregistré pour l'élève avec l'ID ${eleve.id}`);
        })
        .catch((error) => {
          console.error(`Erreur lors de l'enregistrement de la note : `, error);
        });
    });



  };

  // JSX de la page
  return (
    <div>
      <h2>Enregistrement des Notes</h2>
      {/* Indicateurs d'erreurs */}
      {sequenceError && <p>Veuillez sélectionner une séquence.</p>}
      {typeEvaluationError && <p>Veuillez sélectionner un type d'évaluation.</p>}
      {dateError && <p>Veuillez sélectionner une date d'évaluation.</p>}
      {notesError && <p>Veuillez saisir des notes valides (entre 0 et 20).</p>}


      {/* Sélection du cours */}
      <label>Sélectionnez un cours :</label>
      <select onChange={(e) => handleCoursChange(e.target.value)}
        value={selectedCours ? selectedCours.id : ''}>
        <option value="" disabled>Sélectionnez un Cours</option>
        {coursList.map((cours) => (
          <option key={cours.id} value={cours.id}>{cours.matiere} {cours.classe.classe}</option>
        ))}
      </select>

      <label>Sélectionnez une séquence :</label>
      <select
        onChange={(e) => handlesequenceChange(e.target.value)}
        value={selectedSequence ? selectedSequence.id : ''}
      >
        <option value="" disabled>Sélectionnez une séquence</option>
        {sequences.map((sequence) => (
          <option key={sequence.id} value={sequence.id}>{sequence.sequence}</option>
        ))}
      </select>

      <label>Date d'évaluation :</label>
      <input
        type="date"
        value={dateEvaluation}
        onChange={(e) => setDateEvaluation(e.target.value)}
      />



      {/* Nouveau champ pour sélectionner le type d'évaluation */}
      <label>Sélectionnez le type d'évaluation :</label>
      <select
        onChange={(e) => handletypeChange(e.target.value)}
        value={selectedTypeEvaluation ? selectedTypeEvaluation.id : ''}
      >
        <option value="" disabled>Sélectionnez le type d'évaluation</option>
        {typesEvaluation.map((type) => (
          <option key={type.id} value={type.id}>{type.type}</option>
        ))}
      </select>

      {/* Autres champs et sélections nécessaires */}
      {/* ... */}

      {/* Tableau des élèves avec zones de saisie des notes */}
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

      {/* Bouton d'enregistrement des notes */}
      <button onClick={handleSaveNotes}>Enregistrer les Notes</button>
    </div>
  );
};

export default NoteForm;
