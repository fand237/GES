import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CoursDelete() {
  const { id } = useParams();
  let navigate = useNavigate();

  const handleDelete = () => {
    axios.delete(`http://localhost:3001/Cours/${id}`)
      .then(() => {
        console.log("Cours supprimé avec succès");
        navigate(`/CoursAll`); // Utilisation de navigate pour la navigation
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du cours : ", error);
      });
  };

  return (
    <div className='deleteCoursPage'>
      <h2>Supprimer le cours</h2>
      <p>Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.</p>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}

export default CoursDelete;
