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
//                   Reservar cancha
// =======================================================

app.post("/api/reservas", (req, res) => {
  const {
    id_usuario,
    id_cancha,
    fecha,
    hora_inicio,
    metodo_pago,
  } = req.body;

  // Validamos los datos del formulario
  if (!id_usuario || !id_cancha || !fecha || !hora_inicio || !metodo_pago) {
    return res
      .status(400)
      .json({ success: false, message: "Formulario incompleto, por favor rellene todos los espacios" });
  }

  // Calculamos la hora fin (1 hora después)

  let [h, m] = hora_inicio.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m || 0);
  date.setHours(date.getHours() + 1);
  const hora_fin = date.toTimeString().slice(0, 5);

  // Consultamos si ya hay reserva para la misma cancha, fecha y hora

  const sqlCheck = `
    SELECT COUNT(*) AS total
    FROM reservas
    WHERE id_cancha = ? AND fecha = ? AND hora_inicio = ?
  `;

  db.query(sqlCheck, [id_cancha, fecha, hora_inicio], (err, rows) => {
    if (err) {
      console.error("No se pudo verificar la reserva:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al verificar reserva" });
    }

    const total = rows[0].total;

    if (total > 0) {
      return res.status(409).json({
        success: false,
        message: "Lo sentimos, la cancha no está disponible para su reserva.",
      });
    }

    // Insertamos la nueva reserva (solo si está libre)

    const sqlInsert = `
      INSERT INTO reservas
      (id_usuario, id_cancha, fecha, hora_inicio, hora_fin, estado, metodo_pago, estado_pago)
      VALUES (?, ?, ?, ?, ?, 'pendiente', ?, 'pendiente')
    `;

    const params = [
      id_usuario,
      id_cancha,
      fecha,
      hora_inicio,
      hora_fin,
      metodo_pago,
    ];

    db.query(sqlInsert, params, (err2, result) => {
      if (err2) {
        console.error("Error al insertar la reserva:", err2);
        return res
          .status(500)
          .json({ success: false, message: "Error al guardar la reserva" });
      }

      return res.status(201).json({
        success: true,
        message: "Gracias por su reserva. Recuerda pagar antes del inicio del partido.",
        id_reserva: result.insertId,
      });
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
