import React, { useState } from 'react';

const AdminForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [result, setResult] = useState('');

  const ajouterAdministrateur = () => {
    const data = {
      nomUtilisateur: username,
      motDePasse: password,
      email: email,
      nom: nom,
      prenom: prenom
    };
  
    fetch('http://localhost:3001/Administrateur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        // Afficher la réponse complète
        console.log('Réponse complète du serveur :', response);
        return response.json();
      })
      .then(result => {
        setResult(JSON.stringify(result));
      })
      .catch(error => console.error('Erreur :', error));
  };
  

  return (
    <div>
      <h2>Ajouter un administrateur</h2>
      <label>Nom d'utilisateur:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />

      <label>Mot de passe:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />

      <label>Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

      <label>Nom:</label>
      <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required /><br />

      <label>Prénom:</label>
      <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required /><br />

      <button onClick={ajouterAdministrateur}>Ajouter Administrateur</button>

      <h2>Résultat</h2>
      <div>{result}</div>
    </div>
  );
};

export default AdminForm;
