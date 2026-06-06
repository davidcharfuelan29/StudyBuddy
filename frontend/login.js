const API_URL = ""; 
let isLogin = true;

function togglePassword() {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
}

document.getElementById("switchMode").onclick = () => {
    isLogin = !isLogin;

    document.getElementById("title").textContent =
        isLogin ? "¡Bienvenido de vuelta! 👋" : "Crea tu cuenta 🚀";
    document.getElementById("submitBtn").textContent =
        isLogin ? "Iniciar sesión" : "Registrarse";
    document.getElementById("switchMode").textContent =
        isLogin ? "Regístrate" : "Inicia sesión";
    document.getElementById("switchLoginText").style.display =
        isLogin ? "inline" : "none";
    document.getElementById("switchRegisterText").style.display =
        isLogin ? "none" : "inline";
    document.getElementById("message").textContent = "";
};

function getErrorDetail(data) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
        return data.detail.map(e => e.msg).join(". ");
    }
    return "Error desconocido";
}

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageEl = document.getElementById("message");
    messageEl.textContent = "";
    messageEl.style.color = "#f87171";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Cargando...";

    const endpoint = isLogin ? "/login" : "/register";

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            messageEl.textContent = getErrorDetail(data);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        if (isLogin) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            messageEl.style.color = "#34d399";
            messageEl.textContent = "Cuenta creada ✔ ahora inicia sesión";
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isLogin = true;
            document.getElementById("title").textContent = "¡Bienvenido de vuelta! 👋";
            document.getElementById("submitBtn").textContent = "Iniciar sesión";
            document.getElementById("switchMode").textContent = "Regístrate";
            document.getElementById("switchLoginText").style.display = "inline";
            document.getElementById("switchRegisterText").style.display = "none";
        }
    } catch (error) {
        messageEl.textContent = "Error de conexión. Verifica que el servidor esté corriendo.";
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});