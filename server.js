// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // usamos CommonJS aquí

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ---------------------------------------------
// REGISTRO DE USUARIO
// ---------------------------------------------
app.post("/api/register", (req, res) => {
  const { nombre, correo, telefono, contrasena, rol } = req.body;

  const query = `
    INSERT INTO usuarios (nombre, correo, telefono, contrasena, rol)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nombre, correo, telefono, contrasena, rol], (err, result) => {
    if (err) {
      console.error("Error al registrar usuario:", err);
      return res.status(500).json({ message: "Error en el registro" });
    }
    res.json({ message: "Usuario registrado correctamente" });
  });
});

// ---------------------------------------------
// LOGIN DE USUARIO
// ---------------------------------------------
app.post("/api/login", (req, res) => {
  const { correo, contrasena } = req.body;

  const query = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";

  db.query(query, [correo, contrasena], (err, results) => {
    if (err) {
      console.error("Error al iniciar sesión:", err);
      return res.status(500).json({ message: "Error interno" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = results[0];
    res.json({
      message: "Inicio de sesión exitoso",
      rol: usuario.rol,
      nombre: usuario.nombre,
    });
  });
});

// Consulta disponibilidad en tiempo real
app.get("/api/disponibilidad", (req, res) => {
    const { fecha } = req.query;

    // Si no envían fecha, usar la de hoy
    const fechaConsulta = fecha || new Date().toISOString().split("T")[0];

    const sql = `
        SELECT 
            c.id_cancha,
            c.nombre_cancha,
            c.ubicacion,
            c.precio_hora,
            (
                SELECT COUNT(*) 
                FROM reservas r 
                WHERE r.id_cancha = c.id_cancha
                AND r.fecha = ?
            ) AS reservas_del_dia
        FROM canchas c
        WHERE c.estado = 'activa'
    `;

    db.query(sql, [fechaConsulta], (err, resultados) => {
        if (err) return res.status(500).json({ error: err });
        
        const respuesta = resultados.map(r => ({
            id_cancha: r.id_cancha,
            nombre: r.nombre_cancha,
            ubicacion: r.ubicacion,
            precio_hora: r.precio_hora,
            disponible: r.reservas_del_dia == 0
        }));

        res.json(respuesta);
    });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static(__dirname)); // sirve HTML, CSS y JS