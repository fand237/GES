const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001; // Choisissez un port selon vos préférences

const db=require("./models");
db.sequelize.sync().then(()=>{
  app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
  });
});

// Utilisez le middleware cors
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend de votre application React');
});

sequelize.sync({ force: true }); // Cela synchronisera les modèles avec la base de données


