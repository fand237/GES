import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UseAuthEleve from './UseAuthEleve';



function BulletinSequence() {
  // États pour stocker les données nécessaires
  const [bulletin, setBulletin] = useState({});
  const [loading, setLoading] = useState(true);
  const { idEleve } = UseAuthEleve();
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Sequence`);
        console.log("les sequnece sont",response.data);
        setSequences(response.data);
        setSelectedSequence(response.data[0]?.id || '');
      } catch (error) {
        console.error('Erreur lors de la récupération des séquences :', error);
      }
    };

    fetchSequences();
  }, []);



  // Effet de chargement des données au montage du composant
  useEffect(() => {
    if (selectedSequence) {
      console.log(selectedSequence);
      const fetchBulletin = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3001/Bulletin/byeleve/${idEleve}/${selectedSequence}`);
          console.log("le buleetin est :",response.data);
          setBulletin(response.data);
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError('Aucune donnée trouvée.');
          } else {
            setError('Erreur lors de la récupération du bulletin.');
          }          setLoading(false);
        }
      };
 
      fetchBulletin();
    }
  }, [idEleve, selectedSequence]);


  // Afficher un indicateur de chargement si les données sont en cours de chargement
  if (loading) {
    return <p className="text-center text-gray-700">Chargement en cours...</p>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Afficher le bulletin une fois les données chargées
  return (
    
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700">Sélectionner une séquence :</label>
        <select
          value={selectedSequence}
          onChange={(e) => setSelectedSequence(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          {sequences.map((sequence) => (
            <option key={sequence.id} value={sequence.id}>
              {sequence.sequence}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-xl font-semibold mb-4">Bulletin de l'élève</h2>
      <table className="min-w-full divide-y divide-gray-200">
      <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
            {/* Ajoutez d'autres en-têtes si nécessaire */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200" >
        <tr className="bg-gray-50">
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">REPUBLIQUE DU CAMEROUN</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">ARCHEDIOCESE DE YAOUNDE</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">MINSEC</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">COLLEGE FANDY</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">DELEGATION DU CENTRE</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">BP 5475 Yaounde</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">BULLETIN DE LA {bulletin[0].noteBulletin.sequenceNote.sequence}</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign">Annee Scolaire:{bulletin[0].anneeBulletin.annee}</td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
          <td colSpan="2" className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td className="table-lign"></td>
          <td className="table-lign">Nom(s):{bulletin[0].eleveBulletin.nom} {bulletin[0].eleveBulletin.prenom}</td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign">Classe:{bulletin[0].eleveBulletin.classeEleve.classe}</td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td className="table-lign"></td>
          <td className="table-lign">Né(e) le :{bulletin[0].eleveBulletin.dateNaissance}</td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign">Effectif:</td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <th className="table-lign1"></th>
          <th className="table-lign1">Matière/Enseignant</th>
          <th className="table-lign1">Moy</th>
          <th className="table-lign1">coef</th>
          <th className="table-lign1">total</th>
          <th className="table-lign1">rang</th>
          <th className="table-lign1">details des notes</th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
        </tr>
        <tr className="bg-gray-50">
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign" ></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
          <th className="table-lign1"></th>
          <th className="table-lign1">1er Groupe</th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
          <th className="table-lign1"></th>
        </tr>


        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "1er Groupe"
            ) {

              return (
                <tr key={i}>
                  <td className="table-lign"></td>
                  <td className="table-lign-0">{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.enseignant.nom} {item.noteBulletin.coursNote.enseignant.prenom}</td>
                  <td className="table-lign-0">null1</td>
                  <td className="table-lign-0">{item.noteBulletin.coursNote.coefficient}</td>
                  <td className="table-lign-0">null1</td>
                  <td className="table-lign-0">null1</td>
                  <td className="table-lign-0">
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                  <td className="table-lign"></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }






        <tr className="bg-gray-50">
          <th className="table-lign"></th>
          <th className="table-lign">MATIERE DU 1ER GROUPE</th>
          <th className="table-lign"></th>
          <th className="table-lign">Points:</th>
          <th className="table-lign"></th>
          <th className="table-lign">Coef:</th>
          <th className="table-lign"></th>
          <th className="table-lign">Moyenne:</th>
          <th className="table-lign"></th>
          <th className="table-lign"></th>
          <th className="table-lign"></th>
          <th className="table-lign"></th>
          <th className="table-lign"></th>
          <th className="table-lign"></th>
        </tr>
        <tr className="bg-gray-50">
        <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        <tr className="bg-gray-50">
        <td className="table-lign"></td>
          <td className="table-lign">2eme Groupe</td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
          <td className="table-lign"></td>
        </tr>
        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "2eme Groupe"
            ) {

              return (
                <tr key={i}>
                  <td className="table-lign-0"></td>
                  <td className="table-lign">{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.enseignant.nom} {item.noteBulletin.coursNote.enseignant.prenom}</td>
                  <td className="table-lign-0">null1</td>
                  <td  className="table-lign-0">{item.noteBulletin.coursNote.coefficient}</td>
                  <td  className="table-lign-0">null1</td>
                  <td  className="table-lign-0">null1</td>
                  <td  className="table-lign-0">
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }
       
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td className="table-lign">MATIERE DU 2EME GROUPE</td>
          <td  className="table-lign-0"></td>
          <td className="table-lign">Points:</td>
          <td  className="table-lign-0"></td>
          <td className="table-lign">Coef:</td>
          <td  className="table-lign-0"></td>
          <td className="table-lign">Moyenne:</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td className="table-lign">3eme Groupe</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        {
          bulletin.map((item, i) => {


            if (
              item.noteBulletin.coursNote.groupeCours.groupe === "3eme Groupe"
            ) {

              return (
                <tr key={i}>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign">{item.noteBulletin.coursNote.matiere}/{item.noteBulletin.coursNote.enseignant.nom} {item.noteBulletin.coursNote.enseignant.prenom}</td>
                  <td  className="table-lign-0">null1</td>
                  <td  className="table-lign">{item.noteBulletin.coursNote.coefficient}</td>
                  <td  className="table-lign-0">null1</td>
                  <td  className="table-lign-0">null1</td>
                  <td  className="table-lign">
                    Evaluation harmonisée ({item.elements[1]?.noteBulletin.note}/20) Evaluation personnelle ({item.elements[0]?.noteBulletin.note}/20)
                  </td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                  <td  className="table-lign-0"></td>
                </tr>

              );
            }

            return null; // Dans le cas où aucune condition n'est satisfaite, renvoyer null
          })
        }
        
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign">MATIERE DU 3EME GROUPE</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign">Points:</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign">Coef:</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign">Moyenne:</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign">Ponits</td>
          <td  className="table-lign">Coef</td>
          <td  className="table-lign">Moyenne</td>
          <td  className="table-lign">rang</td>
          <td  className="table-lign-0"></td>
          <td className="table-lign">Mention du travail</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        <tr className="bg-gray-50">
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td className="table-lign-0">455.2</td>
          <td className="table-lign-0">32</td>
          <td className="table-lign-0">13.2</td>
          <td className="table-lign-0">12</td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
          <td  className="table-lign-0"></td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BulletinSequence;
