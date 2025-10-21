-- =============================================
--  PROYECTO: Sistema de Reservas de Canchas de Fútbol 5
--  Base de Datos: db_db_soccerzone
-- =============================================

-- CREAR LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS db_soccerzone;
USE db_soccerzone;

-- =============================================
-- TABLA: CLIENTES
-- =============================================
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: CANCHAS
-- =============================================
CREATE TABLE canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_pasto ENUM('sintético', 'natural') NOT NULL,
    ubicacion VARCHAR(150),
    precio_hora DECIMAL(10,2) NOT NULL,
    estado ENUM('disponible', 'mantenimiento') DEFAULT 'disponible'
);

-- =============================================
-- TABLA: HORARIOS
-- =============================================
CREATE TABLE horarios (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL
);

-- =============================================
-- TABLA: RESERVAS
-- =============================================
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_cancha INT NOT NULL,
    id_horario INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha),
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario)
);

-- =============================================
-- TABLA: PAGOS
-- =============================================
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'sinpe', 'transferencia') NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
);

-- =============================================
-- TABLA OPCIONAL: EMPLEADOS (para administrar el sistema)
-- =============================================
CREATE TABLE empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol ENUM('administrador', 'asistente') DEFAULT 'asistente',
    password VARCHAR(255) NOT NULL
);

-- =============================================
-- INSERCIÓN DE DATOS INICIALES
-- =============================================

-- Clientes
INSERT INTO clientes (nombre, correo, telefono) VALUES
('Juan Pérez', 'juanp@example.com', '8888-1111'),
('María López', 'marial@example.com', '8888-2222'),
('Carlos Mora', 'carlosm@example.com', '8888-3333');

-- Canchas
INSERT INTO canchas (nombre, tipo_pasto, ubicacion, precio_hora) VALUES
('Cancha Central', 'sintético', 'San José Centro', 25000),
('Cancha Norte', 'natural', 'Heredia', 20000),
('Cancha Sur', 'sintético', 'Cartago', 22000);

-- Horarios
INSERT INTO horarios (hora_inicio, hora_fin) VALUES
('07:00:00', '08:00:00'),
('08:00:00', '09:00:00'),
('09:00:00', '10:00:00'),
('10:00:00', '11:00:00'),
('11:00:00', '12:00:00');

-- Reservas (ejemplo)
INSERT INTO reservas (id_cliente, id_cancha, id_horario, fecha_reserva, estado)
VALUES
(1, 1, 1, '2025-10-25', 'confirmada'),
(2, 2, 2, '2025-10-25', 'pendiente'),
(3, 3, 3, '2025-10-26', 'completada');

-- Pagos (ejemplo)
INSERT INTO pagos (id_reserva, monto, metodo_pago)
VALUES
(1, 25000, 'sinpe'),
(3, 22000, 'tarjeta');

-- Empleados
INSERT INTO empleados (nombre, correo, rol, password) VALUES
('Administrador General', 'admin@example.com', 'administrador', 'admin123'),
('Luis Jiménez', 'luisj@example.com', 'asistente', 'asistente123');


