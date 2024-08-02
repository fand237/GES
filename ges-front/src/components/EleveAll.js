import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';


function EleveAll() {
    let navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [eleves, setEleves] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer la liste des classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe", {
          headers: {
            "accessToken": localStorage.getItem("accessToken"),
          },
        }
      );
        setClasses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes : ", error);
      }
    };

    fetchClasses();
  }, []);


  

  const filteredEleves = eleves.filter((eleve) =>
    eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase())

  );

  // Récupérer la liste des élèves en fonction de la classe sélectionnée
  useEffect(() => {
    const fetchElevesByClass = async () => {
      if (selectedClass) {
        try {
          const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${selectedClass}`, {
            headers: {
              "accessToken": localStorage.getItem("accessToken"),
            },
          });
          setEleves(response.data);
          console.log(response.data)

        } catch (error) {
          console.error(`Erreur lors de la récupération des élèves de la classe ${selectedClass} : `, error);
        }
      }
    };

    fetchElevesByClass();
  }, [selectedClass]);

  // Gérer le changement de classe sélectionnée
  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
  };

  return (
    <div className="eleveAllPage p-4">
  <h1 className="text-2xl font-bold mb-4">Liste des Élèves par Salle de Classe</h1>

  {/* Sélecteur de classe */}
  <label className="block mb-2">Sélectionnez une classe :</label>
  <select
    onChange={handleClassChange}
    value={selectedClass || ''}
    className="block w-full p-2 border border-gray-300 rounded mb-4"
  >
    <option value="" disabled>Sélectionnez une classe</option>
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
        <th className="p-4 border-b">Date de naissance</th>
        <th className="p-4 border-b">Classe</th>
        <th className="p-4 border-b">Parent</th>
        <th className="p-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredEleves.map((eleve) => (
        <tr key={eleve.id} className="border-b">
          <td className="p-4">{eleve.nomUtilisateur}</td>
          <td className="p-4">{eleve.nom}</td>
          <td className="p-4">{eleve.prenom}</td>
          <td className="p-4">{eleve.email}</td>
          <td className="p-4">{eleve.dateNaissance}</td>
          <td className="p-4">{eleve.classeEleve.classe}</td>
          <td className="p-4">{eleve.parentEleve.nom} {eleve.parentEleve.prenom}</td>
          <td className="p-4">
            <button
              type="button"
              onClick={() => navigate(`/EleveDelete/${eleve.id}`)}
              className="delete-button"
            >
              Supprimer
            </button>
            <button
              type="button"
              onClick={() => navigate(`/EleveUpdate/${eleve.id}`)}
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

export default EleveAll;
