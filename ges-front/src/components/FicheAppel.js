import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import UseAuth from './UseAuth';

function FicheAppel() {
  const { idens } = UseAuth();
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [elevesList, setElevesList] = useState([]);
  const [presenceStatus, setPresenceStatus] = useState({});
  const [retardMinutes, setRetardMinutes] = useState({});

  useEffect(() => {
    const fetchCoursList = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Cours/byens/${idens}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const classeDetails = await axios.get(`http://localhost:3001/Classe/${course.classe}`);
            return {
              ...course,
              classe: classeDetails.data,
            };
          })
        );
        setCoursList(coursesWithDetails);
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
          const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${selectedCours.classe.id}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          });
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

  const handlePresenceChange = async (eleve, statut) => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');
    try {
      await axios.post('http://localhost:3001/Presence/updateOrCreate', {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: statut,
        retard: statut === 'Présent(e)' ? (retardMinutes[eleve.id] || 0) : null,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      setPresenceStatus(prevState => ({
        ...prevState,
        [eleve.id]: statut,
      }));

      if (statut === 'Absent(e)') {
        const MessageParent = `Bonjour M./Mme ${eleve.parentEleve.nom} ${eleve.parentEleve.prenom} votre enfant ${eleve.nom} ${eleve.prenom} de la ${selectedCours.classe.classe} à eu une absence au cours ${selectedCours.matiere}, bien vouloir nous contactez pour plus d'éclaircissement`;
        await axios.post('http://localhost:3001/Notification/absence', {
          numeroTelephone: eleve.parentEleve.indicatif.concat(eleve.parentEleve.numeroTelephone),
          message: MessageParent,
        }, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de présence : `, error);
    }
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
    const elevesAvecRetard = elevesList.filter(eleve => presenceStatus[eleve.id] === 'Présent(e)' && retardMinutes[eleve.id]);

    elevesAvecRetard.forEach(eleve => {
      const retard = retardMinutes[eleve.id];
      axios.post('http://localhost:3001/Presence/updateOrCreate', {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: 'Présent(e)',
        retard: retard,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then(() => {
          console.log(`Retard de ${retard} minutes enregistré pour l'élève avec l'ID ${eleve.id}`);
        })
        .catch((error) => {
          console.error(`Erreur lors de l'enregistrement du retard : `, error);
        });
    });

    setPresenceStatus({});
    setRetardMinutes({});
  };

  return (
    <div className="ficheAppelPage p-4">
      <h2 className="text-2xl font-bold mb-4">Fiche d'appel</h2>
      <label className="block mb-2">Sélectionnez un cours :</label>
      <select
        onChange={handleCoursChange}
        value={selectedCours ? selectedCours.id : ''}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="" disabled>Sélectionnez un cours</option>
        {coursList.map((cours) => (
          <option key={cours.id} value={cours.id}>{cours.matiere} {cours.classe.classe}</option>
        ))}
      </select>
      {selectedCours && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border-b">Nom de l'élève</th>
              <th className="p-4 border-b">Statut de présence</th>
              <th className="p-4 border-b">Retard (minutes)</th>
            </tr>
          </thead>
          <tbody>
            {elevesList.map((eleve) => (
              <tr key={eleve.id} className="border-b">
                <td className="p-4">{`${eleve.nom} ${eleve.prenom}`}</td>
                <td className="p-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`presence_${eleve.id}`}
                      value="Présent(e)"
                      checked={presenceStatus[eleve.id] === 'Présent(e)'}
                      onChange={() => handlePresenceChange(eleve, 'Présent(e)')}
                      className="form-radio"
                    />
                    <span className="ml-2">Présent</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      name={`presence_${eleve.id}`}
                      value="Absent(e)"
                      checked={presenceStatus[eleve.id] === 'Absent(e)'}
                      onChange={() => handlePresenceChange(eleve, 'Absent(e)')}
                      className="form-radio"
                    />
                    <span className="ml-2">Absent</span>
                  </label>
                </td>
                <td className="p-4">
                  {presenceStatus[eleve.id] === 'Présent(e)' && (
                    <input
                      type="number"
                      min="0"
                      value={retardMinutes[eleve.id] || ''}
                      onChange={(e) => handleRetardMinutesChange(eleve.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, eleve)}
                      className="form-input w-full"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={handleEnregistrer}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Enregistrer
      </button>
    </div>
  );
}

export default FicheAppel;
