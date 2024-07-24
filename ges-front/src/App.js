import './App.css';
import { BrowserRouter as Router, Route, Routes, Link ,Navigate, BrowserRouter,Outlet} from "react-router-dom";
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
import DashboardEleve from './components/DashboardEleve'

import EleveAll from './components/EleveAll'
import EleveUpdate from './components/EleveUpdate'
import EleveDelete from './components/EleveDelete'

import EnseignantUpdate from './components/EnseignantUpdate';
import EnseignantDelete from './components/EnseignantDelete';



import ParentForm from './components/ParentForm'
import ParentUpdate from './components/ParentUpdate'
import ParentDelete from './components/ParentDelete'
import ParentAll from './components/ParentAll'
import FicheAppel from './components/FicheAppel'
import NoteForm from './components/NoteForm'
import NoteUpdate2 from './components/NoteUpdate2'
import LoginAll from './components/LoginAll'
import FormAll from './components/FormAll'

import Logout from './components/Logout'


import NoteEval from './components/NoteEval'
import BulletinSequence from './components/BulletinSequence'
// eslint-disable-next-line 
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect ,Fragment} from 'react';
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
    typeUtilisateur:"",
    status: false,
  });

  useEffect(() => {
    const setSatate = async () => {
      try {
        await axios
        .get(`http://localhost:3001/Enseignants/auth`, {
          headers: {
            "accessToken": localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          if (response.data.error) {
            setAuthState({
              nomUtilisateur: "",
              id: 0,
              typeUtilisateur:"",
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
      nomUtilisateur: "",
      id: 0,
      typeUtilisateur:"",
      status: false,
    });
  }

  return (
    <div className="App">
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        
      <Navbar authState={authState} logout={logout} />


        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/AdminForm" element={<AdminForm />} />
          <Route
          path="/DashboardAdmin"
          element={
            <ProtectedRoute requiredRole="Administrateur">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
          <Route path="/CoursForm" element={ <ProtectedRoute requiredRole="Administrateur"> <CoursForm /> </ProtectedRoute> } />
          <Route path="/CoursAll" element={<CoursAll />} />
          <Route path="/CoursUpdate/:id" element={<CoursUpdate />} />
          <Route path="/CoursDelete/:id" element={<CoursDelete />} />

          <Route path="/EmploisTemps" element={<TimeTable />} />

          <Route path="/EmploisTempsEnseignant" element={<TimeTableEnseignant />} />
          <Route path="/DashboardEnseignant" element={ <ProtectedRoute requiredRole="Enseignant"> <DashboardEnseignant /> </ProtectedRoute> } />

          <Route path="/LoginAll" element={<LoginAll />} />
          <Route path="/Logout" element={<Logout />} />

          <Route path="/EleveAll" element={<EleveAll />} />
          <Route path="/EleveUpdate/:id" element={<EleveUpdate />} />
          <Route path="/EleveDelete/:id" element={<EleveDelete />} />
          <Route path="/DashboardEleve" element={ <ProtectedRoute requiredRole="Eleve"> <DashboardEleve /> </ProtectedRoute> } />


          <Route
          path="/EnseignantUpdate/:id"
          element={
            <ProtectedRoute requiredRole="Administrateur">
              <EnseignantUpdate />
            </ProtectedRoute>
          }
        />
              <Route path="/EnseignantDelete/:id" element={ <ProtectedRoute requiredRole="Administrateur"> <EnseignantDelete /> </ProtectedRoute> } />


          <Route path="/ParentForm" element={<ParentForm />} />
          <Route path="/ParentUpdate/:id" element={<ParentUpdate />} />
          <Route path="/ParentDelete/:id" element={<ParentDelete />} />
          <Route path="/ParentAll" element={<ParentAll />} />
          <Route path="/FicheAppel/:idens" element={<FicheAppel />} />
          <Route path="/NoteForm/:idEnseignant" element={<NoteForm />} />
          <Route path="/NoteEval/:idEnseignant" element={<NoteEval />} />
          <Route path="/NoteUpdate/:idCours/:idClasse/:idSequence/:idType/:date" element={<NoteUpdate2 />} />
          <Route path="/BulletinSequence/:idEleve/:idSequence" element={ <ProtectedRoute requiredRole="Eleve"> <BulletinSequence /> </ProtectedRoute> } />

          <Route
          path="/FormAll"
          element={
            <ProtectedRoute requiredRole="Administrateur">
              <FormAll />
            </ProtectedRoute>
          }
        />

        </Routes>
      </Router>
    </AuthContext.Provider>
  </div>
  );
}

export default App;
