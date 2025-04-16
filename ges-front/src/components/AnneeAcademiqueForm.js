import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from "../config/config";


const AnneeAcademiqueForm = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const initialValues = { annee: '' };

    // Schéma de validation avec Yup
    const validationSchema = Yup.object({
        annee: Yup.string().required("L'année académique est requise"),
    });

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (values, { resetForm }) => {
        try {
            await axios.post(`${config.api.baseUrl}/Annee_Academique`, values, {
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
                    if (errorMessage.includes("Annee")) {
                        alert("Ce Annee existe déjà.");
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
            <h2 className="text-2xl font-bold mb-4">Ajouter une Année Académique</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {() => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="annee" className="block text-sm font-medium text-gray-700">Année Académique</label>
                            <Field as="select" id="annee" name="annee" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="" label="Sélectionner une année académique" />
                                <option value="2024-2025">2024-2025</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2026-2027">2026-2027</option>
                            </Field>
                            <ErrorMessage name="annee" component="div" className="text-red-500 text-sm" />
                        </div>
                        <button type="submit" className="send-button">
                            Enregistrer
                        </button>
                    </Form>
                )}
            </Formik>
            {showSuccessMessage && (
                <div className="success-message">
                    Année académique ajoutée avec succès !
                </div>
            )}
        </div>
    );
};

export default AnneeAcademiqueForm;
