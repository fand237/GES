import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CycleUpdate = () => {
  const { id } = useParams();
  const [cycle, setCycle] = useState('');
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Ajout de l'état

  
  useEffect(() => { 
    const fetchCycle = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Cycle/${id}`,{
            headers:{
              accessToken: localStorage.getItem("accessToken"),
            },
          });
        setCycle(response.data.cycle);
      } catch (error) {
        console.error('Erreur lors du chargement du cycle', error);
      }
    };

    fetchCycle();
  }, [id]);

  const initialValues = { cycle };


  const validationSchema = Yup.object({
    cycle: Yup.string().required('Nom du cycle est requis'),
  });

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:3001/Cycle/${id}`, values,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      setShowSuccessMessage(true); // Affichage du message de succès
      setTimeout(() => {
        setShowSuccessMessage(false); // Cacher le message après 2 secondes
      }, 5000);
      navigate(`/DashboardAdmin`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cycle', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Modifier le Cycle</h2>
      <Formik
      key={JSON.stringify(initialValues)}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage name="cycle" component="div" className="text-red-500 text-sm" />
          </div>
          <button
            type="submit"
            className="send-button"
          >
            Enregistrer les modifications
          </button>
        </Form>
      </Formik>
      {showSuccessMessage && (
          <div className="success-message">
            Cycle mis a jour avec succès !
          </div>
        )}
    </div>
  );
};

export default CycleUpdate;
