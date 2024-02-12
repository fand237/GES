import React, {  useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';



function EnseignantConnect
    () {
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();


    const initialValues = {
        nomUtilisateur: "",
        motDePasse: "",

    };

    const validationSchema = Yup.object().shape({
        nomUtilisateur: Yup.string().required("Nom d'utilisateur obligatoire"),
        motDePasse: Yup.string().required("Mot de passe obligatoire"),

    });

    const onSubmit = async (data) => {
        try {

            // Utiliser le mot de passe hashé dans la requête
            await axios

                .post("http://localhost:3001/Enseignants/login", data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'accessToken': localStorage.getItem("accessToken") // Ajoutez le token d'accès aux en-têtes de la requête
                    }
                })

                .then((response) => {
                    if (response.data.error) {
                        alert(response.data.error)
                    }
                    else {
                        localStorage.setItem("accessToken", response.data)
                        setAuthState(true)
                        navigate(`/DashboardEnseignant`)

                    };
                });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {

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
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('accessToken');

        if (isAuthenticated) {
            return navigate(`/DashboardEnseignant`);
        }
    }, [navigate]);

    return (
        <div className='createEnseignantConnect
    Page'>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <label>Nom d'utilisateur :</label>
                    <ErrorMessage name="nomUtilisateur" component="span" />
                    <Field type="text" id="nomUtilisateur" name="nomUtilisateur" /><br />

                    <label>Mot de passe :</label>
                    <ErrorMessage name="motDePasse" component="span" />
                    <Field type="password" id="motDePasse" name="motDePasse" /><br />



                    <button type="submit">Se Connecter</button>
                </Form>
            </Formik>
        </div>
    );
}

export default EnseignantConnect;
