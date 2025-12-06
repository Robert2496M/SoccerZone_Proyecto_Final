<?php
include('configuracion/db.php');  // <<--- OJO AQUÍ

echo "<h2>Prueba de conexión a MySQL</h2>";

if ($conn) {
    echo "<p style='color:green;'>✔️ Conexión exitosa con db.php</p>";
} else {
    echo "<p style='color:red;'>❌ Error de conexión</p>";
}
?>
