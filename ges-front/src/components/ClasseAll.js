import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ClasseAll = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Classe', {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setClasses(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des classes', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Liste des Classes</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la Classe</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre d'Élèves</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map(cls => ( 
            <tr key={cls.id}> 
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.classe}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.capacite}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.cycle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.nom} {cls.prenom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.nombreEleves}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => navigate(`/DashboardAdmin/ClasseUpdate/${cls.id}`)}
                  className="modify-button"
                >
                  Modifier
                </button>
                <button
                  onClick={() => navigate(`/DashboardAdmin/ClasseDelete/${cls.id}`)}
                  className="delete-button"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClasseAll;
