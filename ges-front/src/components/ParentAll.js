import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

function ParentAll() {

  const [parents, setParents] = useState([]);
  let navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');



  // Récupérer la liste des Parents 
  useEffect(() => {
    const fetchParents = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/Parent`);
          setParents(response.data);
        } catch (error) {
          console.error(`Erreur lors de la récupération des parents `, error);
        }
      
    };

    fetchParents();
  }, []);

  const filteredParents = parents.filter((parent) =>
  parent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
  parent.prenom.toLowerCase().includes(searchTerm.toLowerCase())

  );


  return (
    <div className='parentAllPage'>
      <h1>Liste des Parents</h1>
<br/>
      <label>Recherche :</label>
      <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />

      

      {/* Tableau d'élèves */}
      <table>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>

            {/* Ajoutez d'autres colonnes si nécessaire */}
          </tr>
        </thead>
        <tbody>
          {filteredParents.map((parent) => (
            <tr key={parent.id}>
                
              <td>{parent.nomUtilisateur}</td>
              <td>{parent.nom}</td>
              <td>{parent.prenom}</td>
              <td>{parent.email}</td>
              <button type="button" onClick={() => navigate(`/ParentUpdate/${parent.id}`)}>Modifier</button>
              <button type="button" onClick={() => navigate(`/ParentDelete/${parent.id}`)}>Supprimer</button>




              {/* Ajoutez d'autres colonnes si nécessaire */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ParentAll;
