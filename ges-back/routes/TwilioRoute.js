const express = require('express')
const router = express.Router();
const twilioController = require('../controllers/TwilioController');

// ... autres imports ...

// Exemple d'utilisation pour envoyer un SMS lorsque l'élève est absent
router.post('/absence', async (req, res) => {
  // Logique pour marquer l'élève comme absent...
  const post=req.body;

  // Envoyer un SMS au parent
  const parentPhoneNumber = post.numeroTelephone;
  const message = post.message;

  try {
    await twilioController.sendSMS(parentPhoneNumber, message);
    res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, message: 'Failed to send SMS' });
  }
});


module.exports = router;