import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SHA256 } from 'crypto-js';


function ParentForm() {
  const initialValues = {
    nomUtilisateur: "",
    motDePasse: "",
    email: "",
    nom: "",
    prenom: "",
  };

  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    motDePasse: Yup.string().required("Mot de passe obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
  });

  const onSubmit = async (data) => {
    try {
        const hashedPassword = SHA256(data.motDePasse).toString();

      // Utiliser le mot de passe hashé dans la requête
      await axios.post("http://localhost:3001/Parent", {
        ...data,
        motDePasse: hashedPassword,
      });
      console.log("Parent créé avec succès");
    } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            // Statut 422 indique une validation des données incorrectes
            const errorMessage = error.response.data.error;
            if (errorMessage.includes("nom d'utilisateur")) {
              alert("Ce nom d'utilisateur est déjà utilisé.");
            } else if (errorMessage.includes("adresse e-mail")) {
              alert("Cette adresse e-mail est déjà utilisée.");
            } else {
              alert(`Erreur du serveur: ${errorMessage}`);
            }
          } else { 
            alert(`Erreur du serveur: ${error.response.data.error}`);
          }
        } else if (error.request) {
          console.error("Aucune réponse reçue du serveur.");
        } else {
          console.error("Erreur de configuration de la requête :", error.message);
        }
      }
  };

  return (
    <div className='createParentFormPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <label>Nom d'utilisateur :</label>
          <ErrorMessage name="nomUtilisateur" component="span" />
          <Field type="text" id="nomUtilisateur" name="nomUtilisateur" /><br />

          <label>Mot de passe :</label>
          <ErrorMessage name="motDePasse" component="span" />
          <Field type="password" id="motDePasse" name="motDePasse" /><br />

          <label>Email :</label>
          <ErrorMessage name="email" component="span" />
          <Field type="email" id="email" name="email" /><br />

          <label>Nom :</label>
          <ErrorMessage name="nom" component="span" />
          <Field type="text" id="nom" name="nom" /><br />

          <label>Prénom :</label>
          <ErrorMessage name="prenom" component="span" />
          <Field type="text" id="prenom" name="prenom" /><br />

          <button type="submit">Ajouter Parent</button>
        </Form>
      </Formik>
    </div>
  );
}

export default ParentForm;
