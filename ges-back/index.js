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

//Routes Jour
const JourRouter = require("./routes/JourRoute");
app.use("/Jour",JourRouter);

//Routes Classe
const ClasseRoute = require("./routes/ClasseRoute");
app.use("/Classe",ClasseRoute);

//Routes Emplois_temps
const Emplois_tempsRoute = require("./routes/Emplois_tempsRoute");
app.use("/Emplois_temps",Emplois_tempsRoute);

//Routes Jour_Cours
const Jour_CoursRoute = require("./routes/Jour_CoursRoute");
app.use("/Jour_Cours",Jour_CoursRoute);

//Routes Eleve
const EleveRoute = require("./routes/EleveRoute");
app.use("/Eleve",EleveRoute);

//Routes Parent
const ParentRoute = require("./routes/ParentRoute");
app.use("/Parent",ParentRoute);

//Routes Presence
const PresenceRoute = require("./routes/PresenceRoute");
app.use("/Presence",PresenceRoute);

//Routes Notification
const TwilioRoute = require("./routes/TwilioRoute");
app.use("/Notification",TwilioRoute);


app.get('/', (req, res) => {
  res.send('Backend de votre application React');
});




