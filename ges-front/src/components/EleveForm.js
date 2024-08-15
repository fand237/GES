import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SHA256 } from 'crypto-js';

function EleveForm() {
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [civilites] = useState(['Mademoiselle', 'Monsieur']);
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Classe",{
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
        const response = await axios.get("http://localhost:3001/Parent");
        setParents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des parents : ", error);
      }
    };

    fetchParents();
  }, []);

  const initialValues = {
  
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    classe: "",
    parent: "",
    civilite: "Monsieur",

  };

  const validationSchema = Yup.object().shape({
    
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    dateNaissance: Yup.date().required("Date de naissance obligatoire"),
    classe: Yup.string().required("Classe obligatoire"),
    parent: Yup.number().required("Parent obligatoire"),
    civilite: Yup.string().required("Civilité obligatoire"),

  });

  const onSubmit = async (data, { resetForm }) => {
    try {

      const response = await axios.post("http://localhost:3001/Eleve", {
        ...data,
      },{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      const { nomUtilisateur } = response.data;
      setNomUtilisateur(nomUtilisateur);
      console.log("Élève créé avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 5000);

      resetForm(); // Réinitialisation du formulaire
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
        <h1 className="titre-connect">Ajouter un élève</h1>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
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
            <div className="mb-2">
              <label htmlFor="dateNaissance" className="block text-sm font-semibold text-gray-800">Date de naissance :</label>
              <ErrorMessage name="dateNaissance" component="span" className="text-red-500" />
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
            <div className="mt-6">
              <button type="submit" className='send-button'>Ajouter Élève</button>
            </div>
          </Form>
        </Formik>
        {/* Affichage du message de succès */}
        {showSuccessMessage && (
          <div className="success-message">
            Élève ajouté avec succès !

            le nom d'utilisateur est: {nomUtilisateur}

          </div>
        )}
      </div>
    </div>
  );
}

export default EleveForm;
