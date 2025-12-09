// Importa Express para crear el servidor
const express = require("express");

// Importa mysql2 con soporte para promesas
const mysql = require("mysql2/promise");

// Permite solicitudes desde otros dominios (ej: frontend)
const cors = require("cors");

// Módulo para manejar rutas de archivos
const path = require("path");

const app = express(); // Inicializa la app de Express

// Middleware para permitir peticiones externas (CORS)
app.use(cors());

// Middleware para leer JSON enviado por el cliente
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));


// =======================================================
//              CONFIGURACIÓN CONEXIÓN A MySQL
// =======================================================

// Se crea un pool de conexiones para manejar múltiples peticiones
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "db_soccerzone"
});

// =======================================================                  
//                     login
// =======================================================


app.post("/api/login", (req, res) => {
  const { correo, contrasena } = req.body; // Datos enviados por el frontend

  // Consulta SQL para validar usuario
  const query = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";

  // Ejecuta consulta SQL
  db.query(query, [correo, contrasena], (err, results) => {
    if (err) {
      console.error("Error al iniciar sesión:", err);
      return res.status(500).json({ message: "Error interno" });
    }

    // Si no encuentra usuario
    if (results.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = results[0];

    // Respuesta enviada al frontend
    res.json({
      message: "Inicio de sesión exitoso",
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
      nombre: usuario.nombre
    });
  });
});


// =======================================================
//                INICIAR SERVIDOR
// =======================================================

const PORT = 3000;

// Inicia el servidor en http://localhost:3000
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
