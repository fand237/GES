import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ParentAll() {
  let navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer la liste des classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes : ", error);
      }
    };

    fetchClasses();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Parent", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      setParents(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des parents : ", error);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Filtrer les parents en fonction de la classe sélectionnée
  useEffect(() => {
    const fetchFilteredParents = async () => {
      try {
        let url = "http://localhost:3001/Parent";
        if (selectedClasse) {
          url += `/byClasse/${selectedClasse}`;
        }

        const response = await axios.get(url, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        setParents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des parents filtrés : ", error);
      }
    };

    if (selectedClasse) {
      fetchFilteredParents();
    } else {
      fetchParents();
    }
  }, [selectedClasse]);

  const filteredParents = parents.filter((parent) =>
    parent &&
    (parent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="parentAllPage p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Parents par classe</h1>

      {/* Sélecteur de classe */}
      <label className="block mb-2">Sélectionnez une classe :</label>
      <select
        onChange={(e) => setSelectedClasse(e.target.value)}
        value={selectedClasse}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="">Toutes les classes</option>
        {classes.map((classe) => (
          <option key={classe.id} value={classe.id}>{classe.classe}</option>
        ))}
      </select>

      <label className="block mb-2">Recherche :</label>
      <input
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      />

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 border-b">Nom utilisateur</th>
            <th className="p-4 border-b">Nom</th>
            <th className="p-4 border-b">Prénom</th>
            <th className="p-4 border-b">Email</th>
            <th className="p-4 border-b">indicatif</th>
            <th className="p-4 border-b">Numero de telephone</th>

            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParents.map((parent) => (
            <tr key={parent.id} className="border-b">
              <td className="p-4">{parent.nomUtilisateur}</td>
              <td className="p-4">{parent.nom}</td>
              <td className="p-4">{parent.prenom}</td>
              <td className="p-4">{parent.email}</td>
              <td className="p-4">{parent.indicatif}</td>
              <td className="p-4">{parent.numeroTelephone}</td>

              <td className="p-4">
                <button
                  type="button"
                  onClick={() => navigate(`/ParentDelete/${parent.id}`)}
                  className="delete-button"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/ParentUpdate/${parent.id}`)}
                  className="modify-button"
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
}

export default ParentAll;
