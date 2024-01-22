import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EleveDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    axios.delete(`http://localhost:3001/Eleve/${id}`)
      .then(() => {
        console.log("Élève supprimé avec succès");
        navigate(`/EleveAll`); // Utilisation de navigate pour la navigation
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'Élève : ", error);
      });
  };

  return (
    <div className='deleteElevePage'>
      <h2>Supprimer l'Élève</h2>
      <p>Êtes-vous sûr de vouloir supprimer cet Élève ? Cette action est irréversible.</p>
      <button onClick={handleDelete}>Confirmer</button>
    </div>
  );
}

export default EleveDelete;
