import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ParentUpdate() {
  let { id } = useParams();
  let navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    nomUtilisateur: '',
    nom: '',
    email: '',
    prenom: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/Parent/nopass/${id}`,{
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log("Response from API:", response.data);
        setInitialValues(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des informations du cours : ", error);
      });
  }, [id]);

  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
  });

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:3001/Parent/${id}`, data,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      console.log("Parent mis à jour avec succès");
      navigate(`/ParentAll`);
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
        <h1 className="titre-connect">Mettre à jour un parent</h1>
        <Formik key={JSON.stringify(initialValues)} initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
          <Form className="mt-6">
            <div className="mb-2">
              <label htmlFor="nomUtilisateur" className="block text-sm font-semibold text-gray-800">Nom d'utilisateur :</label>
              <ErrorMessage name="nomUtilisateur" component="span" className="text-red-500" />
              <Field type="text" id="nomUtilisateur" name="nomUtilisateur" className="input-user" /><br />
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
              <button type="submit" className="send-button">Enregistrer</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ParentUpdate;
