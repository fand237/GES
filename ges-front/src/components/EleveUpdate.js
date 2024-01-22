// EleveUpdate.js
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EleveUpdate() {
  let { id } = useParams();
  let navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    nomUtilisateur: "",
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    classe: "",
    parent: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/Eleve/nopass/${id}`)
      .then((response) => {
        console.log("Response from API:", response.data);
        setInitialValues(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des informations de l'élève : ", error);
      });
  }, [id]);
  console.log("Response from initialise:", initialValues);


  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    dateNaissance: Yup.date().required("Date de naissance obligatoire"),
    classe: Yup.number().required("Classe obligatoire"),
    parent: Yup.number().required("Parent obligatoire"),
  });

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3001/Eleve/${id}`, data);
      console.log("Élève mis à jour avec succès");
      navigate(`/EleveAll`);
    } catch (error) {
      // Gestion des erreurs
    }
  };

  return (
    <div className='updateEleveFormPage'>
      <Formik key={JSON.stringify(initialValues)} initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Nom d'utilisateur :</label>
          <ErrorMessage name="nomUtilisateur" component="span" />
          <Field type="text" id="nomUtilisateur" name="nomUtilisateur" /><br />

          <label>Email :</label>
          <ErrorMessage name="email" component="span" />
          <Field type="email" id="email" name="email" /><br />

          <label>Nom :</label>
          <ErrorMessage name="nom" component="span" />
          <Field type="text" id="nom" name="nom" /><br />

          <label>Prénom :</label>
          <ErrorMessage name="prenom" component="span" />
          <Field type="text" id="prenom" name="prenom" /><br />

          <label>Date de naissance :</label>
          <ErrorMessage name="dateNaissance" component="span" />
          <Field type="date" id="dateNaissance" name="dateNaissance" /><br />

          <label>Classe :</label>
          <ErrorMessage name="classe" component="span" />
          <Field type="text" id="classe" name="classe" /><br />

          <label>Parent :</label>
          <ErrorMessage name="parent" component="span" />
          <Field type="text" id="parent" name="parent" /><br />

          <button type="submit">Enregistrer</button>
        </Form>
      </Formik>
    </div>
  );
}

export default EleveUpdate;
