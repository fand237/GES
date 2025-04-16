import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from "../config/config";

const CycleForm = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  const navigate = useNavigate();

  const initialValues = { cycle: '' };

  const validationSchema = Yup.object({
    cycle: Yup.string().required('Nom du cycle est requis'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:3001/Cycle', values,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 2000);

      resetForm(); // Réinitialisation du formulaire

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du cycle', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Cycle</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-4">
            <label htmlFor="cycle" className="block text-sm font-medium text-gray-700">Nom du Cycle</label>
            <Field
              id="cycle"
              name="cycle"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <ErrorMessage name="cycle" component="div" className="text-red-500 text-sm" />
          </div>
          <button
            type="submit"
            className="send-button"
          >
            Enregistrer
          </button>
        </Form>
      </Formik>
      {showSuccessMessage && (
          <div className="success-message">
            Cycle ajouté avec succès !
          </div>
        )}
    </div>
  );
};

export default CycleForm;
