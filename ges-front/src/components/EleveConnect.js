import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


function Elevelogin
    () {


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
            await axios.post("http://localhost:3001/Eleve/login", data).then((response) => {
                if (response.data.error) {
                    alert(response.data.error)
                }
                else {
                    localStorage.setItem("accessToken", response.data)

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

    return (
        <div className='createElevelogin
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

export default Elevelogin
    ;
