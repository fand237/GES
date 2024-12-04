import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Logout = () => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    nomUtilisateur: "",
    id: 0,
    typeUtilisateur: "",
    status: false,
  });

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer les informations d'authentification du localStorage
    localStorage.removeItem("accessToken");

    // Réinitialiser l'état d'authentification dans le composant parent
    setAuthState({
      nomUtilisateur: "",
      id: 0,
      typeUtilisateur: "",
      status: false,
    });

    // Rediriger vers la page de connexion
    navigate('/Home');
  };

  return (
    <div>
      <h1>Vous êtes sur le point de vous déconnecter</h1>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
};

export default Logout;
