import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function CoursAll() {
  const [listOfCours, setListOfCours] = useState([]);
  const [filteredCours, setFilteredCours] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState('');
  const [selectedClasse, setSelectedClasse] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Cours");
        const coursesWithDetails = await Promise.all(
          response.data.map(async (course) => {
            const enseignantDetails = course.Enseignant ? await axios.get(`http://localhost:3001/Enseignants/${course.Enseignant}`, {
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            }) : null;

            const joursDetails = course.jour ? await axios.get(`http://localhost:3001/Jour/${course.jour},{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }`) : null;
            const classesDetails = course.classe ? await axios.get(`http://localhost:3001/Classe/${course.classe}`,{
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            }) : null;

            return {
              ...course,
              Enseignant: enseignantDetails ? enseignantDetails.data : null,
              jour: joursDetails ? joursDetails.data : null,
              classe: classesDetails ? classesDetails.data : null,
            };
          })
        );
        setListOfCours(coursesWithDetails);
        setFilteredCours(coursesWithDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des cours et jours : ", error);
      }
    };

    const fetchEnseignants = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Enseignants",{
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setEnseignants(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des enseignants : ", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe",
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes : ", error);
      }
    };

    fetchCours();
    fetchEnseignants();
    fetchClasses();
  }, []);

  useEffect(() => {
    const filterCours = () => {
      let filtered = listOfCours;
      if (selectedEnseignant) {
        filtered = filtered.filter(course => course.Enseignant && course.Enseignant.id === parseInt(selectedEnseignant));
      }
      if (selectedClasse) {
        filtered = filtered.filter(course => course.classe && course.classe.id === parseInt(selectedClasse));
      }
      setFilteredCours(filtered);
    };

    filterCours();
  }, [listOfCours, selectedEnseignant, selectedClasse]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Liste des Cours</h2>

      <div className="flex mb-4">
        <select
          className="mr-4 p-2 border rounded"
          value={selectedEnseignant}
          onChange={(e) => setSelectedEnseignant(e.target.value)}
        >
          <option value="">Tous les enseignants</option>
          {enseignants.map((enseignant) => (
            <option key={enseignant.id} value={enseignant.id}>
              {enseignant.nomUtilisateur} ({enseignant.nom})
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
        >
          <option value="">Toutes les classes</option>
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.classe}
            </option>
          ))}
        </select>
      </div>

      {filteredCours.map((value, key) => {
        return (
          <div key={key} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="mb-2">
              <span className="font-bold">Matière :</span> {value.matiere}
            </div>
            <div className="mb-2">
              <span className="font-bold">Coefficient :</span> {value.coefficient}
            </div>
            <div className="mb-2">
              <span className="font-bold">Groupe :</span> {value.groupeCours ? `${value.groupeCours.groupe}` : "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-bold">Classe :</span> {value.classe ? `${value.classe.classe}` : "N/A"}
            </div>
            <div className="mb-2">
              <span className="font-bold">Enseignant :</span> {value.Enseignant ? `${value.Enseignant.nom} (${value.Enseignant.nomUtilisateur})` : "N/A"}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/DashboardAdmin/CoursUpdate/${value.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => navigate(`/DashboardAdmin/CoursDelete/${value.id}`)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Supprimer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CoursAll;
