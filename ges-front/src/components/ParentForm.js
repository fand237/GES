import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SHA256 } from 'crypto-js';


function ParentForm() {
  const [indicatifs, setIndicatifs] = useState([]);

  useEffect(() => {
    const fetchIndicatifs = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const indicatifsPays = response.data.map((country) => country.diallingCodes[0]);
        
        // Ajouter l'indicatif par défaut en haut de la liste
        indicatifsPays.unshift('+237');
        setIndicatifs(indicatifsPays);
      } catch (error) {
        console.error('Erreur lors de la récupération des indicatifs de pays : ', error);
      }
    };

    fetchIndicatifs();
  }, []);

  const initialValues = {
    nomUtilisateur: "",
    motDePasse: "",
    email: "",
    nom: "",
    prenom: "",
    indicatif: "+237",
    numeroTelephone:"",
  };
  
  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    motDePasse: Yup.string().required("Mot de passe obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    indicatif: Yup.string().required("Indicatif obligatoire"),
    numeroTelephone: Yup.string()
      .matches(/^\d{6,14}$/, 'Le numéro de téléphone doit contenir de 6 à 14 chiffres')
      .required('Numéro de téléphone obligatoire'),
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
            } else if (errorMessage.includes("numero")) {
              alert("Ce numero est déjà utilisée.");
            }else {
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

          <label>Indicatif du pays :</label>
          <ErrorMessage name="indicatifPays" component="span" />
          <Field as="select" id="indicatifPays" name="indicatifPays">
            {indicatifs.map((indicatif) => (
              <option key={indicatif} value={indicatif}>{indicatif}</option>
            ))}
          </Field><br />

          <label>Numéro de téléphone :</label>
          <ErrorMessage name="numeroTelephone" component="span" />
          <Field type="text" id="numeroTelephone" name="numeroTelephone" /><br />

          <button type="submit">Ajouter Parent</button>
        </Form>
      </Formik>
    </div>
  );
}

export default ParentForm;
