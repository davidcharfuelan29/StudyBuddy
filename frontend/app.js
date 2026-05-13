const API_URL = "http://127.0.0.1:8000";

// 🔐 Control de sesión (UNA sola vez)
const user = localStorage.getItem("user");

if (!user) {
    window.location.href = "login.html";
}

// 🔓 Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// 🔹 Crear tarea
async function createTask() {
    const titleInput = document.getElementById("title");
    const title = titleInput.value;

    if (!title) {
        alert("Escribe una tarea");
        return;
    }

    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    titleInput.value = "";
    getTasks();
}

// 🔹 Obtener tareas
async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    data.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;
        list.appendChild(li);
    });
}

// 🚀 iniciar
getTasks();
