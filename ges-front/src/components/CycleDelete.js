import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "../config/config";

function CycleDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    axios.delete(`http://localhost:3001/Cycle/${id}`,{
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        console.log("Cycle supprimé avec succès");
        navigate(`/DashboardAdmin`);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du cycle : ", error);
      });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Supprimer ce cycle</h2>
      <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce Cycle ? Cette action est irréversible.</p>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Confirmer
      </button>
    </div>
  );
}

export default CycleDelete;
