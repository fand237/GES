import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const NoteEval = () => {
    const { idEnseignant } = useParams();
    let navigate = useNavigate();

    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        // Remplacez 'http://localhost:3001' par l'URL de votre backend
        axios.get(`http://localhost:3001/Note/byeval/${idEnseignant}`) // Remplacez '1' par l'ID de l'enseignant
            .then(response => {
                setEvaluations(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des évaluations :', error);
            });
    }, [idEnseignant]);

    return (
        <div>
            <h1>Liste des évaluations</h1>
            <table>
                <thead>
                    <tr>
                        <th>Cours</th>
                        <th>Classe</th>
                        <th>Sequence</th>
                        <th>Type d'évaluation</th>
                        <th>Date d'évaluation</th>
                        {/* Ajoutez d'autres colonnes au besoin */}
                    </tr>
                </thead>
                <tbody>
                    {evaluations.map((evaluation, index) => (
                        <tr key={index}>
                            <td>{evaluation.coursNote.matiere}</td>
                            <td>{evaluation.coursNote.classeCours.classe}</td>
                            <td>{evaluation.sequenceNote.sequence}</td>
                            <td>{evaluation.TypeNote.type}</td>
                            <td>{evaluation.dateEvaluation}</td>
                            <button type="button" onClick={() => navigate(`/NoteUpdate/${evaluation.cours}/${evaluation.coursNote.classeCours.id}/${evaluation.sequence}/${evaluation.type_Evaluation}/${evaluation.dateEvaluation}`)}>Modifier</button>

                            {/* Ajoutez d'autres colonnes au besoin */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoteEval;
