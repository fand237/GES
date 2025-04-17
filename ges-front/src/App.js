import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, BrowserRouter, Outlet } from "react-router-dom";
/*import 'crypto-browserify';
import 'stream-browserify';
import jwt from 'jsonwebtoken';*/
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import AdminForm from './components/AdminForm';
import DashboardAdmin from './components/DashboardAdmin';
import CoursForm from './components/CoursForm'
import CoursAll from './components/CoursAll'
import CoursUpdate from './components/CoursUpdate'
import CoursDelete from './components/CoursDelete'
import TimeTable from './components/TimeTable'
import TimeTableEnseignant from './components/TimeTableEnseignant'
import DashboardEnseignant from './components/DashboardEnseignant'
import PresenceRapport from './components/PresenceRapport'
import StatistiquesMoyenne from "./components/StatistiquesMoyenne";
import PlanningExamen from './components/PlanningExamen';

import DashboardEleve from './components/DashboardEleve'

import CyClass from './components/CyClass'
import CyClassAll from './components/CyClassAll'

import CycleAll from './components/CycleAll'

import EleveAll from './components/EleveAll'
import EleveUpdate from './components/EleveUpdate'
import EleveDelete from './components/EleveDelete'
import AnnonceEleve from "./components/AnnonceEleve";

import EnseignantUpdate from './components/EnseignantUpdate';
import EnseignantDelete from './components/EnseignantDelete';

import CycleUpdate from './components/CycleUpdate';
import CycleDelete from './components/CycleDelete';

import ClasseUpdate from './components/ClasseUpdate';
import ClasseDelete from './components/ClasseDelete';

import GroupeForm from './components/GroupeForm';
import MatiereForm from './components/MatiereForm';
import JourForm from './components/JourForm';
import SequenceForm from './components/SequenceForm';
import TypeEvaluationForm from './components/TypeEvaluationForm';
import AnneeAcademiqueForm from './components/AnneeAcademiqueForm';
import ChatInterfaceEnseignant  from "./components/ChatInterfaceEnseignant";
import ChatEnseignantAll from "./components/ChatEnseignantAll"
import ChatInterfaceAll  from "./components/ChatInterfaceAll";


import ParentForm from './components/ParentForm'
import ParentUpdate from './components/ParentUpdate'
import ParentDelete from './components/ParentDelete'
import ParentAll from './components/ParentAll'
import FicheAppel from './components/FicheAppel'
import NoteForm from './components/NoteForm'
import NoteUpdate2 from './components/NoteUpdate2'
import NoteDelete from './components/NoteDelete'
import LoginAll from './components/LoginAll'
import FormAll from './components/FormAll'

import UserAll from './components/UserAll'

import Logout from './components/Logout'


import NoteEval from './components/NoteEval'
import BulletinSequence from './components/BulletinSequence'
import config from './config/config'// eslint-disable-next-line
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
// eslint-disable-next-line 

import { useNavigate } from 'react-router-dom';


/*const AuthenticatedRoute = ({ children, role }) => {
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwt.verify(storedToken, 'importantsecret'); // Replace 'secretKey' with your actual secret
      setUserRole(decoded.typeUtilisateur);
    }
  }, []);

  // Check if user is logged in and has the required role
  if (!token || userRole !== role) {
    return <Navigate to="/LoginAll" replace />;
  }

  return children;
};*/







