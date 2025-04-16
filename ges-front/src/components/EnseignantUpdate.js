import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import config from "../config/config";


function EnseignantUpdate() {
  const [indicatifs, setIndicatifs] = useState([]);
  const [civilites] = useState([ 'Monsieur', 'Madame']);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état pour le message de succès

  let { id } = useParams();
  let navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    nomUtilisateur: "",
    email: "",
    nom: "",
    prenom: "",
    motDePasse: "",
    numeroTelephone: "",
    indicatif: "+237",
    typeEnseignant: "Titulaire",
    civilite: "Monsieur",
  });

  useEffect(() => {
    axios.get(`${config.api.baseUrl}/Enseignants/forupdate/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        setInitialValues(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des informations de l'enseignant : ", error);
      });
  }, [id]);
  console.log("Response from initialise:", initialValues);




  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    motDePasse: Yup.string(), // Mot de passe n'est pas obligatoire
    numeroTelephone: Yup.string()
      .matches(/^\d{6,14}$/, 'Le numéro de téléphone doit contenir de 6 à 14 chiffres')
      .required('Numéro de téléphone obligatoire'),
    civilite: Yup.string().required("Civilité obligatoire"),
    typeEnseignant: Yup.string().oneOf(["Titulaire", "Vacataire"]).required("Type d'enseignant obligatoire"),
});

  const onSubmit = async (data, { resetForm }) => {
    try {
      await axios.put(`${config.api.baseUrl}/Enseignants/${id}`,data,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      console.log("Enseignant mis à jour avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);
      //resetForm(); // Réinitialisation du formulaire
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'enseignant : ", error);
    }
  };

  return (
    <div className="pannel-connect-1">
      <div className="pannel-connect-2">
        <h1 className="titre-connect">Mise à Jour Enseignant</h1>
        <Formik key={JSON.stringify(initialValues)} initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form className="mt-6">

          <div className="mb-2">
                <label htmlFor="civilite" className="block text-sm font-semibold text-gray-800">Civilité :</label>
                <ErrorMessage name="civilite" component="span" className="text-red-500 text-xs" />
                <Field as="select" id="civilite" name="civilite" className="input-user">
                  {civilites.map(civilite => (
                    <option key={civilite} value={civilite}>
                      {civilite}
                    </option>
                  ))}
                </Field><br />
              </div>

            <div className="mb-2">
              <label htmlFor="nomUtilisateur" className="block text-sm font-semibold text-gray-800">Nom d'utilisateur :</label>
              <ErrorMessage name="nomUtilisateur" component="span" className="error-message" />
              <Field type="text" id="nomUtilisateur" name="nomUtilisateur" className="input-user" disabled={true} /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email :</label>
              <ErrorMessage name="email" component="span" className="error-message" />
              <Field type="email" id="email" name="email" className="input-user" disabled={true} /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="nom" className="block text-sm font-semibold text-gray-800">Nom :</label>
              <ErrorMessage name="nom" component="span" className="error-message" />
              <Field type="text" id="nom" name="nom" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="prenom" className="block text-sm font-semibold text-gray-800">Prénom :</label>
              <ErrorMessage name="prenom" component="span" className="error-message" />
              <Field type="text" id="prenom" name="prenom" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="motDePasse" className="block text-sm font-semibold text-gray-800">Mot de passe :</label>
              <ErrorMessage name="motDePasse" component="span" className="error-message" />
              <Field type="password" id="motDePasse" name="motDePasse" className="input-password" /><br />
            </div>

              <div className="mb-2">
                <label htmlFor="numeroTelephone" className="block text-sm font-semibold text-gray-800">Numéro de téléphone :</label>
                <ErrorMessage name="numeroTelephone" component="span" className="text-red-500 text-xs" />
                <Field type="text" id="numeroTelephone" name="numeroTelephone" className="input-user"  /><br />
              </div>
              <div className="mb-2">
              <label htmlFor="typeEnseignant" className="block text-sm font-semibold text-gray-800">Type d'enseignant :</label>
              <ErrorMessage name="typeEnseignant" component="span" className="text-red-500" />
              <Field as="select" id="typeEnseignant" name="typeEnseignant" className="input-user">
                <option value="Titulaire">Titulaire</option>
                <option value="Vacataire">Vacataire</option>
              </Field><br />
            </div>

            <div className="mt-6">
              <button type="submit" className="send-button">Enregistrer</button>
            </div>
            
          </Form>
        </Formik>
        {showSuccessMessage && (
          <div className="success-message">
            Enseignant mis a jour avec succès !
          </div>
        )}
      </div>
    </div>
  );
}

export default EnseignantUpdate;
