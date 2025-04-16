import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from "../config/config";

function EnseignantAll() {
  let navigate = useNavigate();

  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [selectedClasse, setSelectedClasse] = useState('');
  const [enseignants, setEnseignants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer la liste des matières
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Cours/bymatiere`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setMatieres(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des matières : ", error);
      }
    };

    fetchMatieres();
  }, []);

  // Récupérer la liste des classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Classe`, {
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

  const fetchEnseignants = async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/Enseignants`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
console.log(response.data);
      setEnseignants(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants : ", error);
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  // Filtrer les enseignants en fonction de la matière et de la classe sélectionnées
  useEffect(() => {
    const fetchFilteredEnseignants = async () => {
      try {
        let url = `${config.api.baseUrl}/Enseignants`;
        if (selectedMatiere && selectedClasse) {
          url += `/bymatiereEtclasse?matiere=${selectedMatiere}&classe=${selectedClasse}`;
        } else if (selectedMatiere) {
          url += `/bymatiere/${selectedMatiere}`;
        } else if (selectedClasse) {
          url += `/byClasse/${selectedClasse}`;
        }

        const response = await axios.get(url, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        setEnseignants(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des enseignants filtrés : ", error);
      }
    };

    if (selectedMatiere || selectedClasse) {
      fetchFilteredEnseignants();
    } else {
      fetchEnseignants();
    }
  }, [selectedMatiere, selectedClasse]);

  const filteredEnseignants = enseignants.filter((enseignant) =>
    enseignant &&
    (enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="enseignantAllPage p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liste des Enseignants par matière et classe</h1>
  
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        {/* Sélecteur de matière */}
        <div className="flex-1">
          <label htmlFor="matiere" className="block text-gray-600 font-medium mb-2">
            Sélectionnez une matière :
          </label>
          <select
            id="matiere"
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les matières</option>
            {matieres.map((matiere) => (
              <option key={matiere} value={matiere}>
                {matiere}
              </option>
            ))}
          </select>
        </div>
  
        {/* Sélecteur de classe */}
        <div className="flex-1">
          <label htmlFor="classe" className="block text-gray-600 font-medium mb-2">
            Sélectionnez une classe :
          </label>
          <select
            id="classe"
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les classes</option>
            {classes.map((classe) => (
              <option key={classe.id} value={classe.id}>
                {classe.classe}
              </option>
            ))}
          </select>
        </div>
      </div>
  
      {/* Recherche */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-gray-600 font-medium mb-2">
          Recherche :
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Rechercher un enseignant..."
        />
      </div>
  
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-300">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-4">Nom utilisateur</th>
              <th className="p-4">Civilité</th>
              <th className="p-4">Nom</th>
              <th className="p-4">Prénom</th>
              <th className="p-4">Email</th>
              <th className="p-4">Type</th>
              <th className="p-4">Indicatif</th>
              <th className="p-4">Numéro de téléphone</th>
              <th className="p-4">Classes responsables</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnseignants.length > 0 ? (
              filteredEnseignants.map((enseignant) => (
                <tr key={enseignant.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{enseignant.nomUtilisateur}</td>
                  <td className="p-4">{enseignant.civilite}</td>
                  <td className="p-4">{enseignant.nom}</td>
                  <td className="p-4">{enseignant.prenom}</td>
                  <td className="p-4">{enseignant.email}</td>
                  <td className="p-4">{enseignant.typeEnseignant}</td>
                  <td className="p-4">{enseignant.indicatif}</td>
                  <td className="p-4">{enseignant.numeroTelephone}</td>
                  <td className="p-4">
          {enseignant.ResponsableClasse && enseignant.ResponsableClasse.length > 0 ? (
            enseignant.ResponsableClasse.map((classe) => classe.classe).join(', ')
          ) : (
            <span className="text-gray-500">Aucune classe</span>
          )}
        </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/DashboardAdmin/EnseignantDelete/${enseignant.id}`)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => navigate(`/DashboardAdmin/EnseignantUpdate/${enseignant.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 p-6">
                  Aucun enseignant trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
}

export default EnseignantAll;
