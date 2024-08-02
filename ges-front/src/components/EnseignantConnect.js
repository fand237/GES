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
                   
                })

                .then((response) => {
                    if (response.data.error) {
                        alert(response.data.error)
                    }
                    else {
                        localStorage.setItem("accessToken", response.data.token)
                        setAuthState({
                            nomUtilisateur: response.data.nomUtilisateur,
                            id: response.data.id,
                            typeUtilisateur:response.data.typeUtilisateur,
                            status: true,
                          })
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
        <div className="pannel-connect-1">
        <div className="pannel-connect-2">
        <h1 className="titre-connect">
                   Connexion ENS
                </h1>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="mt-6">
                    <div className="mb-2">
                    <label for="email"
                            className="block text-sm font-semibold text-gray-800">Nom d'utilisateur :</label>
                    <ErrorMessage name="nomUtilisateur" component="span" />
                    <Field type="text" id="nomUtilisateur" name="nomUtilisateur" className="input-user"/><br />
                    </div>
                    <div className="mb-2">
                    <label for="password"
                            className="block text-sm font-semibold text-gray-800">Mot de passe :</label>
                    <ErrorMessage name="motDePasse" component="span" />
                    <Field type="password" id="motDePasse" name="motDePasse"
                            className="input-password" /><br />
                    </div>
                    <a
                        href="#"
                        className="forget-password"
                    >
                        Mot de passe oublie?
                    </a>
                    <div className="mt-6">
                    <button type="submit" className='send-button'>Se Connecter</button>
                    </div>
                </Form>
            </Formik>
        </div>
        </div>
    );
}

export default EnseignantConnect;
