import React from 'react';
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup"
import axios from "axios";
import config from "../config/config";



function AdminForm(){

const initialValues={
  nomUtilisateur:"",
  motDePasse:"",
  email:"",
};

const validationSchema = Yup.object().shape({
  nomUtilisateur:Yup.string().min(6).max(12).required("nomUtilisateur obligatoire"),
  motDePasse:Yup.string().required("mot de passe obligatoire"),
  email:Yup.string().required("email obligatoire"),
});

const onSubmit=(data) => {
  axios.post(`${config.api.baseUrl}/Administrateur`, data).then((response) => {
          console.log("IT WORKED");
        });
};

  return <div className='createAdminFormPage'>
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      <Form>
      <label>Nom d'utilisateur:</label>
      <ErrorMessage name="nomUtilisateur" element={<span/>}/>
        <Field id="nomUtilisateur" name="nomUtilisateur" placeholder="(Ex. fand237...)"/><br/>

        <label>Mot de passe:</label>
        <ErrorMessage name="motDePasse" element={<span/>}/>
        <Field id="motDePasse" type="password" name="motDePasse" /><br/>

        <label>Email:</label>
        <ErrorMessage name="email" element={<span/>}/>
        <Field id="email" name="email" placeholder="(Ex. fand237@gmail.com...)" /><br/>

        <button type="submit">Ajouter Administrateur</button>
      </Form>
    </Formik>
  </div>;
}
export default AdminForm;
