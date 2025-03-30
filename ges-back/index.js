const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const http = require('http'); // Ajouté pour Socket.io
const setupSocket = require('./middlewares/socketMiddleware');

const app = express();
const port = 3001;

// Création du serveur HTTP à partir d'Express
const server = http.createServer(app);

// Configuration Socket.io via le middleware
const io = setupSocket(server);

// Initialisation de la base de données
const db = require("./models");
db.sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
  });
});

// Middlewares
app.use(express.json());
app.use(cors());

// Routes existantes
const routes = [
  { path: "/Administrateur", router: require("./routes/AdministrateurRoute") },
  { path: "/Cours", router: require("./routes/CoursRoute") },
  { path: "/Enseignants", router: require("./routes/EnseignantsRoute") },
  { path: "/Jour", router: require("./routes/JourRoute") },
  { path: "/Classe", router: require("./routes/ClasseRoute") },
  { path: "/Emplois_temps", router: require("./routes/Emplois_tempsRoute") },
  { path: "/Jour_Cours", router: require("./routes/Jour_CoursRoute") },
  { path: "/Eleve", router: require("./routes/EleveRoute") },
  { path: "/Parent", router: require("./routes/ParentRoute") },
  { path: "/Presence", router: require("./routes/PresenceRoute") },
  { path: "/Notification", router: require("./routes/TwilioRoute") },
  { path: "/Sequence", router: require("./routes/SequenceRoute") },
  { path: "/Type_Evaluation", router: require("./routes/Type_EvaluationRoute") },
  { path: "/Note", router: require("./routes/NoteRoute") },
  { path: "/Groupe", router: require("./routes/GroupeRoute") },
  { path: "/Matiere", router: require("./routes/MatiereRoute") },
  { path: "/Annee_Academique", router: require("./routes/Annee_AcademiqueRoute") },
  { path: "/Bulletin", router: require("./routes/BulletinRoute") },
  { path: "/Moyenne", router: require("./routes/MoyenneRoute") },
  { path: "/Cycle", router: require("./routes/CycleRoute") },
  { path: "/PlanningExamen", router: require("./routes/PlanningExamenRoute") },
  { path: "/Niveau", router: require("./routes/NiveauRoute") },
  { path: "/Conversation", router: require("./routes/ConversationRoute")(io) } // On passe io à la route Conversation
];

// Chargement des routes
routes.forEach(route => {
  app.use(route.path, route.router);
});

// Route de base
app.get('/', (req, res) => {
  res.send('Backend de votre application React');
});

// Export pour les tests si nécessaire
module.exports = { app, server, io };