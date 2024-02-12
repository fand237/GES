import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import AdminForm from './components/AdminForm';
import CoursForm from './components/CoursForm'
import CoursAll from './components/CoursAll'
import CoursUpdate from './components/CoursUpdate'
import CoursDelete from './components/CoursDelete'
import TimeTable from './components/TimeTable'
import TimeTableEnseignant from './components/TimeTableEnseignant'
import DashboardEnseignant from './components/DashboardEnseignant'

import EleveForm from './components/EleveForm'
import EleveAll from './components/EleveAll'
import EleveUpdate from './components/EleveUpdate'
import EleveDelete from './components/EleveDelete'
import EleveConnect from './components/EleveConnect'

import EnseignantForm from './components/EnseignantForm'
import EnseignantConnect from './components/EnseignantConnect'


import ParentForm from './components/ParentForm'
import ParentUpdate from './components/ParentUpdate'
import ParentDelete from './components/ParentDelete'
import ParentAll from './components/ParentAll'
import FicheAppel from './components/FicheAppel'
import NoteForm from './components/NoteForm'
import NoteUpdate2 from './components/NoteUpdate2'

import NoteEval from './components/NoteEval'
import BulletinSequence from './components/BulletinSequence'
// eslint-disable-next-line 
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from 'react';
import axios from 'axios';








function App() {
  const [authState, setAuthState] = useState({
    nomUtilisateur: "",
    id: 0,
    typeUtilisateur:"",
    status: false,
  });

  useEffect(() => {
    const setSatate = async () => {
      try {
        await axios
        .get('http://localhost:3001/Enseignants/auth', {
          headers: {
            "accessToken": localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          console.log(response.data)
          if (response.data && response.data.error) {
            setAuthState({
              ...authState,
              status: false,
            });
  
          } else {
            setAuthState({
              nomUtilisateur: response.data.nomUtilisateur,
              id: response.data.id,
              typeUtilisateur:response.data.typeUtilisateur,
              status: true,
            });
  
          }
        });
      }catch (error) {
        console.error('Erreur lors de la récupération des donnees :', error);
      }
    };

    setSatate();
  }, [authState]);

  

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      ...authState,
      status: false,
    });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className='navbar'>
            <Link to="/CoursForm">Ajouter un Cours</Link><br />
            <Link to="/CoursAll">Tout les Cours</Link><br />
            {!authState.status ? (
              <>

                <Link to="/EnseignantConnect">Se Connecter</Link><br />
                <Link to="/EnseignantForm">S'enregistrer</Link><br />
              </>
            ) : (
              <button onClick={logout}>Deconnexion</button>
            )}
            <h1>{authState.nomUtilisateur}</h1>
          </div>

          <Routes>
            <Route path="/Home" exact element={<Home />} />
            <Route path="/AdminForm" exact element={<AdminForm />} />
            <Route path="/CoursForm" exact element={<CoursForm />} />
            <Route path="/CoursAll" exact element={<CoursAll />} />
            <Route path="/CoursUpdate/:id" exact element={<CoursUpdate />} />
            <Route path="/CoursDelete/:id" exact element={<CoursDelete />} />
            <Route path="/EmploisTemps" exact element={<TimeTable />} />
            <Route path="/EmploisTempsEnseignant" exact element={<TimeTableEnseignant />} />
            <Route path="/DashboardEnseignant" exact element={<DashboardEnseignant />} />

            <Route path="/EleveForm" exact element={<EleveForm />} />
            <Route path="/EleveLogin" exact element={<EleveConnect />} />

            <Route path="/EleveAll" exact element={<EleveAll />} />
            <Route path="/EleveUpdate/:id" exact element={<EleveUpdate />} />
            <Route path="/EleveDelete/:id" exact element={<EleveDelete />} />

            <Route path="/EnseignantForm" exact element={<EnseignantForm />} />
            <Route path="/EnseignantConnect" exact element={<EnseignantConnect />} />


            <Route path="/ParentForm" exact element={<ParentForm />} />
            <Route path="/ParentUpdate/:id" exact element={<ParentUpdate />} />
            <Route path="/ParentDelete/:id" exact element={<ParentDelete />} />
            <Route path="/ParentAll" exact element={<ParentAll />} />
            <Route path="/ParentAll" exact element={<ParentAll />} />
            <Route path="/FicheAppel/:idens" exact element={<FicheAppel />} />
            <Route path="/NoteForm/:idEnseignant" exact element={<NoteForm />} />
            <Route path="/NoteEval/:idEnseignant" exact element={<NoteEval />} />
            <Route path="/NoteUpdate/:idCours/:idClasse/:idSequence/:idType/:date" exact element={<NoteUpdate2 />} />
            <Route path="/BulletinSequence/:idEleve/:idSequence" exact element={<BulletinSequence />} />













          </Routes>
        </Router>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
