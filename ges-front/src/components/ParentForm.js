import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from "../config/config";

function ParentForm() {
  const [indicatifs, setIndicatifs] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [civilites] = useState(['Mademoiselle', 'Monsieur', 'Madame']);
  const [situations] = useState(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']);
  const [motDePasse] = useState('qwerty237');
  const [nomUtilisateur, setNomUtilisateur] = useState('');

  const [formValues, setFormValues] = useState({
   
    email: "",
    nom: "",
    prenom: "",
    indicatif: "+237",
    numeroTelephone: "",
    profession: "",
    quartier: "",
    civilite: "Monsieur",
    situationMatriomiale: "Célibataire",
  });

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

  // Mise à jour du nom d'utilisateur en fonction des valeurs du formulaire
  useEffect(() => {
    const { nom = '', prenom = '', numeroTelephone = '' } = formValues;
    const nomUtilisateur = `${nom.substring(0, 2)}${prenom.substring(0, 2)}${numeroTelephone.slice(-2)}`;
    setFormValues((prevValues) => ({ ...prevValues, nomUtilisateur }));
  }, [formValues.nom, formValues.prenom, formValues.numeroTelephone]);

  const validationSchema = Yup.object().shape({
    
    email: Yup.string().email("Adresse email invalide").required("Email obligatoire"),
    nom: Yup.string().required("Nom obligatoire"),
    prenom: Yup.string().required("Prénom obligatoire"),
    indicatif: Yup.string().required("Indicatif obligatoire"),
    numeroTelephone: Yup.string()
      .matches(/^\d{6,14}$/, 'Le numéro de téléphone doit contenir de 6 à 14 chiffres')
      .required('Numéro de téléphone obligatoire'),
    civilite: Yup.string().required("Civilité obligatoire"),
    situationMatriomiale: Yup.string().required("Situation matrimoniale obligatoire"),
    profession: Yup.string().required("Profession obligatoire"),
    quartier: Yup.string().required("Quartier obligatoire"),
  });

  const onSubmit = async (data, { resetForm }) => {
    try {
      const response = await axios.post("http://localhost:3001/Parent", {
        ...data,
        motDePasse,
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });

      const { nomUtilisateur } = response.data;
      setNomUtilisateur(nomUtilisateur);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      resetForm();
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
            alert("Ce numéro est déjà utilisé.");
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
        <h1 className="titre-connect">Ajouter Parent</h1>
        <Formik
          initialValues={formValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur }) => (
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
                <ErrorMessage name="email" component="span" className="text-red-500 text-xs" />
                <Field type="email" id="email" name="email" className="input-user" /><br />
              </div>
              <div className="mb-2">
                <label htmlFor="nom" className="block text-sm font-semibold text-gray-800">Nom :</label>
                <ErrorMessage name="nom" component="span" className="text-red-500 text-xs" />
                <Field type="text" id="nom" name="nom" className="input-user" onChange={handleChange} onBlur={handleBlur} /><br />
              </div>
              <div className="mb-2">
                <label htmlFor="prenom" className="block text-sm font-semibold text-gray-800">Prénom :</label>
                <ErrorMessage name="prenom" component="span" className="text-red-500 text-xs" />
                <Field type="text" id="prenom" name="prenom" className="input-user" onChange={handleChange} onBlur={handleBlur} /><br />
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
                <Field type="text" id="numeroTelephone" name="numeroTelephone" className="input-user" onChange={handleChange} onBlur={handleBlur} /><br />
              </div>
              <div className="mb-2">
                <label htmlFor="profession" className="block text-sm font-semibold text-gray-800">Profession :</label>
                <ErrorMessage name="profession" component="span" className="text-red-500 text-xs" />
                <Field type="text" id="profession" name="profession" className="input-user" /><br />
              </div>
              <div className="mb-2">
                <label htmlFor="quartier" className="block text-sm font-semibold text-gray-800">Quartier :</label>
                <ErrorMessage name="quartier" component="span" className="text-red-500 text-xs" />
                <Field type="text" id="quartier" name="quartier" className="input-user" /><br />
              </div>
              <div className="mb-2">
                <label htmlFor="situationMatriomiale" className="block text-sm font-semibold text-gray-800">Situation matrimoniale :</label>
                <ErrorMessage name="situationMatriomiale" component="span" className="text-red-500 text-xs" />
                <Field as="select" id="situationMatriomiale" name="situationMatriomiale" className="input-user">
                  {situations.map(situation => (
                    <option key={situation} value={situation}>
                      {situation}
                    </option>
                  ))}
                </Field><br />
              </div>
              <div className="mt-6">
                <button type="submit" className="send-button">Ajouter Parent</button>
              </div>
            </Form>
          )}
        </Formik>
        {showSuccessMessage && (
          <div className="success-message">
            Parent ajouté avec succès !

            le nom d'utilisateur est: {nomUtilisateur}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentForm;
