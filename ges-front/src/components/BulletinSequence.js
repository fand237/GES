import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UseAuthEleve from './UseAuthEleve';

function BulletinSequence() {
  const { idEleve } = UseAuthEleve();
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState('');
  const [bulletin, setBulletin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchSequences = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Sequence');
        setSequences(response.data);
        setSelectedSequence(response.data[0]?.id || '');
      } catch (err) {
        console.error('Erreur de récupération des séquences:', err);
      }
    };
    fetchSequences();
  }, []);

  useEffect(() => {
    if (selectedSequence) {
      const fetchBulletin = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
              `http://localhost:3001/Bulletin/byeleve/${idEleve}/${selectedSequence}`
          );
          setBulletin(response.data);
          console.log("le bulletin est ", response.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données du bulletin :', err);
          setError('Erreur lors de la récupération des données du bulletin.');
        } finally {
          setLoading(false);
        }
      };
      fetchBulletin();
    }
  }, [idEleve, selectedSequence]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const renderGroup = (groupName) => (
    <>
      <tr className="bg-gray-200">
        <td colSpan="6" className="text-center font-bold py-2">{groupName}</td>
      </tr>
      {bulletin
        .filter(
          (item) => item.noteBulletin.coursNote.groupeCours.groupe === groupName
        )
        .map((item, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{item.noteBulletin.coursNote.matiere}</td>
            <td className="border px-4 py-2">
              {item.noteBulletin.coursNote.enseignant.nom} {item.noteBulletin.coursNote.enseignant.prenom}
            </td>
            <td className="border px-4 py-2">{item.noteBulletin.moyenneNote.moyenne || 'N/A'}</td>
            <td className="border px-4 py-2">{item.noteBulletin.coursNote.coefficient}</td>
            <td className="border px-4 py-2">{item.noteBulletin.total || 'N/A'}</td>
            <td className="border px-4 py-2">
              EH: {item.elements[1]?.noteBulletin.note || 'N/A'}/20, EP: {item.elements[0]?.noteBulletin.note || 'N/A'}/20
            </td>
          </tr>
        ))}
    </>
  );

  return (
    <div className="bg-gradient-to-b from-gray-100 to-blue-50 min-h-screen p-6">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Sélectionner une séquence :
          </label>
          <select
            value={selectedSequence}
            onChange={(e) => setSelectedSequence(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-600"
          >
            {sequences.map((sequence) => (
              <option key={sequence.id} value={sequence.id}>
                {sequence.sequence}
              </option>
            ))}
          </select>
        </div>

        <div className="border rounded-md p-4 shadow-md bg-white">
          <h2 className="text-lg font-bold mb-4 text-purple-700">
            Bulletin de la Séquence
          </h2>
          <div className="mb-4">
            <p><strong>Nom de l'élève :</strong> {bulletin[0]?.eleveBulletin.nom} {bulletin[0]?.eleveBulletin.prenom}</p>
            <p><strong>Classe :</strong> {bulletin[0]?.eleveBulletin.classeEleve.classe}</p>
            <p><strong>Année scolaire :</strong> {bulletin[0]?.anneeBulletin.annee}</p>
          </div>

          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Matière</th>
                <th className="border px-4 py-2">Enseignant</th>
                <th className="border px-4 py-2">Moyenne</th>
                <th className="border px-4 py-2">Coefficient</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {renderGroup('1er Groupe')}
              {renderGroup('2eme Groupe')}
              {renderGroup('3eme Groupe')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BulletinSequence;
