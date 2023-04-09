const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
      const token = req.headers.authorization;

      if (!token) {
            return res.json({
                  message: "No se ha proporcionado un token de autenticación",
            });
      }

      try {
            const decoded = jwt.verify(token, "secret"); // "secreto" es la clave secreta utilizada para firmar el token
            req.usuario = decoded;
            next();
      } catch (error) {
            return res.json({ message: "Token inválido" });
      }
};

module.exports = verifyToken;
