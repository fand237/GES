import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const RapportPresence = () => {
  const [presences, setPresences] = useState([]);
  const [classes, setClasses] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [filter, setFilter] = useState({
    eleveId: '',
    classeId: '',
    dateDebut: '',
    dateFin: '',
    typeRapport: 'journalier',
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Classe', {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setClasses(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (filter.classeId) {
      const fetchEleves = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/Eleve/byclasse/${filter.classeId}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          });
          setEleves(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des élèves:', error);
        }
      };

      fetchEleves();
    } else {
      setEleves([]);
    }
  }, [filter.classeId]);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Presence/rapport', { 
          params: filter,
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        console.log("la liste des presence est :",response.data);
        setPresences(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des présences:', error);
      }
    };

    fetchPresences();
  }, [filter]);

  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:3001/Presence/rapport/download', { 
        params: filter,
        responseType: 'blob',
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      saveAs(response.data, `rapport_presence_${filter.typeRapport}.pdf`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du rapport:', error);
    }
  };

  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Rapport des Présences</h2>

      <div className="mb-4">
        <label className="block mb-2">Sélectionner la classe:</label>
        <select
          name="classeId"
          value={filter.classeId}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Toutes les classes</option>
          {classes.map(classe => (
            <option key={classe.id} value={classe.id}>{classe.classe}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Sélectionner l'élève:</label>
        <select
          name="eleveId"
          value={filter.eleveId}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          disabled={!filter.classeId}
        >
          <option value="">Tous les élèves</option>
          {eleves.map(eleve => (
            <option key={eleve.id} value={eleve.id}>{eleve.nom} {eleve.prenom}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Date de début:</label>
        <input
          type="date"
          name="dateDebut"
          value={filter.dateDebut}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Date de fin:</label>
        <input
          type="date"
          name="dateFin"
          value={filter.dateFin}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Type de Rapport:</label>
        <select
          name="typeRapport"
          value={filter.typeRapport}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="journalier">Journalier</option>
          <option value="mensuel">Mensuel</option>
          <option value="trimestriel">Trimestriel</option>
          <option value="annuel">Annuel</option>
        </select>
      </div>

      <button onClick={handleDownload} className="bg-blue-500 text-white p-2 rounded">
        Télécharger le Rapport
      </button>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Liste des Présences</h3>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Élève</th>
              <th className="border px-4 py-2">Cours</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Retard (minutes)</th>
              <th className="border px-4 py-2">Participation</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(presences).length === 0 ? (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">Aucune présence trouvée</td>
              </tr>
            ) : (
              Object.values(presences).map((eleve, eleveIndex) => (
                Object.values(eleve.cours).map((cours, coursIndex) => (
                  cours.dates.map((dateInfo, dateIndex) => (
                    <tr key={`${eleveIndex}-${coursIndex}-${dateIndex}`}>
                      <td className="border px-4 py-2">{eleve.nom} {eleve.prenom}</td>
                      <td className="border px-4 py-2">{cours.matiere}</td>
                      <td className="border px-4 py-2">{dateInfo.jour}</td>
                      <td className="border px-4 py-2">{dateInfo.statut}</td>
                      <td className="border px-4 py-2">{dateInfo.retard}</td>
                      <td className="border px-4 py-2">{dateInfo.participation}</td>
                    </tr>
                  ))
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RapportPresence;
