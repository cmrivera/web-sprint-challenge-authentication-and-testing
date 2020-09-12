/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");

const secrets = require("../api/secrets.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  const secret = secrets.jwtSecret;

  if (token) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "invalid creditials" });
      } else {
        req.decodedToken - decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: "invalid credentials" });
  }
};
