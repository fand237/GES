const accountSid = 'AC5c7dcaf102a459e2d4c572c56d87f570';
const authToken = '2542d6e3f492b2313a61dd141bf9bbf9';
const client = require('twilio')(accountSid, authToken);


    module.exports = {
        sendSMS: async (to, message) => {
          try {
            const result = await client.messages.create({
              body: message,
              from: 'whatsapp:+14155238886', // Remplacez par votre numéro Twilio
              to: 'whatsapp:'.concat(to),
            });
      
            console.log('Message sent successfully:', result.sid);
            return result;
          } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
          }
        },
      };