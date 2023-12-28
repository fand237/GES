const express = require('express');
const app = express();
const port = 3001; // Choisissez un port selon vos préférences

app.get('/', (req, res) => {
  res.send('Backend de votre application React');
});

app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
