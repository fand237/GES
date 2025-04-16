import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import config from "../config/config";


const CycleAll = () => {
  const [cycles, setCycles] = useState([]);
  let navigate = useNavigate();


  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Cycle',{
            headers:{
              accessToken: localStorage.getItem("accessToken"),
            },
          });
          console.log(response.data);
        setCycles(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des cycles', error);
      }
    };

    fetchCycles();
  }, []);

  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Liste des Cycles</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Cycle</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Classes</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cycles.map(cycle => (
            <tr key={cycle.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cycle.cycle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{cycle.numberOfClasses}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
              type="button"
              onClick={() => navigate(`/DashboardAdmin/CycleUpdate/${cycle.id}`)}
              className="modify-button"
            >
              Modifier
            </button>
                <button
                onClick={() => navigate(`/DashboardAdmin/CycleDelete/${cycle.id}`)}                  
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

export default CycleAll;
