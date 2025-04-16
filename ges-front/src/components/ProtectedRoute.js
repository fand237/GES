import React, { useEffect } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'importer correctement jwt-decode
import config from "../config/config";

const useAuth = () => {
  const token = localStorage.getItem('accessToken');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAuthenticated = true;
      userRole = decodedToken.typeUtilisateur;
    } catch (error) {
      console.log("Token invalide");
    }
  }

  return { isAuthenticated, userRole };
};

const ProtectedRoute = ({ children,requiredRole }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié ou n'a pas le rôle requis,
    // redirigez-le vers la page de connexion
    if (!isAuthenticated || userRole !== requiredRole) {
      navigate('/LoginAll');
    }
  }, [isAuthenticated, userRole, requiredRole, navigate]);

  // Retourne un composant Route avec les props restantes (path, etc.)
  // Si l'utilisateur est authentifié et a le rôle requis, affiche le composant Element
  // Sinon, redirigez l'utilisateur vers la page de connexion
  return isAuthenticated && userRole === requiredRole ? (
    children
  ) : (
    <Navigate to="/LoginAll" replace />
  );
};

export default ProtectedRoute;
