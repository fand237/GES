const express = require('express')
const router = express.Router();
const {Presence, Eleve, Cours} = require("../models")
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');


// Route pour créer ou mettre à jour la présence
router.post('/updateOrCreate', async (req, res) => {
    try {
      console.log("les donnees du back sont",req.body);
      const { eleve, cours, jour, statut, retard, resumeCours, participation } = req.body;
  
      // Recherche d'une instance existante
      const existingInstance = await Presence.findOne({
        where: {
          eleve,
          cours,
          jour,
          
        },
      });
  
      if (existingInstance) {
        // Si l'instance existe, mettez à jour le statut
        existingInstance.statut = statut;
        existingInstance.retard = retard;
        existingInstance.resumeCours = resumeCours;
        existingInstance.participation = participation;

        await existingInstance.save();
      } else {
        // Sinon, créez une nouvelle instance
        await Presence.create({ eleve, cours, jour, statut, retard, resumeCours, participation});
      } 
  
      res.json({ message: 'Mise à jour ou création réussie' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour ou de la création de la présence : ', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  
  // Route pour récupérer les présences
  router.get('/rapport', async (req, res) => {
    try {
      const { eleveId, classeId, dateDebut, dateFin } = req.query;
  
      const whereClause = {};
      if (eleveId) whereClause.eleve = eleveId;
      if (classeId) whereClause['$coursPresence.classe$'] = classeId;
      if (dateDebut && dateFin) {
        whereClause.jour = { [Op.between]: [dateDebut, dateFin] };
      } else if (dateDebut) {
        whereClause.jour = { [Op.gte]: dateDebut };
      } else if (dateFin) {
        whereClause.jour = { [Op.lte]: dateFin };
      }
  
      const presences = await Presence.findAll({
        where: whereClause,
        include: [
          { model: Eleve, as: 'elevePresence' },
          { model: Cours, as: 'coursPresence' },
        ],
      });
  
      // Groupement des présences par élève et par cours
      const groupedPresences = presences.reduce((acc, presence) => {
        const eleveId = presence.elevePresence.id;
        const coursId = presence.coursPresence.id;
  
        if (!acc[eleveId]) {
          acc[eleveId] = {
            nom: presence.elevePresence.nom,
            prenom: presence.elevePresence.prenom,
            cours: {}
          };
        }
  
        if (!acc[eleveId].cours[coursId]) {
          acc[eleveId].cours[coursId] = {
            matiere: presence.coursPresence.matiere,
            dates: []
          };
        }
  
        acc[eleveId].cours[coursId].dates.push({
          jour: presence.jour,
          statut: presence.statut,
          retard: presence.retard,
          participation: presence.participation
        });
  
        return acc;
      }, {});
  
      res.json(groupedPresences);
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      res.status(500).send('Erreur du serveur');
    }
  });
  
  
// Route pour télécharger le rapport en PDF
router.get('/rapport/download', async (req, res) => {
  try {
    const { eleveId, classeId, dateDebut, dateFin, typeRapport } = req.query;

    const whereClause = {};
    if (eleveId) whereClause.eleve = eleveId;
    if (classeId) whereClause['$coursPresence.classe$'] = classeId;
    if (dateDebut && dateFin) {
      whereClause.jour = { [Op.between]: [dateDebut, dateFin] };
    } else if (dateDebut) {
      whereClause.jour = { [Op.gte]: dateDebut };
    } else if (dateFin) {
      whereClause.jour = { [Op.lte]: dateFin };
    }

    const presences = await Presence.findAll({
      where: whereClause,
      include: [
        { model: Eleve, as: 'elevePresence' },
        { model: Cours, as: 'coursPresence' },
      ],
    });

    // Groupement des présences par élève et par cours
    const groupedPresences = presences.reduce((acc, presence) => {
      const eleveId = presence.elevePresence.id;
      const coursId = presence.coursPresence.id;

      if (!acc[eleveId]) {
        acc[eleveId] = {
          nom: presence.elevePresence.nom,
          prenom: presence.elevePresence.prenom,
          cours: {}
        };
      }

      if (!acc[eleveId].cours[coursId]) {
        acc[eleveId].cours[coursId] = {
          matiere: presence.coursPresence.matiere,
          dates: []
        };
      }

      acc[eleveId].cours[coursId].dates.push({
        jour: presence.jour,
        statut: presence.statut,
        retard: presence.retard || 0,  // Valeur par défaut si null
        participation: presence.participation || 'N/A'  // Valeur par défaut si null
      });

      return acc;
    }, {});

    // Création du PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment;filename=rapport_presence_${typeRapport}.pdf`,
        })
        .end(pdfData);
    });

    doc.fontSize(16).text(`Rapport des Présences - ${typeRapport.toUpperCase()}`, { align: 'center' });
    doc.moveDown();

    // Parcourir les présences groupées
    Object.values(groupedPresences).forEach((eleve) => {
      doc.fontSize(14).text(`Élève: ${eleve.nom} ${eleve.prenom}`);
      Object.values(eleve.cours).forEach((cours) => {
        doc.fontSize(12).text(`Cours: ${cours.matiere}`);
        
        const tableTop = doc.y;
        const itemHeight = 20;
        
        doc.fontSize(10).text("Date", 50, tableTop);
        doc.text("Statut", 150, tableTop);
        doc.text("Retard (minutes)", 250, tableTop);
        doc.text("Participation", 350, tableTop);
        
        cours.dates.forEach((date, index) => {
          const position = tableTop + (index + 1) * itemHeight;
          
          // Si la position est proche du bas de la page, créer une nouvelle page
          if (position > doc.page.height - 50) {
            doc.addPage();
            tableTop = doc.y;
            doc.text("Date", 50, tableTop);
            doc.text("Statut", 150, tableTop);
            doc.text("Retard (minutes)", 250, tableTop);
            doc.text("Participation", 350, tableTop);
          }

          doc.text(date.jour, 50, position);
          doc.text(date.statut, 150, position);
          doc.text(date.retard.toString(), 250, position);
          doc.text(date.participation, 350, position);
        });

        doc.moveDown(2);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Erreur lors du téléchargement du rapport:', error);
    res.status(500).send('Erreur du serveur');
  }
});


  module.exports = router;