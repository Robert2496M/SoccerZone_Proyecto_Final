// db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",       // tu usuario MySQL
  password: "INGRESAR_SU_MYSQL_PASSWORD", // tu contraseña MySQL
  database: "db_soccerzone",
});

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar con MySQL:", err);
    return;
  }
  console.log("Conexión a MySQL establecida correctamente");
});

module.exports = connection;
