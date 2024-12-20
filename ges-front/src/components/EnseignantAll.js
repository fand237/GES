import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        const response = await axios.get("http://localhost:3001/Cours/bymatiere", {
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

  const fetchEnseignants = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Enseignants", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

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
        let url = "http://localhost:3001/Enseignants";
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
    <div className="enseignantAllPage p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Enseignants par matière et classe</h1>
      <div className="flex flex-wrap items-center space-x-4 mb-4">
        <div className="flex-1">
{/* Sélecteur de matière */}
<label className="block mb-2">Sélectionnez une matière :</label>
      <select
        onChange={(e) => setSelectedMatiere(e.target.value)}
        value={selectedMatiere}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="">Toutes les matières</option>
        {matieres.map((matiere) => (
          <option key={matiere} value={matiere}>{matiere}</option>
        ))}
      </select>
        </div>
        <div className="flex-1">
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
        </div>


     
        </div>
      

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
            <th className="p-4 border-b">Civilite</th>
            <th className="p-4 border-b">Nom</th>
            <th className="p-4 border-b">Prénom</th>
            <th className="p-4 border-b">Email</th>
            <th className="p-4 border-b">Type</th>
            <th className="p-4 border-b">Indicatif</th>
            <th className="p-4 border-b">Numero de telephone</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnseignants.map((enseignant) => (
            <tr key={enseignant.id} className="border-b">
              <td className="p-4">{enseignant.nomUtilisateur}</td>
              <td className="p-4">{enseignant.civilite}</td>
              <td className="p-4">{enseignant.nom}</td>
              <td className="p-4">{enseignant.prenom}</td>
              <td className="p-4">{enseignant.email}</td>
              <td className="p-4">{enseignant.typeEnseignant}</td>
              <td className="p-4">{enseignant.indicatif}</td>
              <td className="p-4">{enseignant.numeroTelephone}</td>


              <td className="p-4">
                <button
                  type="button"
                  onClick={() => navigate(`/DashboardAdmin/EnseignantDelete/${enseignant.id}`)}
                  className="delete-button"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/DashboardAdmin/EnseignantUpdate/${enseignant.id}`)}
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

export default EnseignantAll;
