
-- =============================================
--  PROYECTO: Sistema de Reservas de Canchas de Fútbol 5
--  Base de Datos: db_soccerzone
-- =============================================

-- ELIMINAR BASE EXISTENTE (solo para desarrollo o pruebas)
DROP DATABASE IF EXISTS db_soccerzone;

CREATE DATABASE db_soccerzone;
USE db_soccerzone;

-- =============================================
-- TABLA: USUARIOS
-- =============================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: CANCHAS
-- =============================================
CREATE TABLE canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cancha VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa',
    precio_hora DECIMAL(10,2) NOT NULL
);

-- =============================================
-- TABLA: HORARIOS
-- =============================================
CREATE TABLE horarios (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo') NOT NULL
);

-- =============================================
-- TABLA: RESERVAS
-- =============================================
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cancha INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    metodo_pago ENUM('efectivo', 'tarjeta', 'sinpe', 'transferencia') DEFAULT 'efectivo',
    estado_pago ENUM('pendiente', 'pagado', 'reembolsado') DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================
-- TABLA: PAGOS
-- =============================================
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo ENUM('efectivo', 'tarjeta', 'sinpe', 'transferencia') NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('exitoso', 'pendiente', 'fallido') DEFAULT 'pendiente',
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================
-- TABLA: NOTIFICA
-- =============================================
CREATE TABLE notifica (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================
-- INSERCIÓN DE DATOS INICIALES
-- =============================================

-- USUARIOS (clientes y administrador)
INSERT INTO usuarios (nombre, correo, contrasena, telefono, rol) VALUES
('Administrador General', 'admin@example.com', 'admin123', '8888-0000', 'admin'),
('Juan Pérez', 'juanp@example.com', 'juan123', '8888-1111', 'cliente'),
('María López', 'marial@example.com', 'maria123', '8888-2222', 'cliente'),
('Carlos Mora', 'carlosm@example.com', 'carlos123', '8888-3333', 'cliente');

-- CANCHAS
INSERT INTO canchas (nombre_cancha, ubicacion, descripcion, precio_hora) VALUES
('Cancha Central', 'San José Centro', 'Cancha con césped sintético de última generación', 25000),
('Cancha Norte', 'Heredia', 'Pasto natural con iluminación nocturna', 20000),
('Cancha Sur', 'Cartago', 'Cancha techada ideal para torneos', 22000);

-- HORARIOS
INSERT INTO horarios (hora_inicio, hora_fin, dia_semana) VALUES
('07:00:00', '08:00:00', 'lunes'),
('08:00:00', '09:00:00', 'lunes'),
('09:00:00', '10:00:00', 'martes'),
('10:00:00', '11:00:00', 'miércoles'),
('11:00:00', '12:00:00', 'jueves');

-- RESERVAS
INSERT INTO reservas (id_usuario, id_cancha, fecha, hora_inicio, hora_fin, estado, metodo_pago, estado_pago)
VALUES
(2, 1, '2025-10-25', '07:00:00', '08:00:00', 'confirmada', 'sinpe', 'pagado'),
(3, 2, '2025-10-26', '08:00:00', '09:00:00', 'pendiente', 'tarjeta', 'pendiente'),
(4, 3, '2025-10-27', '09:00:00', '10:00:00', 'completada', 'efectivo', 'pagado');

-- PAGOS
INSERT INTO pagos (id_reserva, monto, metodo, estado)
VALUES
(1, 25000, 'sinpe', 'exitoso'),
(3, 22000, 'efectivo', 'exitoso');

-- NOTIFICACIONES
INSERT INTO notifica (id_usuario, mensaje)
VALUES
(2, 'Tu reserva del 25 de octubre ha sido confirmada.'),
(3, 'Recuerda completar el pago de tu reserva.'),
(4, '¡Gracias por usar SoccerZone!');


SELECT id_cancha, nombre_cancha FROM canchas;