function App() {
  //const navigate = useNavigate(); // Utilisation de useNavigate

  const [authState, setAuthState] = useState({
    nomUtilisateur: "",
    id: 0,
    typeUtilisateur: "",
    status: false,
  });

  useEffect(() => {
    const setSatate = async () => {
      try {
        await axios
          .get(`${config.api.baseUrl}/Enseignants/auth`, {
            headers: {
              "accessToken": localStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            if (response.data.error) {
              setAuthState({
                nomUtilisateur: "",
                id: 0,
                typeUtilisateur: "",
                status: false,
              });

            } else {
              setAuthState({
                nomUtilisateur: response.data.nomUtilisateur,
                id: response.data.id,
                typeUtilisateur: response.data.typeUtilisateur,
                status: true,
              });

            }
          });
      } catch (error) {
        console.error('Erreur lors de la récupération des donnees :', error);
      }
    };

    setSatate();
  }, [authState]);



  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      nomUtilisateur: "",
      id: 0,
      typeUtilisateur: "",
      status: false,
    });
  }

  const AutoRedirect = () => {
    if (!authState.status) {
      return <Navigate to="/Home" replace />;
    }

    switch(authState.typeUtilisateur) {
      case "Eleve":
        return <Navigate to="/DashboardEleve" replace />;
      case "Enseignant":
        return <Navigate to="/DashboardEnseignant" replace />;
      case "Administrateur":
        return <Navigate to="/DashboardAdmin" replace />;
      default:
        return <Navigate to="/Home" replace />;
    }
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>

          <Navbar authState={authState} logout={logout} />


          <Routes>
            <Route path="/" element={<AutoRedirect/>} />
            <Route path="/Home" element={<Home />} />


            <Route path="/DashboardEnseignant" element={<ProtectedRoute requiredRole="Enseignant"> <DashboardEnseignant /> </ProtectedRoute>} >
              <Route path="FicheAppel/:idens" element={<ProtectedRoute requiredRole="Enseignant"> <FicheAppel /> </ProtectedRoute>} />
              <Route path="FicheAppel/:idens" element={<ProtectedRoute requiredRole="Enseignant"> <FicheAppel /> </ProtectedRoute>} />

              <Route path="NoteForm/:idEnseignant" element={<ProtectedRoute requiredRole="Enseignant"> <NoteForm /> </ProtectedRoute>} />
              <Route path="NoteEval/:idEnseignant" element={<ProtectedRoute requiredRole="Enseignant"> <NoteEval /> </ProtectedRoute>} />
              <Route path="NoteUpdate/:idCours/:idClasse/:idSequence/:idType/:date" element={<ProtectedRoute requiredRole="Enseignant"> <NoteUpdate2 /> </ProtectedRoute>} />
              <Route path="NoteDelete/:idNote" element={<ProtectedRoute requiredRole="Enseignant"> <NoteDelete /> </ProtectedRoute>} />
              <Route path="ChatEnseignantAll" element={<ProtectedRoute requiredRole="Enseignant"> <ChatEnseignantAll /> </ProtectedRoute>} />

              <Route path="EmploisTempsEnseignant" element={<ProtectedRoute requiredRole="Enseignant"> <TimeTableEnseignant /> </ProtectedRoute>} />

            </Route>

            <Route path="/LoginAll" element={<LoginAll />} />
            <Route path="/Logout" element={<Logout />} />

            <Route path="/DashboardAdmin" element={<ProtectedRoute requiredRole="Administrateur"> <DashboardAdmin /></ProtectedRoute>}>
              <Route path="UserAll" element={<ProtectedRoute requiredRole="Administrateur"> <UserAll /> </ProtectedRoute>} />
              <Route path="AdminForm" element={<ProtectedRoute requiredRole="Administrateur"> <AdminForm /> </ProtectedRoute>} />
              <Route path="EleveAll" element={<ProtectedRoute requiredRole="Administrateur"> <EleveAll /> </ProtectedRoute>} />
              <Route path="EleveUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"> <EleveUpdate /> </ProtectedRoute>} />
              <Route path="EleveDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <EleveDelete /> </ProtectedRoute>} />
              <Route path="CycleUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"> <CycleUpdate /> </ProtectedRoute>} />
              <Route path="CycleDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <CycleDelete /> </ProtectedRoute>} />
              <Route path="ClasseUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"> <ClasseUpdate /> </ProtectedRoute>} />
              <Route path="ClasseDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <ClasseDelete /> </ProtectedRoute>} />
              <Route path="EnseignantUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"><EnseignantUpdate /></ProtectedRoute>} />
              <Route path="EnseignantDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <EnseignantDelete /> </ProtectedRoute>} />
              <Route path="CyClass" element={<ProtectedRoute requiredRole="Administrateur"> <CyClass /> </ProtectedRoute>} />
              <Route path="CyClassAll" element={<ProtectedRoute requiredRole="Administrateur"> <CyClassAll /> </ProtectedRoute>} />
              <Route path="CycleAll" element={<ProtectedRoute requiredRole="Administrateur"> <CycleAll /> </ProtectedRoute>} />
              <Route path="ParentForm" element={<ProtectedRoute requiredRole="Administrateur"> <ParentForm /> </ProtectedRoute>} />
              <Route path="ParentUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"> <ParentUpdate /> </ProtectedRoute>} />
              <Route path="ParentDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <ParentDelete /> </ProtectedRoute>} />
              <Route path="ParentAll" element={<ProtectedRoute requiredRole="Administrateur"> <ParentAll /> </ProtectedRoute>} />
              <Route path="CoursForm" element={<ProtectedRoute requiredRole="Administrateur"> <CoursForm /> </ProtectedRoute>} />
              <Route path="CoursAll" element={<ProtectedRoute requiredRole="Administrateur"> <CoursAll /> </ProtectedRoute>} />
              <Route path="CoursUpdate/:id" element={<ProtectedRoute requiredRole="Administrateur"> <CoursUpdate /> </ProtectedRoute>} />
              <Route path="CoursDelete/:id" element={<ProtectedRoute requiredRole="Administrateur"> <CoursDelete /> </ProtectedRoute>} />
              <Route path="EmploisTemps" element={<ProtectedRoute requiredRole="Administrateur"> <TimeTable /> </ProtectedRoute>} />
              <Route path="FormAll" element={<ProtectedRoute requiredRole="Administrateur"><FormAll /></ProtectedRoute>} />
              <Route path="PresenceRapport" element={<ProtectedRoute requiredRole="Administrateur"><PresenceRapport /></ProtectedRoute>} />
              <Route path="StatistiquesMoyenne" element={<ProtectedRoute requiredRole="Administrateur"><StatistiquesMoyenne /></ProtectedRoute>} />
              <Route path="PlanningExamen" element={<ProtectedRoute requiredRole="Administrateur"><PlanningExamen /></ProtectedRoute>} />



              <Route path="GroupeForm" element={<ProtectedRoute requiredRole="Administrateur"><GroupeForm /></ProtectedRoute>} />
              <Route path="MatiereForm" element={<ProtectedRoute requiredRole="Administrateur"><MatiereForm /></ProtectedRoute>} />
              <Route path="JourForm" element={<ProtectedRoute requiredRole="Administrateur"><JourForm /></ProtectedRoute>} />
              <Route path="SequenceForm" element={<ProtectedRoute requiredRole="Administrateur"><SequenceForm /></ProtectedRoute>} />
              <Route path="TypeEvaluationForm" element={<ProtectedRoute requiredRole="Administrateur"><TypeEvaluationForm /></ProtectedRoute>} />
              <Route path="AnneeAcademiqueForm" element={<ProtectedRoute requiredRole="Administrateur"><AnneeAcademiqueForm /></ProtectedRoute>} />




            </Route>
            <Route path="/DashboardEleve" element={<ProtectedRoute requiredRole="Eleve"> <DashboardEleve /></ProtectedRoute>}>
              <Route path="BulletinSequence" element={<ProtectedRoute requiredRole="Eleve"> <BulletinSequence /> </ProtectedRoute>} />
              <Route path="ChatInterfaceAll" element={<ProtectedRoute requiredRole="Eleve"> <ChatInterfaceAll /> </ProtectedRoute>} />

            </Route>




          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
