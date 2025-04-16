import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import config from "../config/config";

const EnseignantConnect = () => {
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();

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
            await axios
                .post("http://localhost:3001/Enseignants/login", data)
                .then((response) => {
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        localStorage.setItem("accessToken", response.data.token);
                        setAuthState({
                            nomUtilisateur: response.data.nomUtilisateur,
                            id: response.data.id,
                            typeUtilisateur: response.data.typeUtilisateur,
                            status: true,
                        });
                        navigate("/DashboardEnseignant");
                    }
                });
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("accessToken");
        if (isAuthenticated) {
            navigate("/DashboardEnseignant");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg flex w-4/5 lg:w-3/5">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                        alt="login"
                        className="h-full w-full object-cover rounded-l-lg"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
                        Connexion Enseignant
                    </h1>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        {() => (
                            <Form>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Nom d'utilisateur :
                                    </label>
                                    <Field
                                        type="text"
                                        name="nomUtilisateur"
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <ErrorMessage
                                        name="nomUtilisateur"
                                        component="span"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Mot de passe :
                                    </label>
                                    <Field
                                        type="password"
                                        name="motDePasse"
                                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <ErrorMessage
                                        name="motDePasse"
                                        component="span"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <a
                                        href="#"
                                        className="text-sm text-purple-600 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    Se connecter
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <p className="text-center mt-4 text-gray-600">
                        Vous n'avez pas de compte ?{" "}
                        <div
                            className="text-purple-700 font-semibold"
                        >
                            Inscrivez-vous auprès de votre établissement.
                        </div>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnseignantConnect;
