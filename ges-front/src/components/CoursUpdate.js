import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CoursUpdate() {
  let histotique = useNavigate();
  let { id } = useParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état
  const [enseignants, setEnseignants] = useState([]);
  const [jours, setJour] = useState([]);
  const [classes, setClasse] = useState([]);
  const matieresSecondaire = ["Mathématiques", "Physique", "Chimie", "Biologie", "Français", "Anglais", "Histoire-Géographie", "Philosophie"];
  const [groupes, setGroupe] = useState([]);
  const coefficients = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [initialValues, setInitialValues] = useState({
    matiere: '',
    classe: '',
    
    jour: '',
    Enseignant: '',
    groupe: "",
    coefficient: ","
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/Cours/${id}`)
      .then((response) => {
        console.log("Response from API:", response.data);
        setInitialValues(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des informations du cours : ", error);
      });

    axios.get("http://localhost:3001/Enseignants",{
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        setEnseignants(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des enseignants : ", error);
      });

    const fetchJour = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Jour");
        setJour(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des jours : ", error);
      }
    };

    fetchJour();

    const fetchClasse = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe");
        setClasse(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes : ", error);
      }
    };

    fetchClasse();

  }, [id]);

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

  const validationSchema = Yup.object().shape({
    matiere: Yup.string().required("Matière obligatoire"),
    classe: Yup.number().required("Classe obligatoire"),
    
    jour: Yup.number(),
    Enseignant: Yup.number(),
    groupe: Yup.number().required("Groupe obligatoire"),
    coefficient: Yup.number().required("Coefficient obligatoire"),
  });

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3001/Cours/${id}`, data);
      console.log("Cours mis à jour avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
        histotique(`/CoursAll`);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cours : ", error.response.data);
    }
  };

  // Condition pour rendre le formulaire uniquement lorsque les données sont disponibles
  if (!initialValues.matiere) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pannel-connect-1">
      <div className="pannel-connect-2">
      <h2 className="titre-connect">Modifier le cours</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className="bg-white p-6 shadow-md rounded-lg">
          <div className="mb-2">
            <label htmlFor="matiere" className="block text-sm font-semibold text-gray-800">Matière :</label>
            <ErrorMessage name="matiere" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="matiere" name="matiere" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez une matière</option>
              {matieresSecondaire.map((matiere, index) => (
                <option key={index} value={matiere}>{matiere}</option>
              ))}
            </Field><br />
          </div>

          <div className="mb-2">
            <label htmlFor="classe" className="block text-sm font-semibold text-gray-800">Classe :</label>
            <ErrorMessage name="classe" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="classe" name="classe" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez une classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>{classe.classe}</option>
              ))}
            </Field><br />
          </div>

          <div className="mb-2">
            <label htmlFor="coefficient" className="block text-sm font-semibold text-gray-800">Coefficient :</label>
            <ErrorMessage name="coefficient" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="coefficient" name="coefficient" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez un coefficient</option>
              {coefficients.map((coefficient, index) => (
                <option key={index} value={coefficient}>{coefficient}</option>
              ))}
            </Field><br />
          </div>

          <div className="mb-2">
            <label htmlFor="groupe" className="block text-sm font-semibold text-gray-800">Groupe :</label>
            <ErrorMessage name="groupe" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="groupe" name="groupe" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez un groupe</option>
              {groupes.map((groupe) => (
                <option key={groupe.id} value={groupe.id}>{groupe.groupe}</option>
              ))}
            </Field><br />
          </div>

          

          <div className="mb-2">
            <label htmlFor="jour" className="block text-sm font-semibold text-gray-800">Jour :</label>
            <ErrorMessage name="jour" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="jour" name="jour" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez un jour</option>
              {jours.map((jour) => (
                <option key={jour.id} value={jour.id}>{jour.jour}</option>
              ))}
            </Field><br />
          </div>

          <div className="mb-2">
            <label htmlFor="Enseignant" className="block text-sm font-semibold text-gray-800">Enseignant :</label>
            <ErrorMessage name="Enseignant" component="span" className="text-red-500 text-sm" />
            <Field as="select" id="Enseignant" name="Enseignant" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
              <option value="" disabled>Sélectionnez un enseignant</option>
              {enseignants.map((enseignant) => (
                <option key={enseignant.id} value={enseignant.id}>{enseignant.nomUtilisateur}</option>
              ))}
            </Field><br />
          </div>

          <div className="mt-6">
            <button type="submit" className="send-button">Enregistrer les modifications</button>
          </div>
        </Form>
      </Formik>
      {showSuccessMessage && (
        <div className="success-message mt-4">
          Cours mis à jour avec succès !
        </div>
      )}
    </div>
    </div>
  );
}

export default CoursUpdate;
