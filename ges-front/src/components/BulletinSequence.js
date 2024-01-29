import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function BulletinSequence() {
  // États pour stocker les données nécessaires
  const [bulletin, setBulletin] = useState({});
  const [loading, setLoading] = useState(true);
  const { idEleve, idSequence } = useParams();


  // Effet de chargement des données au montage du composant
  useEffect(() => {
    const fetchBulletin = async () => {
      try {
        // Appeler l'API pour récupérer le bulletin pour l'élève et la séquence spécifiés
        const response = await axios.get(`http://localhost:3001/Bulletin/byeleve/1/1`);
        console.log(response.data)

        // Mettre à jour l'état avec les données du bulletin
        setBulletin(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du bulletin :', error);
        setLoading(false);
      }
    };

    // Appeler la fonction de récupération du bulletin
    fetchBulletin();
  }, [idEleve, idSequence]);

  // Afficher un indicateur de chargement si les données sont en cours de chargement
  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  // Afficher le bulletin une fois les données chargées
  return (
    <div>
      <h2>Bulletin de l'élève</h2>
      <table>
        <tr>
          <td></td>
          <td>REPUBLIQUE DU CAMEROUN</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>ARCHEDIOCESE DE YAOUNDE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>MINSEC</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>COLLEGE FANDY</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>DELEGATION DU CENTRE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>BP 5475 Yaounde</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>BULLETIN DE LA {bulletin[0].noteBulletin.sequenceNote.sequence}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Annee Scolaire:{bulletin[0].anneeBulletin.annee}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Nom(s):{bulletin[0].eleveBulletin.nom} {bulletin[0].eleveBulletin.prenom}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Classe:{bulletin[0].eleveBulletin.classeEleve.classe}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Né(e) le :{bulletin[0].eleveBulletin.dateNaissance}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>Effectif:</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>Matière/Enseignant</td>
          <td>Moy</td>
          <td>coef</td>
          <td>total</td>
          <td>rang</td>
          <td>details des notes</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>1er Groupe</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>


        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "1er Groupe"
            ) {

              return (
                <tr key={i}>
                  <td></td>
                  <td>{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.EnseignantCours.nom} {item.noteBulletin.coursNote.EnseignantCours.prenom}</td>
                  <td>null1</td>
                  <td>{item.noteBulletin.coursNote.coefficient}</td>
                  <td>null1</td>
                  <td>null1</td>
                  <td>
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }






        <tr>
          <td></td>
          <td>MATIERE DU 1ER GROUPE</td>
          <td></td>
          <td>Points:</td>
          <td></td>
          <td>Coef:</td>
          <td></td>
          <td>Moyenne:</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>2eme Groupe</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "2eme Groupe"
            ) {

              return (
                <tr key={i}>
                  <td></td>
                  <td>{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.EnseignantCours.nom} {item.noteBulletin.coursNote.EnseignantCours.prenom}</td>
                  <td>null1</td>
                  <td>{item.noteBulletin.coursNote.coefficient}</td>
                  <td>null1</td>
                  <td>null1</td>
                  <td>
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }
       
        <tr>
          <td></td>
          <td>MATIERE DU 2EME GROUPE</td>
          <td></td>
          <td>Points:</td>
          <td></td>
          <td>Coef:</td>
          <td></td>
          <td>Moyenne:</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>3eme Groupe</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "3eme Groupe"
            ) {

              return (
                <tr key={i}>
                  <td></td>
                  <td>{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.EnseignantCours.nom} {item.noteBulletin.coursNote.EnseignantCours.prenom}</td>
                  <td>null1</td>
                  <td>{item.noteBulletin.coursNote.coefficient}</td>
                  <td>null1</td>
                  <td>null1</td>
                  <td>
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }
        
        <tr>
          <td></td>
          <td>MATIERE DU 3EME GROUPE</td>
          <td></td>
          <td>Points:</td>
          <td></td>
          <td>Coef:</td>
          <td></td>
          <td>Moyenne:</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>Ponits</td>
          <td>Coef</td>
          <td>Moyenne</td>
          <td>rang</td>
          <td></td>
          <td>Mention du travail</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>455.2</td>
          <td>32</td>
          <td>13.2</td>
          <td>12</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  );
};

export default BulletinSequence;
