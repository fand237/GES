import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function CoursUpdate({ match }) {
  const [enseignants, setEnseignants] = useState([]);
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const [initialValues, setInitialValues] = useState({
    matiere: '',
    classe: '',
    heureDebut: '',
    heureFin: '',
    jour: '',
    Enseignant: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/Cours/${match.params.id}`)
      .then((response) => {
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
  }, [match.params.id]);

  const validationSchema = Yup.object().shape({
    matiere: Yup.string().required("Matière obligatoire"),
    classe: Yup.string().required("Classe obligatoire"),
    heureDebut: Yup.string(),
    heureFin: Yup.string(),
    jour: Yup.number(),
    Enseignant: Yup.number(),
  });

  const onSubmit = (data) => {
    axios.put(`http://localhost:3001/Cours/${match.params.id}`, data)
      .then((response) => {
        console.log("Cours mis à jour avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du cours : ", error.response.data);
      });
  };

  return (
    <div className='updateCoursFormPage'>
      <h2>Modifier le cours</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          {/* ... (rest of the form fields) */}
          <label>Jour :</label>
          <ErrorMessage name="jour" component="span" />
          <Field as="select" id="jour" name="jour">
            <option value="" disabled>Sélectionnez un jour</option>
            {jours.map((jour, index) => (
              <option key={index} value={index}>{jour}</option>
            ))}
          </Field><br />

          <label>Enseignant :</label>
          <ErrorMessage name="Enseignant" component="span" />
          <Field as="select" id="Enseignant" name="Enseignant">
            <option value="" disabled>Sélectionnez un enseignant</option>
            {enseignants.map((enseignant) => (
              <option key={enseignant.id} value={enseignant.id}>{enseignant.username}</option>
            ))}
          </Field><br />

          <button type="submit">Enregistrer les modifications</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CoursUpdate;
