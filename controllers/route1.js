const routes1 = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/verifyToken");
const saltRounds = 10;

routes1.post("/", (req, res) => {
      const { email, password } = req.body;
      req.getConnection((err, conn) => {
            if (err) {
                  res.status(500).send("Error al obtener la conexión");
            } else {
                  conn.query(
                        "SELECT * FROM users WHERE email = ?",
                        [email],
                        async (err, rows) => {
                              if (err) {
                                    res.status(500).send(
                                          "Error al hacer la consulta"
                                    );
                              } else {
                                    if (rows.length === 0) {
                                          res.json({
                                                message: "EL USUARIO NO EXISTE",
                                          });
                                    } else {
                                          const match = await bcrypt.compare(
                                                password,
                                                rows[0].password
                                          );
                                          if (match) {
                                                const data = {
                                                      id: rows[0].id,
                                                      nombre: rows[0].nombre,
                                                      email: rows[0].email,
                                                };

                                                const token = jwt.sign(
                                                      data,
                                                      "secret",
                                                      { expiresIn: "1m" }
                                                );

                                                res.status(200).json({
                                                      message: "BIENVENIDO",
                                                      id: rows[0].id,
                                                      nombre: rows[0].nombre,
                                                      email: rows[0].email,
                                                      token,
                                                });
                                          } else {
                                                res.json({
                                                      message: "CONTRASEÑA INCORRECTA",
                                                });
                                          }
                                    }
                              }
                        }
                  );
            }
      });
});

routes1.post("/registro", verifyToken, async (req, res) => {
      const { nombre, email, password } = req.body;
      const hashPass = await bcrypt.hash(password, saltRounds);

      req.getConnection((error, conn) => {
            if (error) {
                  res.status(500).send("Error al obtener la conexión");
            } else {
                  // Aquí puedes utilizar la conexión para hacer consultas a la base de datos
                  conn.query(
                        "INSERT INTO  users  SET ?",
                        [{ nombre, email, password: hashPass }],
                        (err, rows) => {
                              if (err) {
                                    res.status(500).send(
                                          "Error al hacer la consulta"
                                    );
                              } else {
                                    res.json({
                                          message: "Usuario Registrado!",
                                    });
                              }
                        }
                  );
            }
      });
});

module.exports = routes1;
