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

app.use(express.json());

// Utilisez le middleware cors
app.use(cors());

//Routes Administrateur
const AdministrateurRouter = require("./routes/AdministrateurRoute");
app.use("/Administrateur",AdministrateurRouter);

//Routes Cours
const CoursRouter = require("./routes/CoursRoute");
app.use("/Cours",CoursRouter);

//Routes Enseignants
const EnseignantsRouter = require("./routes/EnseignantsRoute");
app.use("/Enseignants",EnseignantsRouter);

app.get('/', (req, res) => {
  res.send('Backend de votre application React');
});




