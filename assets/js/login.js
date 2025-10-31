document.addEventListener("DOMContentLoaded", () => {
  // FORMULARIO LOGIN
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const correo = document.getElementById("loginEmail").value;
      const contrasena = document.getElementById("loginPassword").value;

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contrasena }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(`Bienvenido ${data.nombre}!`);
          // Redirigir según rol o al index
          window.location.href = "index.html";
        } else {
          alert(data.message || "Error en el login");
        }
      } catch (err) {
        console.error("Error en login:", err);
        alert("No se pudo conectar al servidor");
      }
    });
  }

  // FORMULARIO REGISTRO
  const registerForm = document.getElementById("register-form");
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
          body: JSON.stringify({ nombre, correo, telefono, contrasena, rol }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Usuario registrado correctamente");
          // Limpiar formulario o ir al login
          registerForm.reset();
          // Cambiar a tab login automáticamente
          const loginTab = document.getElementById("login-tab");
          loginTab.click();
        } else {
          alert(data.message || "Error en el registro");
        }
      } catch (err) {
        console.error("Error en registro:", err);
        alert("No se pudo conectar al servidor");
      }
    });
  }
});
