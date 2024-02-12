const { verify } = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) {
        return res.json({ error: "user non connecte" });
    }

    try {

        const validToken = verify(accessToken, "importantsecret");
        req.utilisateur = validToken;

        if (validToken) {
            return next();
        }
    } catch (error) {
        return res.json({ error: err })
    }
};

module.exports = { validateToken }