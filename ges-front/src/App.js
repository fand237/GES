import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Home from "./components/Home";
import AdminForm from './components/AdminForm';
import CoursForm from './components/CoursForm'
import CoursAll from './components/CoursAll'
import CoursUpdate from './components/CoursUpdate'
import CoursDelete from './components/CoursDelete'
import TimeTable from './components/TimeTable'
import TimeTableEnseignant from './components/TimeTableEnseignant'
import EleveForm from './components/EleveForm'
import EleveAll from './components/EleveAll'
import EleveUpdate from './components/EleveUpdate'
import EleveDelete from './components/EleveDelete'

import ParentForm from './components/ParentForm'
import ParentUpdate from './components/ParentUpdate'
import ParentDelete from './components/ParentDelete'
import ParentAll from './components/ParentAll'
import FicheAppel from './components/FicheAppel'
import NoteForm from './components/NoteForm'
import NoteUpdate2 from './components/NoteUpdate2'

import NoteEval from './components/NoteEval'
import BulletinSequence from './components/BulletinSequence'







function App() {



  return (
    <div className="App">
    <Router>
    <Link to="/AdminForm">Creer un Administrateur</Link><br/>
    <Link to="/CoursForm">Ajouter un Cours</Link><br/>
    <Link to="/CoursAll">Tout les Cours</Link><br/>
    <Link to="/Home">Accueil</Link>

      <Routes>
        <Route path="/Home" exact element={<Home />}/>
        <Route path="/AdminForm" exact element={<AdminForm />}/>
        <Route path="/CoursForm" exact element={<CoursForm />}/>
        <Route path="/CoursAll" exact element={<CoursAll />}/>
        <Route path="/CoursUpdate/:id" exact element={<CoursUpdate />}/>
        <Route path="/CoursDelete/:id" exact element={<CoursDelete />}/>
        <Route path="/EmploisTemps" exact element={<TimeTable />}/>
        <Route path="/EmploisTempsEnseignant" exact element={<TimeTableEnseignant />}/>
        <Route path="/EleveForm" exact element={<EleveForm />}/>
        <Route path="/EleveAll" exact element={<EleveAll />}/>
        <Route path="/EleveUpdate/:id" exact element={<EleveUpdate />}/>
        <Route path="/EleveDelete/:id" exact element={<EleveDelete />}/>

        
        <Route path="/ParentForm" exact element={<ParentForm />}/>
        <Route path="/ParentUpdate/:id" exact element={<ParentUpdate />}/>
        <Route path="/ParentDelete/:id" exact element={<ParentDelete />}/>
        <Route path="/ParentAll" exact element={<ParentAll />}/>
        <Route path="/ParentAll" exact element={<ParentAll />}/>
        <Route path="/FicheAppel/:idens" exact element={<FicheAppel />}/>
        <Route path="/NoteForm/:idEnseignant" exact element={<NoteForm />}/>
        <Route path="/NoteEval/:idEnseignant" exact element={<NoteEval />}/>
        <Route path="/NoteUpdate/:idCours/:idClasse/:idSequence/:idType/:date" exact element={<NoteUpdate2 />}/>
        <Route path="/BulletinSequence" exact element={<BulletinSequence />}/>













      </Routes>
    </Router>

      
    </div>
  );
}

export default App;
