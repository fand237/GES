import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from "../config/config";

const JourForm = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const initialValues = { jour: '' };

  const validationSchema = Yup.object({
    jour: Yup.string().required('Le jour est requis'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/Jour', values, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

      resetForm();
    } catch (error) {
        if (error.response) {
            if (error.response.status === 422) {
              const errorMessage = error.response.data.error;
              if (errorMessage.includes("Jour")) {
                alert("Ce JOur existe déjà.");
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
      <h2 className="text-2xl font-bold mb-4">Ajouter un Jour</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div className="mb-4">
              <label htmlFor="jour" className="block text-sm font-medium text-gray-700">Jour</label>
              <Field as="select" id="jour" name="jour" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="" label="Sélectionner un jour" />
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </Field>
              <ErrorMessage name="jour" component="div" className="text-red-500 text-sm" />
            </div>
            <button type="submit" className="send-button">
              Enregistrer
            </button>
          </Form>
        )}
      </Formik>
      {showSuccessMessage && (
        <div className="success-message">
          Jour ajouté avec succès !
        </div>
      )}
    </div>
  );
};

export default JourForm;
