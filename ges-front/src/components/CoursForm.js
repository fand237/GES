import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CoursForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  let navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasse] = useState([]);
  const [groupes, setGroupe] = useState([]);
  const coefficients = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const matieresSecondaire = ["Mathématiques", "Physique", "Chimie", "Biologie", "Français", "Anglais", "Histoire-Géographie", "Philosophie"];

  useEffect(() => {
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
    fetchEnseignants();
  }, []);

  useEffect(() => {
    const fetchClasse = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe",{
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setClasse(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes : ", error);
      }
    };
    fetchClasse();
  }, []);

  useEffect(() => {
    const fetchGroupe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Groupe");
        setGroupe(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes : ", error);
      }
    };
    fetchGroupe();
  }, []);

  const initialValues = {
    matiere: "",
    classe: "",
    Enseignant: "",
    groupe: "",
    coefficient: "",
  };

  const validationSchema = Yup.object().shape({
    matiere: Yup.string().required("Matière obligatoire"),
    classe: Yup.number().required("Classe obligatoire"),
    groupe: Yup.number().required("Groupe obligatoire"),
    coefficient: Yup.number().required("Coefficient obligatoire"),
    Enseignant: Yup.number().required("Enseignant obligatoire"),
  });

  const onSubmit = async (data , { resetForm }) => {
    try {
      await axios.post("http://localhost:3001/Cours", data);
      console.log("Cours créé avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);

      resetForm(); // Réinitialisation du formulaire

    } catch (error) {
      if (error.response) {
        alert(`Erreur du serveur: ${error.response.data.error}`);
      } else if (error.request) {
        console.error("Aucune réponse reçue du serveur.");
      } else {
        console.error("Erreur de configuration de la requête :", error.message);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      <h2 className="titre-connect">Ajouter un Cours</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <div className="mb-4">
            <label htmlFor="matiere" className="block text-sm font-medium text-gray-700">Matière :</label>
            <ErrorMessage name="matiere" component="span" className="text-red-500" />
            <Field as="select" id="matiere" name="matiere" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Sélectionnez une matière</option>
              {matieresSecondaire.map((matiere, index) => (
                <option key={index} value={matiere}>{matiere}</option>
              ))}
            </Field>
          </div>
          <div className="mb-4">
            <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700">Coefficient :</label>
            <ErrorMessage name="coefficient" component="span" className="text-red-500" />
            <Field as="select" id="coefficient" name="coefficient" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Sélectionnez un coefficient</option>
              {coefficients.map((coefficient, index) => (
                <option key={index} value={coefficient}>{coefficient}</option>
              ))}
            </Field>
          </div>
          <div className="mb-4">
            <label htmlFor="groupe" className="block text-sm font-medium text-gray-700">Groupe :</label>
            <ErrorMessage name="groupe" component="span" className="text-red-500" />
            <Field as="select" id="groupe" name="groupe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Sélectionnez un groupe</option>
              {groupes.map((groupe) => (
                <option key={groupe.id} value={groupe.id}>{groupe.groupe}</option>
              ))}
            </Field>
          </div>
          <div className="mb-4">
            <label htmlFor="classe" className="block text-sm font-medium text-gray-700">Classe :</label>
            <ErrorMessage name="classe" component="span" className="text-red-500" />
            <Field as="select" id="classe" name="classe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Sélectionnez une classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>{classe.classe}</option>
              ))}
            </Field>
          </div>
          <div className="mb-4">
            <label htmlFor="Enseignant" className="block text-sm font-medium text-gray-700">Enseignant :</label>
            <ErrorMessage name="Enseignant" component="span" className="text-red-500" />
            <Field as="select" id="Enseignant" name="Enseignant" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Sélectionnez un enseignant</option>
              {enseignants.map((enseignant) => (
                <option key={enseignant.id} value={enseignant.id}>{enseignant.nomUtilisateur} ({enseignant.nom})</option>
              ))}
            </Field>
          </div>
          <button
            type="submit"
            className="send-button"
          >
            Ajouter Cours
          </button>
        </Form>
      </Formik>
      {showSuccessMessage && (
          <div className="success-message">
            Cours ajouté avec succès !
          </div>
        )}
    </div>
  );
}

export default CoursForm;
