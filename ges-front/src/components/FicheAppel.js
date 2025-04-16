import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import UseAuth from './UseAuth';
import config from "../config/config";

function FicheAppel() {
  const { idens } = UseAuth();
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [elevesList, setElevesList] = useState([]);
  const [presenceStatus, setPresenceStatus] = useState({});
  const [retardMinutes, setRetardMinutes] = useState({});
  const [resumeCours, setResumeCours] = useState('');
  const [participation, setParticipation] = useState({});

  useEffect(() => {
    const fetchCoursList = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Cours/byens/${idens}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const classeDetails = await axios.get(`${config.api.baseUrl}/Classe/${course.classe}`, {
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            });
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
          const response = await axios.get(`${config.api.baseUrl}/Eleve/byclasse/${selectedCours.classe.id}`, {
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
    setRetardMinutes({});
    setResumeCours('');
    setParticipation({});
  };

  const handlePresenceChange = async (eleve, statut) => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');
    try {
      await axios.post(`${config.api.baseUrl}/Presence/updateOrCreate`, {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: statut,
        retard: statut === 'Présent(e)' ? (retardMinutes[eleve.id] || 0) : null,
        resumeCours: resumeCours,
        participation: participation[eleve.id] || 0,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      setPresenceStatus((prevState) => ({
        ...prevState,
        [eleve.id]: statut,
      }));

      if (statut === 'Absent(e)') {
        const MessageParent = `Bonjour M./Mme ${eleve.parentEleve.nom} ${eleve.parentEleve.prenom}, votre enfant ${eleve.nom} ${eleve.prenom} de la ${selectedCours.classe.classe} a été absent(e) au cours ${selectedCours.matiere}. Veuillez nous contacter pour plus d'informations.`;

        await axios.post(`${config.api.baseUrl}/Notification/absence`, {
          numeroTelephone: eleve.parentEleve.indicatif.concat(eleve.parentEleve.numeroTelephone),
          message: MessageParent,
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
    setRetardMinutes((prevState) => ({
      ...prevState,
      [eleveId]: value,
    }));
  };

  const handleParticipationChange = (eleveId, value) => {
    setParticipation((prevState) => ({
      ...prevState,
      [eleveId]: value,
    }));
  };

  const handleEnregistrer = () => {
    const dateDuJour = format(new Date(), 'yyyy-MM-dd');
    const elevesAvecRetard = elevesList.filter((eleve) => presenceStatus[eleve.id] === 'Présent(e)' && retardMinutes[eleve.id]);

    elevesAvecRetard.forEach((eleve) => {
      const retard = retardMinutes[eleve.id];
      axios.post(`${config.api.baseUrl}/Presence/updateOrCreate`, {
        eleve: eleve.id,
        cours: selectedCours.id,
        jour: dateDuJour,
        statut: 'Présent(e)',
        retard: retard,
        resumeCours: resumeCours,
        participation: participation[eleve.id] || 0,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }).then(() => {
        console.log(`Données enregistrées pour l'élève ${eleve.nom} ${eleve.prenom}`);
      }).catch((error) => {
        console.error(`Erreur lors de l'enregistrement du retard : `, error);
      });
    });
    

    setPresenceStatus({});
    setRetardMinutes({});
    setResumeCours('');
    setParticipation({});
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
          <option key={cours.id} value={cours.id}>
            {cours.matiere} ({cours.classe.classe})
          </option>
        ))}
      </select>

      {selectedCours && (
        <>
          <label className="block mb-2">Résumé du cours :</label>
          <textarea
            value={resumeCours}
            onChange={(e) => setResumeCours(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          />

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Prénom</th>
                <th className="px-4 py-2">Présence</th>
                <th className="px-4 py-2">Participation</th>
                <th className="px-4 py-2">Retard (min)</th>
              </tr>
            </thead>
            <tbody>
              {elevesList.map((eleve) => (
                <tr key={eleve.id}>
                  <td className="border px-4 py-2">{eleve.nom}</td>
                  <td className="border px-4 py-2">{eleve.prenom}</td>
                  <td className="border px-4 py-2">
                  <div className="flex space-x-4">
  <label className="inline-flex items-center">
    <input
      type="radio"
      name={`presence-${eleve.id}`}
      value="Présent(e)"
      checked={presenceStatus[eleve.id] === 'Présent(e)'}
      onChange={(e) => handlePresenceChange(eleve, e.target.value)}
      className="form-radio"
    />
    <span className="ml-2">Présent(e)</span>
  </label>
  
  <label className="inline-flex items-center">
    <input
      type="radio"
      name={`presence-${eleve.id}`}
      value="Absent(e)"
      checked={presenceStatus[eleve.id] === 'Absent(e)'}
      onChange={(e) => handlePresenceChange(eleve, e.target.value)}
      className="form-radio"
    />
    <span className="ml-2">Absent(e)</span>
  </label>
</div>

                  </td>
                  <td className="border px-4 py-2">
  <input
    type="number"
    min="1"
    max="5"
    value={participation[eleve.id] || ''}
    onChange={(e) => handleParticipationChange(eleve.id, e.target.value)}
    className="block w-full p-2 border border-gray-300 rounded"
    disabled={presenceStatus[eleve.id] === 'Absent(e)'}
  />
</td>

                  <td className="border px-4 py-2">
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

          <button
            onClick={handleEnregistrer}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enregistrer
          </button>
        </>
      )}
    </div>
  );
}

export default FicheAppel;
