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
        const response = await axios.get("http://localhost:3001/Classe");
        setClasses(response.data);
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
          const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${selectedClass}`);
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
    <div className='eleveAllPage'>
      <h1>Liste des Élèves par Salle de Classe</h1>

      {/* Sélecteur de classe */}
      <label>Sélectionnez une classe :</label>
      <select onChange={handleClassChange} value={selectedClass || ''}>
        <option value="" disabled>Sélectionnez une classe</option>
        {classes.map((classe) => (
          <option key={classe.id} value={classe.id}>{classe.classe}</option>
        ))}
      </select><br/>
      <label>Recherche :</label>
      <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />

      <table>
        <thead>
          <tr>
            <th>Nom utilisateur</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Date de naissance </th>
            <th>Classe</th>
            <th>Parent</th>

          </tr>
        </thead>
        <tbody>
          {filteredEleves.map((eleve) => (
            <tr key={eleve.id}>
              <td>{eleve.nomUtilisateur}</td>
              <td>{eleve.nom}</td>
              <td>{eleve.prenom}</td>
              <td>{eleve.email}</td>
              <td>{eleve.dateNaissance}</td>
              <td>{eleve.classeEleve.classe}</td>
              <td>{eleve.parentEleve.nom} {eleve.parentEleve.prenom}</td>
              <button type="button" onClick={() => navigate(`/EleveDelete/${eleve.id}`)}>Supprimer</button>
              <button type="button" onClick={() => navigate(`/EleveUpdate/${eleve.id}`)}>Modifier</button>
              {/* Ajoutez d'autres colonnes si nécessaire */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EleveAll;
