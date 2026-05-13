const API_URL = "http://127.0.0.1:8000";

let isLogin = true;

// 👁️ mostrar contraseña
function togglePassword() {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
}

// 🔁 cambiar modo
document.getElementById("switchMode").onclick = () => {
    isLogin = !isLogin;

    document.getElementById("title").textContent =
        isLogin ? "¡Bienvenido de vuelta! 👋" : "Crea tu cuenta 🚀";

    document.getElementById("submitBtn").textContent =
        isLogin ? "Iniciar sesión" : "Registrarse";
};

// 🚀 submit
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const endpoint = isLogin ? "/login" : "/register";

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        document.getElementById("message").textContent = data.detail;
        return;
    }

    if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
    } else {
        document.getElementById("message").style.color = "#34d399";
        document.getElementById("message").textContent =
            "Cuenta creada ✔ ahora inicia sesión";
    }
});