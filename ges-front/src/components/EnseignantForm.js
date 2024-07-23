import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function EnseignantForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état pour le message de succès

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

  const onSubmit = async (data, { resetForm }) => {
    try {

      await axios.post("http://localhost:3001/Enseignants"
      ,data,
      {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      console.log("Enseignant créé avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);

      //resetForm(); // Réinitialisation du formulaire
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
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
    <div className="pannel-connect-1">
      <div className="pannel-connect-2">
        <h1 className="titre-connect">Ajouter un enseignant</h1>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form className="mt-6">
            <div className="mb-2">
              <label htmlFor="nomUtilisateur" className="block text-sm font-semibold text-gray-800">Nom d'utilisateur :</label>
              <ErrorMessage name="nomUtilisateur" component="span" className="text-red-500" />
              <Field type="text" id="nomUtilisateur" name="nomUtilisateur" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="motDePasse" className="block text-sm font-semibold text-gray-800">Mot de passe :</label>
              <ErrorMessage name="motDePasse" component="span" className="text-red-500" />
              <Field type="password" id="motDePasse" name="motDePasse" className="input-password" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email :</label>
              <ErrorMessage name="email" component="span" className="text-red-500" />
              <Field type="email" id="email" name="email" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="nom" className="block text-sm font-semibold text-gray-800">Nom :</label>
              <ErrorMessage name="nom" component="span" className="text-red-500" />
              <Field type="text" id="nom" name="nom" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="prenom" className="block text-sm font-semibold text-gray-800">Prénom :</label>
              <ErrorMessage name="prenom" component="span" className="text-red-500" />
              <Field type="text" id="prenom" name="prenom" className="input-user" /><br />
            </div>
            <div className="mt-6">
              <button type="submit" className='send-button'>Ajouter Enseignant</button>
            </div>
          </Form>
        </Formik>
        {/* Affichage du message de succès */}
        {showSuccessMessage && (
          <div className="success-message">
            Enseignant ajouté avec succès !
          </div>
        )}
      </div>
    </div>
  );
}

export default EnseignantForm;
