import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const GroupeForm = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // État pour afficher un message de succès

  const navigate = useNavigate();

  const initialValues = { groupe: '' };

  // Schéma de validation avec Yup
  const validationSchema = Yup.object({
    groupe: Yup.string().required('Le groupe est requis'),
  });

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/Groupe', values, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setShowSuccessMessage(true); // Afficher le message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);

      resetForm(); // Réinitialiser le formulaire
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes("Groupe")) {
            alert("Ce groupe existe déjà.");
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
      <h2 className="text-2xl font-bold mb-4">Ajouter un Groupe</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="mb-4">
              <label htmlFor="groupe" className="block text-sm font-medium text-gray-700">Groupe</label>
              <Field as="select" id="groupe" name="groupe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="" label="Sélectionner un groupe" />
                <option value="1er Groupe">1er Groupe</option>
                <option value="2eme Groupe">2eme Groupe</option>
                <option value="3eme Groupe">3eme Groupe</option>
              </Field>
              <ErrorMessage name="groupe" component="div" className="text-red-500 text-sm" />
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
          Groupe ajouté avec succès !
        </div>
      )}
    </div>
  );
};

export default GroupeForm;