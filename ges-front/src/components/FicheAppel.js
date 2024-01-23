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
  const [retardMinutes, setRetardMinutes] = useState({});


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
        console.log(selectedCours)
      }
    };

    fetchElevesByCours();
  }, [selectedCours]);
  console.log("les eleves sont",elevesList)


  const handleCoursChange = (event) => {
    const selectedCoursId = event.target.value;
    const selectedCours = coursList.find((cours) => cours.id === Number(selectedCoursId));
    setSelectedCours(selectedCours);
    setPresenceStatus({});
  };

  const handlePresenceChange = async (eleve, statut) => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');
    console.log("valeur de eleve:",eleve)
 
     // Mettre à jour ou créer l'instance dans la table Presence
     axios.post('http://localhost:3001/Presence/updateOrCreate', {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: statut,
        retard: statut === 'Présent(e)' ? (retardMinutes[eleve.id] || 0) : null,
      })
        .then(() => {
          console.log(`Statut de présence pour l'élève avec l'ID ${eleve.id} mis à jour avec succès`);
          
          // Mettre à jour l'état presenceStatus
      setPresenceStatus(prevState => ({
        ...prevState,
        [eleve.id]: statut,
      }));

      if (statut==='Absent(e)'){
        const MessageParent=`Bonjour M./Mme ${eleve.parentEleve.nom} ${eleve.parentEleve.prenom} votre enfant ${eleve.nom} ${eleve.prenom} de la ${selectedCours.classe.classe} à eu une absence au cours ${selectedCours.matiere}, bien vouloir nous contactez pour plus d'eclaircissement`
        axios.post('http://localhost:3001/Notification/absence', {
          numeroTelephone: eleve.parentEleve.indicatif.concat(eleve.parentEleve.numeroTelephone),
          message: MessageParent,
          
        })
      }

        
        })
        .catch((error) => {
          console.error(`Erreur lors de la mise à jour du statut de présence : `, error);
        });
  };

  const handleKeyDown = (event, eleve) => {
    if (event.key === 'Enter') {
      handlePresenceChange(eleve, 'Présent(e)');
    }
  };

  const handleRetardMinutesChange = (eleveId, value) => {
    setRetardMinutes(prevState => ({
      ...prevState,
      [eleveId]: value,
    }));
  };

  const handleEnregistrer = () => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');

    // Filtrer les élèves présents avec retard
    const elevesAvecRetard = elevesList.filter(eleve => presenceStatus[eleve.id] === 'Présent(e)' && retardMinutes[eleve.id]);

    // Enregistrer les retards pour chaque élève
    elevesAvecRetard.forEach(eleve => {
      const retard = retardMinutes[eleve.id];
      axios.post('http://localhost:3001/Presence/updateOrCreate', {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: 'Présent(e)',
        retard: retard,
      })
      .then(() => {
        console.log(`Retard de ${retard} minutes enregistré pour l'élève avec l'ID ${eleve.id}`);
      })
      .catch((error) => {
        console.error(`Erreur lors de l'enregistrement du retard : `, error);
      });
    });

    // Réinitialiser les états
    setPresenceStatus({});
    setRetardMinutes({});
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
              <th>Retard (minutes)</th>

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
                      onChange={() => handlePresenceChange(eleve, 'Présent(e)')}
                    />
                  </label>
                  <label>
                    Absent
                    <input
                      type="radio"
                      name={`presence_${eleve.id}`}
                      value="Absent(e)"
                      checked={presenceStatus[eleve.id] === 'Absent(e)'}
                      onChange={() => handlePresenceChange(eleve, 'Absent(e)')}
                    />
                  </label>
                </td>
                <td>
                  {presenceStatus[eleve.id] === 'Présent(e)' && (
                    <input
                      type="number"
                      min="0"
                      value={retardMinutes[eleve.id] || ''}
                      onChange={(e) => handleRetardMinutesChange(eleve.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, eleve)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <button onClick={handleEnregistrer}>Enregistrer</button>

        </table>
        
      )}
    </div>
  );
}


export default FicheAppel;