import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


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
    axios.get(`http://localhost:3001/Parent/nopass/${id}`)
        .then((response) => {
        console.log("Response from API:", response.data);
        setInitialValues(response.data);
        })
        .catch((error) => {
        console.error("Erreur lors de la récupération des informations du cours : ", error);
        });
    
    }, [id]);
    console.log("initiali",initialValues)

  

  const validationSchema = Yup.object().shape({
    nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
  });

  const onSubmit = async (data) => {
    try {

      await axios.put(`http://localhost:3001/Parent/${id}`, data);
      console.log("Parent mis a jour avec succès");
      navigate(`/ParentAll`)
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
    <div className='updateParentFormPage'>
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

          <button type="submit"> Enregistrer</button>
        </Form>
      </Formik>
    </div>
  );
}

export default ParentUpdate;