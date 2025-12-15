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
app.use(express.static(__dirname)); // sirve HTML, CSS y JS

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


// =======================================================                  
//                   Reservar cancha
// =======================================================

app.post("/api/reservas", (req, res) => {
  console.log("RESERVA RECIBIDA:", req.body);
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

// ---------------------------------------------
// MOSTRAR DISPONIBILIDAD DE CANCHAS
// ---------------------------------------------

app.get("/api/disponibilidad", (req, res) => {
  const { fecha, hora } = req.query;

  const sql = `
    SELECT id_cancha, id_usuario, hora_inicio, hora_fin
    FROM reservas
    WHERE fecha = ?
    AND hora_inicio = ?
  `;

  const horaFormateada = hora.length === 5 ? `${hora}:00` : hora;

  db.query(sql, [fecha, horaFormateada], (err, reservas) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error consultando disponibilidad" });
    }

    const canchas = [
      { id: 1, nombre: "Cancha Central" },
      { id: 2, nombre: "Cancha Norte" },
      { id: 3, nombre: "Cancha Sur" }
    ];

    const resultado = canchas.map(c => {
      const ocupada = reservas.find(r => r.id_cancha === c.id);

      return {
        cancha: c.nombre,
        disponible: !ocupada,
        ...(ocupada && {
          usuario: `Usuario #${ocupada.id_usuario}`,
          hora_inicio: ocupada.hora_inicio,
          hora_fin: ocupada.hora_fin
        })
      };
    });

    res.json(resultado);
  });
});

// ---------------------------------------------
// BUSCAR RESERVAS POR NOMBRE O TELÉFONO
// ---------------------------------------------
app.get("/api/buscar-reservas", (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Parámetro de búsqueda requerido" });
  }

  const sql = `
    SELECT
      r.id_reserva,
      u.nombre,
      u.telefono,
      r.fecha,
      r.hora_inicio,
      r.hora_fin,
      r.estado,
      r.metodo_pago,
      c.nombre AS cancha
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN canchas c ON r.id_cancha = c.id_cancha
    WHERE u.nombre LIKE ?
       OR u.telefono LIKE ?
    ORDER BY r.fecha DESC, r.hora_inicio DESC
  `;

  const search = `%${q}%`;

  db.query(sql, [search, search], (err, results) => {
    if (err) {
      console.error("Error buscando reservas:", err);
      return res.status(500).json({ message: "Error buscando reservas" });
    }

    res.json(results);
  });
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



