<?php
header("Content-Type: application/json");

// 1️⃣ Conexión a MySQL
$servername = "localhost";
$username   = "root";
$password   = "";
$database   = "soccerzone";  // <-- cámbialo si tu BD se llama distinto

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Error en conexión: " . $conn->connect_error]));
}

// 2️⃣ Recibir datos del formulario
$nombre      = $_POST["name"] ?? null;
$telefono    = $_POST["phone"] ?? null;
$fecha       = $_POST["date"] ?? null;
$hora        = $_POST["time"] ?? null;
$cancha      = $_POST["cancha"] ?? null;
$mensaje     = $_POST["message"] ?? "";
$metodo_pago = $_POST["metodo_pago"] ?? null;

// 3️⃣ Validación
if (!$nombre || !$telefono || !$fecha || !$hora || !$cancha || !$metodo_pago) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

// 4️⃣ Insertar en BD
$sql = "INSERT INTO reservas (nombre, telefono, fecha, hora, cancha, comentario, metodo_pago)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $nombre, $telefono, $fecha, $hora, $cancha, $mensaje, $metodo_pago);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Reserva registrada correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
