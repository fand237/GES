import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import config from "../config/config";

function EleveUpdate() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [civilites] = useState(['Mademoiselle', 'Monsieur']);

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
    motDePasse:"",
    civilite: "",


  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/Classe`,{
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        });
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
        const response = await axios.get(`${config.api.baseUrl}/Parent`,{
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setParents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des parents : ", error);
      }
    };

    fetchParents();
  }, []);

  useEffect(() => {
    axios.get(`${config.api.baseUrl}/Eleve/nopass/${id}`,{
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    })
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
    motDePasse: Yup.string(), // Mot de passe n'est pas obligatoire
    civilite: Yup.string().required("Civilité obligatoire"),

  });

  const onSubmit = async (data) => {
    try {
      await axios.put(`${config.api.baseUrl}/Eleve/${id}`,data, {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      console.log("Élève mis à jour avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);
    } catch (error) {
      // Gestion des erreurs
    }
  };

  return (
    <div className="pannel-connect-1">
      <div className="pannel-connect-2">
        <h1 className="titre-connect">Mise à Jour Élève</h1>
        <Formik key={JSON.stringify(initialValues)} initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form className="mt-6">
          <div className="mb-2">
                <label htmlFor="civilite" className="block text-sm font-semibold text-gray-800">Civilité :</label>
                <ErrorMessage name="civilite" component="span" className="text-red-500 text-xs" />
                <Field as="select" id="civilite" name="civilite" className="input-user">
                <option> Selectionner une civilite </option>
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
              <Field type="email" id="email" name="email" className="input-user" /><br />
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
              <label htmlFor="dateNaissance" className="block text-sm font-semibold text-gray-800">Date de naissance :</label>
              <ErrorMessage name="dateNaissance" component="span" className="error-message" />
              <Field type="date" id="dateNaissance" name="dateNaissance" className="input-user" /><br />
            </div>
            <div className="mb-2">
              <label htmlFor="classe" className="block text-sm font-semibold text-gray-800">Classe :</label>
              <ErrorMessage name="classe" component="span" className="text-red-500" />
              <Field as="select" id="classe" name="classe" className="input-user">
                <option value="" disabled>Sélectionnez une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>{classe.classe}</option>
                ))}
              </Field><br />
            </div>
            <div className="mb-2">
              <label htmlFor="parent" className="block text-sm font-semibold text-gray-800">Parent :</label>
              <ErrorMessage name="parent" component="span" className="text-red-500" />
              <Field as="select" id="parent" name="parent" className="input-user">
                <option value="" disabled>Sélectionnez un parent</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>{parent.nom} {parent.prenom}</option>
                ))}
              </Field><br />
            </div>
            <div className="mb-2">
              <label htmlFor="motDePasse" className="block text-sm font-semibold text-gray-800">Mot de passe :</label>
              <ErrorMessage name="motDePasse" component="span" className="error-message" />
              <Field type="password" id="motDePasse" name="motDePasse" className="input-password" /><br />
            </div>
            <div className="mt-6">
              <button type="submit" className="send-button">Enregistrer</button>
            </div>
          </Form>
        </Formik>
        {showSuccessMessage && (
          <div className="success-message">
            Élève mis a jour avec succès !
          </div>
        )}
      </div>
    </div>
  );
}

export default EleveUpdate;
