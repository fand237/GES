import { jwtDecode } from 'jwt-decode';
import config from "../config/config";


const UseAuth = () => {
  const token = localStorage.getItem('accessToken');
  let idens = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        idens = decodedToken.id;
      } catch (error) {
        console.log("Token invalide");
      }
    }
  
    return { idens };
};

export default UseAuth;
