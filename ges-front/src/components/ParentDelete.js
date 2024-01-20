import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ParentDelete() {
  const { id } = useParams();
  let navigate = useNavigate();

  const handleDelete = () => {
    axios.delete(`http://localhost:3001/Parent/${id}`)
      .then(() => {
        console.log("Parent supprimé avec succès");
        navigate(`/ParentAll`); // Utilisation de navigate pour la navigation
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du Parent : ", error);
      });
  };

  return (
    <div className='deleteParentPage'>
      <h2>Supprimer le Parent</h2>
      <p>Êtes-vous sûr de vouloir supprimer ce Parent ? Cette action est irréversible.</p>
      <button onClick={handleDelete}>Confirmer</button>
    </div>
  );
}

export default ParentDelete;
