const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Route pour télécharger les fichiers
router.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
        // Vérifier que le fichier appartient à une annonce autorisée
        // (Ajoutez votre logique de vérification ici si nécessaire)

        // Envoyer le fichier
        res.download(filePath, req.query.originalname || req.params.filename);
    } else {
        res.status(404).json({ error: 'Fichier non trouvé' });
    }
});

module.exports = router;