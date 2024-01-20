import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';


function CoursForm() {
  let navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasse] = useState([]);
  const matieresSecondaire = ["Mathématiques", "Physique", "Chimie", "Biologie", "Français", "Anglais", "Histoire-Géographie", "Philosophie"];

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Enseignants");
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
        const response = await axios.get("http://localhost:3001/Classe");
        setClasse(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classe : ", error);
      }
    };

    fetchClasse();
  }, []);

 

  const initialValues = {
    matiere: "",
    classe: "",
    heureDebut: "",
    heureFin: "",
    Enseignant: "",
  };

  const validationSchema = Yup.object().shape({
    matiere: Yup.string().required("Matière obligatoire"),
    classe: Yup.number().required("Classe obligatoire"),
    heureDebut: Yup.string(),
    heureFin: Yup.string(),
    Enseignant: Yup.number(),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3001/Cours", data);
      console.log("Cours créé avec succès");
      navigate(`/CoursAll`);
    } catch (error) {
      if (error.response) {
        // L'erreur provient de la réponse de l'API
        alert(`Erreur du serveur: ${error.response.data.error}`);      } else if (error.request) {
        // La requête a été faite, mais aucune réponse n'a été reçue
        console.error("Aucune réponse reçue du serveur.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Erreur de configuration de la requête :", error.message);
      }
    }
  };

  return (
    <div className='createCoursFormPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Matière :</label>
          <ErrorMessage name="matiere" component="span" />
          <Field as="select" id="matiere" name="matiere">
            <option value="" disabled>Sélectionnez une matière</option>
            {matieresSecondaire.map((matiere, index) => (
              <option key={index} value={matiere}>{matiere}</option>
            ))}
          </Field><br />

          <label>Classe :</label>
          <ErrorMessage name="classe" component="span" />
          <Field as="select" id="classe" name="classe">
            <option value="" disabled>Sélectionnez une classe</option>
            {classes.map((classe) => (
              <option key={classe.id} value={classe.id}>{classe.classe}</option>
            ))}
          </Field><br />

          <label>Heure de début :</label>
          <ErrorMessage name="heureDebut" component="span" />
          <Field id="heureDebut" type="time" name="heureDebut" /><br />

          <label>Heure de fin :</label>
          <ErrorMessage name="heureFin" component="span" />
          <Field id="heureFin" type="time" name="heureFin" /><br />


          <label>Enseignant :</label>
          <ErrorMessage name="Enseignant" component="span" />
          <Field as="select" id="Enseignant" name="Enseignant">
            <option value="" disabled>Sélectionnez un enseignant</option>
            {enseignants.map((enseignant) => (
              <option key={enseignant.id} value={enseignant.id}>{enseignant.nomUtilisateur} ({enseignant.nom}) </option>
            ))}
          </Field><br />


          <button type="submit">Ajouter Cours</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CoursForm;
