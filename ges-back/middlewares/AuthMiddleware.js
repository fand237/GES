const { verify } = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (!accessToken) {
        console.log("accessToken non existant")

        return res.json({ error: "user non connecte" });

    } else {
        //console.log("accessToken existant")
    }

        try {

            const validToken = verify(accessToken, "importantsecret");
            req.utilisateur = validToken;

            if (validToken) {
               // console.log("Token valide")

                return next();
            }
        } catch (err) {
            return res.json({ error: err })
        }
    
};

module.exports = { validateToken }