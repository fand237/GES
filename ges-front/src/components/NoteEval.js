import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UseAuth from './UseAuth';

const NoteEval = () => {
    const { idens } = UseAuth();
    let navigate = useNavigate();

    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/Note/byeval/${idens}`)
            .then(response => {
                setEvaluations(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des évaluations :', error);
            });
    }, [idens]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des évaluations</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-4 border-b text-left">Cours</th>
                        <th className="p-4 border-b text-left">Classe</th>
                        <th className="p-4 border-b text-left">Séquence</th>
                        <th className="p-4 border-b text-left">Type d'évaluation</th>
                        <th className="p-4 border-b text-left">Date d'évaluation</th>
                        <th className="p-4 border-b text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.map((evaluation, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-4">{evaluation.coursNote.matiere}</td>
                            <td className="p-4">{evaluation.coursNote.classeCours.classe}</td>
                            <td className="p-4">{evaluation.sequenceNote.sequence}</td>
                            <td className="p-4">{evaluation.TypeNote.type}</td>
                            <td className="p-4">{evaluation.dateEvaluation}</td>
                            <td className="p-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/NoteUpdate/${evaluation.cours}/${evaluation.coursNote.classeCours.id}/${evaluation.sequence}/${evaluation.type_Evaluation}/${evaluation.dateEvaluation}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Modifier
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoteEval;
