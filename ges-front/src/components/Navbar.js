// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'importer jwt-decode correctement

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
      navigate('/');
    }
  };

  return (
    <div>
      {!authState.status ? (
        <div className="bg-gray-50">
          <div className="navbar flex justify-between items-center p-0 bg-purple-700 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              <Link to="/Home" className="text-2xl font-bold">
                G.E.S  <span className="text-blue-500">.</span>
              </Link>
              <div className="flex space-x-6">

                <Link to="/LoginAll">
                  <img
                    src="ges-front/images/user-svgrepo-com.svg"
                    alt="Compte utilisateur"
                    className="w-6 h-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar flex justify-between items-center p-4 bg-purple-700 text-white">
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="text-lg font-semibold hover:text-gray-300"
            >
              Accueil
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={logout} className="text-lg hover:text-gray-300">
              Déconnexion
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
              className="text-lg cursor-pointer hover:text-gray-300"
            >
              {authState.nomUtilisateur}
            </h1>
          </div>
        </div>
      )}
    </div>



  );
};

export default Navbar;
