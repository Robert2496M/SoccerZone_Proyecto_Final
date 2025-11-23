// db.js
//const mysql = require("mysql2");

//const connection = mysql.createConnection({
  //host: "localhost",
 // user: "root",       // tu usuario MySQL
 // password: "admin", // tu contraseña MySQL
  //database: "db_soccerzone",
//});

//connection.connect((err) => {
  //if (err) {
    //console.error("Error al conectar con MySQL:", err);
    //return;
  //}
  //console.log("Conexión a MySQL establecida correctamente");
//});

//module.exports = connection;

// db.js
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "db_soccerzone",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;


