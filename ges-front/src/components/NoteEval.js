import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UseAuth from './UseAuth';
import config from "../config/config";

const NoteEval = () => {
    const { idens } = UseAuth();
    let navigate = useNavigate();
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        axios.get(`${config.api.baseUrl}/Note/byeval/${idens}`)
            .then(response => {
                setEvaluations(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des évaluations :', error);
            });
    }, [idens]);

    return (
        <div className="p-4">
            <h1 className="text-xl md:text-2xl font-bold mb-4">Liste des évaluations</h1>

            {/* Version desktop (tableau) */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 border-b text-left">Cours</th>
                            <th className="p-3 border-b text-left">Classe</th>
                            <th className="p-3 border-b text-left">Séquence</th>
                            <th className="p-3 border-b text-left">Type</th>
                            <th className="p-3 border-b text-left">Date</th>
                            <th className="p-3 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {evaluations.map((evaluation, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3">{evaluation.coursNote?.matiere || 'N/A'}</td>
                                <td className="p-3">{evaluation.coursNote?.classeCours?.classe || 'N/A'}</td>
                                <td className="p-3">{evaluation.sequenceNote?.sequence || 'N/A'}</td>
                                <td className="p-3">{evaluation.TypeNote?.type || 'N/A'}</td>
                                <td className="p-3">{evaluation.dateEvaluation || 'N/A'}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/DashboardEnseignant/NoteUpdate/${evaluation.cours}/${evaluation.coursNote?.classeCours?.id}/${evaluation.sequence}/${evaluation.type_Evaluation}/${evaluation.dateEvaluation}`)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => navigate(`/DashboardEnseignant/NoteDelete/${evaluation.id}`)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Version mobile (cartes) */}
            <div className="md:hidden space-y-4">
                {evaluations.map((evaluation, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Cours</p>
                                <p>{evaluation.coursNote?.matiere || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Classe</p>
                                <p>{evaluation.coursNote?.classeCours?.classe || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Séquence</p>
                                <p>{evaluation.sequenceNote?.sequence || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Type</p>
                                <p>{evaluation.TypeNote?.type || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-semibold text-gray-500">Date</p>
                                <p>{evaluation.dateEvaluation || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => navigate(`/DashboardEnseignant/NoteUpdate/${evaluation.cours}/${evaluation.coursNote?.classeCours?.id}/${evaluation.sequence}/${evaluation.type_Evaluation}/${evaluation.dateEvaluation}`)}
                                className="flex-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => navigate(`/DashboardEnseignant/NoteDelete/${evaluation.id}`)}
                                className="flex-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoteEval;