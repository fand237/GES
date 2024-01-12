import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function CoursUpdate() {
  let histotique = useNavigate();
  let { id } = useParams();
  const [enseignants, setEnseignants] = useState([]);
  const [jours, setJour] = useState([]);
  const [classes, setClasse] = useState([]);
  const matieresSecondaire = ["Mathématiques", "Physique", "Chimie", "Biologie", "Français", "Anglais", "Histoire-Géographie", "Philosophie"];
  const [initialValues, setInitialValues] = useState({
    matiere: '',
    classe: '',
    heureDebut: '',
    heureFin: '',
    jour: '',
    Enseignant: '',
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
  
    axios.get("http://localhost:3001/Enseignants")
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
          console.error("Erreur lors de la récupération des jourd : ", error);
        }
      };
  
      fetchJour();

      const fetchClasse = async () => {
        try {
          const response = await axios.get("http://localhost:3001/Classe");
          setClasse(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des classe : ", error);
        }
      };

      fetchClasse();

  }, [id]);

  
  

  const validationSchema = Yup.object().shape({
    matiere: Yup.string().required("Matière obligatoire"),
    classe: Yup.number().required("Classe obligatoire"),
    heureDebut: Yup.string(),
    heureFin: Yup.string(),
    jour: Yup.number(),
    Enseignant: Yup.number(),
  });

  const onSubmit = (data) => {
    axios.put(`http://localhost:3001/Cours/${id}`, data)
      .then((response) => {
        console.log("Cours mis à jour avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du cours : ", error.response.data);
      });

      histotique(`/CoursAll`)

  };

  // Condition pour rendre le formulaire uniquement lorsque les données sont disponibles
  if (!initialValues.matiere) {
    return <div>Loading...</div>;
  }

  return (
    <div className='updateCoursFormPage'>
      <h2>Modifier le cours</h2>
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

          <label>Jour :</label>
          <ErrorMessage name="jour" component="span" />
          <Field as="select" id="jour" name="jour">
            <option value="" disabled>Sélectionnez un jour</option>
            {jours.map((jour) => (
              <option key={jour.id} value={jour.id}>{jour.jour}</option>
            ))}
          </Field><br />

          <label>Enseignant :</label>
          <ErrorMessage name="Enseignant" component="span" />
          <Field as="select" id="Enseignant" name="Enseignant">
            <option value="" disabled>Sélectionnez un enseignant</option>
            {enseignants.map((enseignant) => (
              <option key={enseignant.id} value={enseignant.id}>{enseignant.nomUtilisateur}</option>
            ))}
          </Field><br />

          <button type="submit">Enregistrer les modifications</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CoursUpdate;
