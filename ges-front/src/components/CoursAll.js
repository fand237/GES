import React, { useState } from 'react'
import axios from "axios";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




function CoursAll() {

    const [listOfCours ,setListOfCours] = useState([]);



    let histotique = useNavigate();
    


    useEffect(() => {
      axios.get("http://localhost:3001/Cours")
        .then(async (response) => {
          // Pour chaque cours, effectuez une requête supplémentaire pour récupérer les détails de l'enseignant
          const coursesWithDetails = await Promise.all(
            response.data.map(async (course) => {
              const enseignantDetails = await axios.get(`http://localhost:3001/Enseignants/${course.Enseignant}`);
              const joursDetails = await axios.get(`http://localhost:3001/Jour/${course.jour}`);
              const classesDetails = await axios.get(`http://localhost:3001/Classe/${course.classe}`);
              return {
                ...course,
                Enseignant: enseignantDetails.data,
                jour: joursDetails.data,
                classe: classesDetails.data,
              };
            })
          );
  
          setListOfCours(coursesWithDetails);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des cours et jours : ", error);
        });
    }, []);

    
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:3001/Cours/${id}`);
        console.log("Cours supprimé avec succès");
        histotique(`/CoursAll`); // Rediriger vers la liste des cours après la suppression
      } catch (error) {
        console.error("Erreur lors de la suppression du cours : ", error);
      }
    };


  return (
    <div>
        {listOfCours.map((value,key) => {
            return (
              <div>
                
              <div className='Cours' >

                    <br/>
                    <div className='matiere'>{value.matiere}</div>
                    <div className='classe'>{value.classe ? `${value.classe.classe}` : "N/A"}</div>
                    <div className='heureDebut'>{value.heureDebut}</div>
                    <div className='heureFin'>{value.heureFin}</div>
                    <div className='jour'>{value.jour ? `${value.jour.jour}` : "N/A"}</div>
                    <div className='Enseignant'>{value.Enseignant ? `${value.Enseignant.nom} (${value.Enseignant.nomUtilisateur})` : "N/A"}</div>
                    <button type="button" onClick={() => {histotique(`/CoursUpdate/${value.id}`)}}>Modifier</button>
                    <button type="button" onClick={() => handleDelete(`${value.id}`)}>Supprimer</button>


                </div>
                </div>
            );
        })}
    </div>
  )
}

export default CoursAll;