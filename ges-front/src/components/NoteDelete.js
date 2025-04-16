import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from "../config/config";

function NoteDelete() {
    const { idNote } = useParams();
    const navigate = useNavigate();

    const handleDelete = () => {
        axios.delete(`http://localhost:3001/Note/${idNote}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            }
        )
            .then(() => {
                console.log("Note supprimée avec succès");
                navigate(`/DashboardEnseignant`);
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression de la note :", error);
            });
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-4">Supprimer la Note</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.</p>
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                Confirmer
            </button>
        </div>
    );
}

export default NoteDelete;
