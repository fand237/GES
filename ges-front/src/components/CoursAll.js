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
    <div className="p-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Liste des Cours</h2>

      <div className="flex justify-center space-x-6 mb-8">
        <select
          className="p-3 border rounded bg-white shadow"
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
          className="p-3 border rounded bg-white shadow"
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

      <ul className="tilesWrap">
        {filteredCours.map((value, key) => (
          <li key={key} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <h2 className="absolute text-8xl text-gray-300 font-bold top-2 right-2">{key + 1}</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.matiere}</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Coefficient :</strong> {value.coefficient}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Groupe :</strong> {value.groupeCours ? value.groupeCours.groupe : "N/A"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Classe :</strong> {value.classe ? value.classe.classe : "N/A"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Enseignant :</strong>{" "}
              {value.Enseignant ? `${value.Enseignant.nom} (${value.Enseignant.nomUtilisateur})` : "N/A"}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => navigate(`/DashboardAdmin/CoursUpdate/${value.id}`)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
              >
                Modifier
              </button>
              <button
                onClick={() => navigate(`/DashboardAdmin/CoursDelete/${value.id}`)}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:ring focus:ring-red-300"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoursAll;
