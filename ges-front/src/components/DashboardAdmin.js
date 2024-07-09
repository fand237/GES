import React from 'react';
import { Link } from 'react-router-dom';

const DashboardEnseignant = () => {
    return (
        <div>
            <h1>Tableau de bord de l'Administrateur</h1>
            <ul>
                <li><Link to="/EmploisTemps">Mon emplois de temps</Link></li>
                {/* Ajoutez d'autres liens vers les différentes pages */}
            </ul>
        </div>
    );
}

export default DashboardEnseignant;
