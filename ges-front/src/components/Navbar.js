import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'importer jwt-decode correctement
import svgUser from "../assets/images/user.svg";
import svgDisconnect from "../assets/images/disconnect svg.svg";
import NotificationSystem from './NotificationSystem';
import config from "../config/config";


const Navbar = ({ authState, logout }) => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.typeUtilisateur;
    } catch (error) {
      console.log('Token invalide');
    }
  }

  const handleHomeClick = () => {
    if (token && userRole) {
      if (userRole === 'Administrateur') {
        navigate('/DashboardAdmin');
      } else if (userRole === 'Enseignant') {
        navigate('/DashboardEnseignant');
      } else if (userRole === 'Eleve') {
        navigate('/DashboardEleve');
      }
    } else {
      navigate('/Home');
    }
  };

  return (
    <div>
      {!authState.status ? (
        <div className="bg-gray-50">
          <div className="navbar flex justify-between items-center p-0 bg-purple-700 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <Link to="/Home" className="text-2xl font-bold">
                SoukouGES  <span className="text-blue-500">.</span>
              </Link>
              <div className="flex space-x-6">

                <Link to="/LoginAll">
                  <img
                    src={svgUser}
                    alt="Compte utilisateur"
                    className="w-6 h-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <nav className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-purple-500 to-purple-800 text-white shadow-lg z-50">
  <div className="container mx-auto flex justify-between items-center py-4 px-6">
    <button
      onClick={handleHomeClick}
      className="text-lg font-semibold hover:text-gray-300"
    >
      Accueil
    </button>
    <div className="flex items-center space-x-4">
      <NotificationSystem />
      <button onClick={logout} className="hover:text-gray-300">
        <img
          src={svgDisconnect}
          alt="Déconnexion"
          className="w-6 h-6"
        />
      </button>
      <h1
        onClick={() => {
          if (userRole === 'Administrateur') {
            navigate('/DashboardAdmin');
          } else if (userRole === 'Enseignant') {
            navigate('/DashboardEnseignant');
          } else if (userRole === 'Eleve') {
            navigate('/DashboardEleve');
          }
        }}
        className="text-lg font-semibold cursor-pointer hover:text-gray-300"
      >
        {authState.nomUtilisateur}
      </h1>
    </div>
  </div>
</nav>

      )}
    </div>



  );
};

export default Navbar;
