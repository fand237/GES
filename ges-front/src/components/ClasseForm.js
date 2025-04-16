import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import config from "../config/config";

const ClasseForm = () => {
  const [cycles, setCycles] = useState([]);
  const [enseignants, setEnseignants] = useState([]); // Ajout de l'état pour les enseignants
  const [niveaux, setNiveaux] = useState([]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Cycle', {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setCycles(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des cycles', error);
      }
    };

    const fetchNiveau = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Niveau', {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setNiveaux(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des niveaux', error);
      }
    };

    const fetchEnseignants = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Enseignants', {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setEnseignants(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des enseignants', error);
      }
    };

    fetchCycles();
    fetchEnseignants();
    fetchNiveau();
  }, []);

  const initialValues = { classe: '', capacite: '', cycle: '' , responsable: '' ,    niveauId: ''
  };

  const validationSchema = Yup.object({
    classe: Yup.string().required('Nom de la classe est requis'),
    capacite: Yup.number().required('Capacité est requise').positive().integer(),
    cycle: Yup.number().required('Cycle est requis'),
    responsable: Yup.number().required('Responsable est requis'),
    niveauId: Yup.number().required('Niveau est requis')


  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/Classe', values, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);

      resetForm(); // Réinitialisation du formulaire
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes("Classe")) {
            alert("Cette Classe est déjà utilisé.");
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
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Ajouter une Classe</h2>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="classe" className="block text-sm font-medium text-gray-700">Nom de la Classe</label>
                  <Field
                      id="classe"
                      name="classe"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <ErrorMessage name="classe" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="niveauId" className="block text-sm font-medium text-gray-700">Niveau</label>
                  <Field as="select" id="niveauId" name="niveauId" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Sélectionner un niveau</option>
                    {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="niveauId" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="capacite" className="block text-sm font-medium text-gray-700">Capacité</label>
                  <Field
                      id="capacite"
                      name="capacite"
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <ErrorMessage name="capacite" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="cycle" className="block text-sm font-medium text-gray-700">Cycle</label>
                  <Field as="select" id="cycle" name="cycle" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="" label="Sélectionner un cycle" />
                    {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.cycle}
                        </option>
                    ))}
                  </Field>
                  <ErrorMessage name="cycle" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">Responsable</label>
                  <Field as="select" id="responsable" name="responsable" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="" label="Sélectionner un responsable" />
                    {enseignants.map(enseignant => (
                        <option key={enseignant.id} value={enseignant.id}>
                          {enseignant.nom} {enseignant.prenom} ({enseignant.nomUtilisateur})
                        </option>
                    ))}
                  </Field>
                  <ErrorMessage name="responsable" component="div" className="text-red-500 text-sm" />
                </div>
                <button
                    type="submit"
                    className="send-button"
                >
                  Enregistrer
                </button>
              </Form>
          )}
        </Formik>
        {showSuccessMessage && (
            <div className="success-message">
              Classe ajouté avec succès !
            </div>
        )}
      </div>
  );
};

export default ClasseForm;