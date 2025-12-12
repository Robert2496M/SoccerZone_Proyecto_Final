document.addEventListener("DOMContentLoaded", () => {

  // =========================
  //      FUNCION MENSAJES
  // =========================
  function showMessage(element, message, type = "success") {
    element.textContent = message;
    element.className = `alert alert-${type}`; // alert-success / alert-danger
    element.classList.remove("d-none");

    setTimeout(() => {
      element.classList.add("d-none");
    }, 2500);
  }


  // ========================
  //       LOGIN
  // ========================
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const correo = document.getElementById("loginEmail").value;
      const contrasena = document.getElementById("loginPassword").value;

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
          showMessage(loginMsg, `Bienvenido ${data.nombre}`, "success");

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1200);

        } else {
          showMessage(loginMsg, data.message || "Error en el login", "danger");
        }

      } catch (err) {
        console.error("Error en login:", err);
        showMessage(loginMsg, "No se pudo conectar al servidor", "danger");
      }
    });
  }


  // ========================
  //       REGISTRO
  // ========================
  const registerForm = document.getElementById("register-form");
  const registerMsg = document.getElementById("registerMessage");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("regNombre").value;
      const correo = document.getElementById("regCorreo").value;
      const telefono = document.getElementById("regTelefono").value;
      const contrasena = document.getElementById("regContrasena").value;
      const rol = document.getElementById("regRol").value;

      try {
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, telefono, contrasena, rol })
        });

        const data = await res.json();

        if (res.ok) {
          showMessage(registerMsg, data.message || "Usuario registrado correctamente", "success");

          registerForm.reset();

          setTimeout(() => {
            document.getElementById("login-tab").click();
          }, 1500);

        } else {
          showMessage(registerMsg, data.message || "Error en el registro", "danger");
        }

      } catch (err) {
        console.error("Error en registro:", err);
        showMessage(registerMsg, "No se pudo conectar al servidor", "danger");
      }
    });
  }

});
