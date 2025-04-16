import { jwtDecode } from 'jwt-decode';
import config from "../config/config";

const UseAuth = () => {
  const token = localStorage.getItem('accessToken');
  let idEleve = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        idEleve = decodedToken.id;
      } catch (error) {
        console.log("Token invalide");
      }
    }
  
    return { idEleve };
};

export default UseAuth;
