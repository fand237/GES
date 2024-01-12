import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import Home from "./components/Home";
import AdminForm from './components/AdminForm';
import CoursForm from './components/CoursForm'
import CoursAll from './components/CoursAll'
import CoursUpdate from './components/CoursUpdate'
import CoursDelete from './components/CoursDelete'
import TimeTable from './components/TimeTable'






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


      </Routes>
    </Router>

      
    </div>
  );
}

export default App;
