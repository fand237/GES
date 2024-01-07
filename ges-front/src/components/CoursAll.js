import React, { useState } from 'react'
import axios from "axios";
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';



function CoursAll() {

    const [listOfCours ,setListOfCours] = useState([]);

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    let histotique = useHistory();
    


    useEffect(() => {
      axios.get("http://localhost:3001/Cours")
        .then(async (response) => {
          // Pour chaque cours, effectuez une requête supplémentaire pour récupérer les détails de l'enseignant
          const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const enseignantDetails = await axios.get(`http://localhost:3001/Enseignants/${course.Enseignant}`);
              return {
                ...course,
                Enseignant: enseignantDetails.data,
              };
            })
          );
  
          setListOfCours(coursesWithDetails);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des cours : ", error);
        });
    }, []);

  return (
    <div>
        {listOfCours.map((value,key) => {
            return (
                <div className='Cours' onClick={histotique.push('/')}>

                    <div className='matiere'>{value.matiere}</div>
                    <div className='classe'>{value.classe}</div>
                    <div className='heureDebut'>{value.heureDebut}</div>
                    <div className='heureFin'>{value.heureFin}</div>
                    <div className='jour'>{jours[key]}</div>
                    <div className='Enseignant'>{value.Enseignant ? `${value.Enseignant.nom} (${value.Enseignant.nomUtilisateur})` : "N/A"}</div><br/>

                </div>
            );
        })}
    </div>
  )
}

export default CoursAll