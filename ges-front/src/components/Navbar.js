// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'importer correctement jwt-decode


const Navbar = ({ authState, logout }) => {
  const token = localStorage.getItem('accessToken');
  let userRole = null;

  const navigate = useNavigate();
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
       userRole = decodedToken.typeUtilisateur;
    } catch (error) {
      console.log("Token invalide");
    }
  }
  const handleUserClick = () => {
    if (userRole === 'Administrateur') {
      navigate('/DashboardAdmin');
    } else if (userRole === 'Enseignant') {
      navigate('/DashboardEnseignant');
    } else if (userRole === 'Eleve') {
      navigate('/DashboardEleve');
    }
  };

  return (
    <div className="navbar flex justify-between items-center p-4 bg-purple-700 text-white">
    <div className="flex items-center">
      <Link to="/" className="text-lg font-semibold hover:text-gray-300">Accueil</Link>
    </div>
    <div className="flex items-center space-x-4">
      {!authState.status ? (
        <>
          <Link to="/LoginAll" className="text-lg hover:text-gray-300">Se Connecter</Link>
        </>
      ) : (
        <>
          <button onClick={logout} className="text-lg hover:text-gray-300">Déconnexion</button>
          <h1
            onClick={handleUserClick}
            className="text-lg cursor-pointer hover:text-gray-300"
          >
            {authState.nomUtilisateur}
          </h1>
        </>
      )}
    </div>
  </div>
  
  );
};

export default Navbar;
