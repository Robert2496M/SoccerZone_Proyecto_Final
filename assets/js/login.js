// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el JS
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  //   FORMULARIO LOGIN
  // =========================

  // Obtiene el formulario de login y el contenedor del mensaje
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("loginMessage");

  // Verifica que el formulario exista en la página
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el envío tradicional del formulario

      // Obtiene los valores ingresados en los inputs
      const correo = document.getElementById("loginEmail").value;
      const contrasena = document.getElementById("loginPassword").value;

      // Resetea el mensaje antes de mostrar uno nuevo
      loginMsg.style.display = "none";
      loginMsg.classList.remove("success", "error");
      loginMsg.textContent = "";

      try {
        // Envía la petición al backend con los datos del usuario
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena })
        });

        // Convierte la respuesta del servidor a JSON
        const data = await response.json();

        // Si el backend responde con error (status != 200)
        if (!response.ok) {
          loginMsg.textContent = data.message || "Error en el login";
          loginMsg.classList.add("error");
          loginMsg.style.display = "block";
          return;
        }

        // Si el login fue exitoso
        loginMsg.textContent = "Bienvenido a SoccerZone, " + data.nombre + "!";
        loginMsg.classList.add("success");
        loginMsg.style.display = "block";

        // Guarda la sesión del usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify({
          nombre: data.nombre,
          rol: data.rol,
          id_usuario: data.id_usuario
        }));

        // Redirecciona al index después de 1 segundo
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);

      } catch (error) {
        // Si no se puede conectar al servidor
        console.error("Error:", error);
        loginMsg.textContent = "No se pudo conectar con el servidor.";
        loginMsg.classList.add("error");
        loginMsg.style.display = "block";
      }
    });
  }



  // =========================
  //   FORMULARIO REGISTRO
  // =========================

  const registerForm = document.getElementById("register-form");
  const registerMsg = document.getElementById("registerMessage");

  // Verifica que el formulario exista en la página
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el envío normal del form

      // Obtiene los valores del formulario
      const nombre = document.getElementById("regNombre").value;
      const correo = document.getElementById("regCorreo").value;
      const telefono = document.getElementById("regTelefono").value;
      const contrasena = document.getElementById("regContrasena").value;
      const rol = document.getElementById("regRol").value;

      // Limpia el mensaje previo
      registerMsg.style.display = "none";
      registerMsg.classList.remove("success", "error");
      registerMsg.textContent = "";

      try {
        // Enviar datos al backend para registrar usuario
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, telefono, contrasena, rol }),
        });

        const data = await res.json();

        // Si el registro fue exitoso
        if (res.ok) {
          registerMsg.textContent = data.message || "Usuario registrado correctamente";
          registerMsg.classList.add("success");
          registerMsg.style.display = "block";

          // Limpia el formulario
          registerForm.reset();

          // Cambia automáticamente a la pestaña de Login
          setTimeout(() => {
            document.getElementById("login-tab").click();
          }, 1200);

        } else {
          // Si hubo error en el registro
          registerMsg.textContent = data.message || "Error en el registro";
          registerMsg.classList.add("error");
          registerMsg.style.display = "block";
        }

      } catch (err) {
        // Error de conexión con el servidor
        console.error("Error en registro:", err);
        registerMsg.textContent = "No se pudo conectar al servidor";
        registerMsg.classList.add("error");
        registerMsg.style.display = "block";
      }
    });
  }

});
