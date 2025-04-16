import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from "../config/config";

function EnseignantForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état pour le message de succès
  const [civilites] = useState([ 'Monsieur', 'Madame']);
  const [indicatifs, setIndicatifs] = useState([]);
  const [nomUtilisateur, setNomUtilisateur] = useState('');



  const initialValues = {
    
    email: "",
    nom: "",
    prenom: "",
    numeroTelephone: "",
    indicatif: "+237",
    typeEnseignant: "Titulaire",
    civilite: "Monsieur",

  };

  useEffect(() => {
    const fetchIndicatifs = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const indicatifsPays = response.data.flatMap((country) =>
          country.idd.suffixes
            ? country.idd.suffixes.map((suffix) => ({
                name: country.name.common,
                flag: country.flags.png,
                code: `${country.idd.root}${suffix}`,
              }))
            : []
        );

        indicatifsPays.sort((a, b) => a.name.localeCompare(b.name));

        // Ajouter l'indicatif par défaut en haut de la liste
        indicatifsPays.unshift({
          name: 'Cameroun',
          flag: 'https://restcountries.com/v3.1/flag/cmr',
          code: '+237',
        });

        setIndicatifs(indicatifsPays);
      } catch (error) {
        console.error('Erreur lors de la récupération des indicatifs de pays : ', error);
      }
    };

    fetchIndicatifs();
  }, []);

  const validationSchema = Yup.object().shape({
    
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    indicatif: Yup.string().required("Indicatif obligatoire"),
    numeroTelephone: Yup.string()
      .matches(/^\d{6,14}$/, 'Le numéro de téléphone doit contenir de 6 à 14 chiffres')
      .required('Numéro de téléphone obligatoire'),
    civilite: Yup.string().required("Civilité obligatoire"),
    typeEnseignant: Yup.string().oneOf(["Titulaire", "Vacataire"]).required("Type d'enseignant obligatoire"),
  });

  const onSubmit = async (data, { resetForm }) => {
    try {

      const response = await axios.post("http://localhost:3001/Enseignants"
      ,data,
      {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      const { nomUtilisateur } = response.data;
      setNomUtilisateur(nomUtilisateur);

      console.log("Enseignant créé avec succès");
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 5000);

      //resetForm(); // Réinitialisation du formulaire
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes("nom d'utilisateur")) {
            alert("Ce nom d'utilisateur est déjà utilisé.");
          } else if (errorMessage.includes("adresse e-mail")) {
            alert("Cette adresse e-mail est déjà utilisée.");
          } else if (errorMessage.includes("numero")) {
            alert("Ce numéro est déjà utilisé.");
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
    <div className="pannel-connect-1">
      <div className="pannel-connect-2">
        <h1 className="titre-connect">Ajouter un enseignant</h1>
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
                <label htmlFor="indicatifPays" className="block text-sm font-semibold text-gray-800">Indicatif du pays :</label>
                <ErrorMessage name="indicatifPays" component="span" className="text-red-500 text-xs" />
                <Field as="select" id="indicatifPays" name="indicatifPays" className="input-user">
                  {indicatifs.map((indicatif) => (
                    <option key={indicatif.code} value={indicatif.code}>
                      <img src={indicatif.flag} alt={indicatif.name} className="inline-block w-5 h-5 mr-2" />
                      {indicatif.name} ({indicatif.code})
                    </option>
                  ))}
                </Field><br />
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
              <button type="submit" className='send-button'>Ajouter Enseignant</button>
            </div>
          </Form>
        </Formik>
        {/* Affichage du message de succès */}
        {showSuccessMessage && (
          <div className="success-message">
            Enseignant ajouté avec succès !

            le nom d'utilisateur est: {nomUtilisateur}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnseignantForm;
