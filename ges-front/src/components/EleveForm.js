import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SHA256 } from 'crypto-js';


function EleveForm() {
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);

  

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe");
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classe : ", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Parent");
        setParents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des parents : ", error);
      }
    };

    fetchParents();
  }, []);


  const initialValues = {
    nomUtilisateur: "",
    motDePasse: "",
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    classe: "",
    parent: "",
  };

  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    motDePasse: Yup.string().required("Mot de passe obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    dateNaissance: Yup.date().required("Date de naissance obligatoire"),
    classe: Yup.string().required("Classe obligatoire"),
    parent: Yup.number().required("Parent obligatoire"),
  });

  const onSubmit = async (data) => {
    try {
      // Hasher le mot de passe en SHA-256
      const hashedPassword = SHA256(data.motDePasse).toString();

      // Utiliser le mot de passe hashé dans la requête
      await axios.post("http://localhost:3001/Eleve", {
        ...data,
        motDePasse: hashedPassword,
      });
      console.log("Élève créé avec succès");
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
    <div className='createEleveFormPage'>
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

        <label>Date de naissance :</label>
        <ErrorMessage name="dateNaissance" component="span" />
        <Field type="date" id="dateNaissance" name="dateNaissance" /><br />

        {/* ... (ajoutez d'autres champs si nécessaire) */}

        <label>Classe :</label>
        <ErrorMessage name="classe" component="span" />
        <Field as="select" id="classe" name="classe">
          <option value="" disabled>Sélectionnez une classe</option>
          {classes.map((classe) => (
            <option key={classe.id} value={classe.id}>{classe.classe}</option>
          ))}
        </Field><br />

        <label>Parent :</label>
        <ErrorMessage name="parent" component="span" />
        <Field as="select" id="parent" name="parent">
          <option value="" disabled>Sélectionnez un parent</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>{parent.nom} {parent.prenom}</option>
          ))}
        </Field><br />

        <button type="submit">Ajouter Élève</button>
      </Form>
    </Formik>
    </div>
  );
}

export default EleveForm;
