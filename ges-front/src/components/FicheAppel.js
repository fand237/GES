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
      <div className="p-2 md:p-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Fiche d'appel</h2>

        {/* Sélection du cours */}
        <div className="mb-4">
          <label className="block mb-2 text-sm md:text-base">Sélectionnez un cours :</label>
          <select
              onChange={handleCoursChange}
              value={selectedCours ? selectedCours.id : ''}
              className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
          >
            <option value="" disabled>Sélectionnez un cours</option>
            {coursList.map((cours) => (
                <option key={cours.id} value={cours.id}>
                  {cours.matiere} ({cours.classe.classe})
                </option>
            ))}
          </select>
        </div>

        {selectedCours && (
            <>
              {/* Résumé du cours */}
              <div className="mb-4">
                <label className="block mb-2 text-sm md:text-base">Résumé du cours :</label>
                <textarea
                    value={resumeCours}
                    onChange={(e) => setResumeCours(e.target.value)}
                    className="block w-full p-2 text-sm md:text-base border border-gray-300 rounded"
                    rows="3"
                />
              </div>

              {/* Tableau des élèves - version responsive */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">Nom</th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">Prénom</th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">Présence</th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">Participation</th>
                    <th className="p-2 md:p-3 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider">Retard (min)</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {elevesList.map((eleve) => (
                      <tr key={eleve.id} className="hover:bg-gray-50">
                        <td className="p-2 md:p-3 text-sm md:text-base">{eleve.nom}</td>
                        <td className="p-2 md:p-3 text-sm md:text-base">{eleve.prenom}</td>
                        <td className="p-2 md:p-3">
                          <div className="flex flex-col md:flex-row md:space-x-2 space-y-1 md:space-y-0">
                            <label className="inline-flex items-center">
                              <input
                                  type="radio"
                                  name={`presence-${eleve.id}`}
                                  value="Présent(e)"
                                  checked={presenceStatus[eleve.id] === 'Présent(e)'}
                                  onChange={(e) => handlePresenceChange(eleve, e.target.value)}
                                  className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-xs md:text-sm">Présent(e)</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                  type="radio"
                                  name={`presence-${eleve.id}`}
                                  value="Absent(e)"
                                  checked={presenceStatus[eleve.id] === 'Absent(e)'}
                                  onChange={(e) => handlePresenceChange(eleve, e.target.value)}
                                  className="form-radio h-4 w-4 text-blue-600"
                              />
                              <span className="ml-2 text-xs md:text-sm">Absent(e)</span>
                            </label>
                          </div>
                        </td>
                        <td className="p-2 md:p-3">
                          <input
                              type="number"
                              min="1"
                              max="5"
                              value={participation[eleve.id] || ''}
                              onChange={(e) => handleParticipationChange(eleve.id, e.target.value)}
                              className="w-full p-1 text-sm md:text-base border border-gray-300 rounded"
                              disabled={presenceStatus[eleve.id] === 'Absent(e)'}
                          />
                        </td>
                        <td className="p-2 md:p-3">
                          {presenceStatus[eleve.id] === 'Présent(e)' && (
                              <input
                                  type="number"
                                  min="0"
                                  value={retardMinutes[eleve.id] || ''}
                                  onChange={(e) => handleRetardMinutesChange(eleve.id, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, eleve)}
                                  className="w-full p-1 text-sm md:text-base border border-gray-300 rounded"
                              />
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {/* Bouton Enregistrer */}
              <div className="mt-4">
                <button
                    onClick={handleEnregistrer}
                    className="w-full md:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm md:text-base"
                >
                  Enregistrer
                </button>
              </div>
            </>
        )}
      </div>
  );
}

export default FicheAppel;