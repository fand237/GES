import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import config from "../config/config";

const TypeEvaluationForm = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const initialValues = { type: '' };

    const validationSchema = Yup.object({
        type: Yup.string().required('Le type d’évaluation est requis'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await axios.post('http://localhost:3001/Type_Evaluation', values, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 2000);
            resetForm();
        } catch (error) {
            if (error.response) {
                alert(`Erreur du serveur: ${error.response.data.error}`);
            } else {
                console.error("Erreur lors de la requête: ", error.message);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ajouter un Type d’Évaluation</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {() => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type d’Évaluation</label>
                            <Field as="select" id="type" name="type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="" label="Sélectionner un type" />
                                <option value="Controle Continue">Contrôle Continu</option>
                                <option value="Evaluation Harmonisé">Évaluation Harmonisée</option>
                            </Field>
                            <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                        </div>
                        <button type="submit" className="send-button">Enregistrer</button>
                    </Form>
                )}
            </Formik>
            {showSuccessMessage && <div className="success-message">Type d’évaluation ajouté avec succès !</div>}
        </div>
    );
};

export default TypeEvaluationForm;
