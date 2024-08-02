import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';

const ClasseUpdate = () => {
  const { id } = useParams();

  const [cycles, setCycles] = useState([]);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    classe:"",
    capacite:"",
    cycle:"",
  });
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

    fetchCycles();
  }, []);

  useEffect(() => {
    const fetchClasse = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Classe/${id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setInitialValues(response.data)
      } catch (error) {
        console.error('Erreur lors du chargement de la classe', error);
      }
    };

    fetchClasse();
  }, [id]);

  

  
  const validationSchema = Yup.object({
    classe: Yup.string().required('Nom de la classe est requis'),
    capacite: Yup.number().required('Capacité est requise').positive().integer(),
    cycle: Yup.number().required('Cycle est requis'),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(cycles);
      console.log(values);
      await axios.put(`http://localhost:3001/Classe/${id}`, values, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
      //navigate('/DashboardAdmin');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Modifier la Classe</h2>
      <Formik
      key={JSON.stringify(initialValues)}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
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
              {cycles.length > 0 ? (
                cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.cycle}
                  </option> 
                ))
              ) : (
                <option value="" disabled>Chargement des cycles...</option>
              )}
            </Field>

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
    </div>
  );
};

export default ClasseUpdate;
