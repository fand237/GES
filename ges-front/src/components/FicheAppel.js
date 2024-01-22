import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';


import axios from 'axios';

function FicheAppel() {
  // Remplacez l'ID de l'enseignant par celui récupéré de votre système d'authentification
  const {idens} = useParams(); // À adapter en fonction de votre logique d'authentification
  console.log(idens)

  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [elevesList, setElevesList] = useState([]);
  const [presenceStatus, setPresenceStatus] = useState({});

  useEffect(() => {
    const fetchCoursList = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Cours/byens/${idens}`);
        const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const classeDetails = await axios.get(`http://localhost:3001/Classe/${course.classe}`);
  
              
              return {
                ...course,
                classe:classeDetails.data,
              };
            })
          );
        setCoursList(coursesWithDetails);
        console.log(coursesWithDetails)

      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des cours : ', error);
      }
    };

    fetchCoursList();
  }, [idens]);

  useEffect(() => {
    const fetchElevesByCours = async () => {
      if (selectedCours) {
        try {
          const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${selectedCours.classe.id}`);
          
          setElevesList(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des élèves pour le cours : ', error);
        }
      }
    };

    fetchElevesByCours();
  }, [selectedCours]);

  const handleCoursChange = (event) => {
    const selectedCoursId = event.target.value;
    const selectedCours = coursList.find((cours) => cours.id === Number(selectedCoursId));
    setSelectedCours(selectedCours);
    setPresenceStatus({});
  };

  const handlePresenceChange = async (eleveId, statut) => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');

     // Mettre à jour ou créer l'instance dans la table Presence
     axios.post('http://localhost:3001/Presence/updateOrCreate', {
        eleve: eleveId,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: statut,
      })
        .then(() => {
          console.log(`Statut de présence pour l'élève avec l'ID ${eleveId} mis à jour avec succès`);
          // Mettre à jour l'état presenceStatus
      setPresenceStatus(prevState => ({
        ...prevState,
        [eleveId]: statut,
      }));

        
        })
        .catch((error) => {
          console.error(`Erreur lors de la mise à jour du statut de présence : `, error);
        });
  };

  return (
    <div className='ficheAppelPage'>
      <h2>Fiche d'appel</h2>

      <label>Sélectionnez un cours :</label>
      <select onChange={handleCoursChange} value={selectedCours ? selectedCours.id : ''}>
        <option value="" disabled>Sélectionnez un cours</option>
        {coursList.map((cours) => (
          <option key={cours.id} value={cours.id}>{cours.matiere} {cours.classe.classe}</option>
        ))}
      </select>

      {selectedCours && (
        <table>
          <thead>
            <tr>
              <th>Nom de l'élève</th>
              <th>Statut de présence</th>
            </tr>
          </thead>
          <tbody>
            {elevesList.map((eleve) => (
              <tr key={eleve.id}>
                <td>{`${eleve.nom} ${eleve.prenom}`}</td>
                <td>
                  <label>
                    Présent
                    <input
                      type="radio"
                      name={`presence_${eleve.id}`}
                      value="Présent(e)"
                      checked={presenceStatus[eleve.id] === 'Présent(e)'}
                      onChange={() => handlePresenceChange(eleve.id, 'Présent(e)')}
                    />
                  </label>
                  <label>
                    Absent
                    <input
                      type="radio"
                      name={`presence_${eleve.id}`}
                      value="Absent(e)"
                      checked={presenceStatus[eleve.id] === 'Absent(e)'}
                      onChange={() => handlePresenceChange(eleve.id, 'Absent(e)')}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


export default FicheAppel;