const API_URL = "http://127.0.0.1:8000";

// 🔹 Obtener tareas
async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    data.forEach(task => {
        const li = document.createElement("li");

        // texto de la tarea
        const text = document.createElement("span");
        text.textContent = task.title;

        // botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = () => deleteTask(task.id);

        // botón editar
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.style.marginLeft = "10px";
        editBtn.onclick = () => updateTask(task.id);

        li.appendChild(text);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);

        list.appendChild(li);
    });
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

// 🔹 Eliminar tarea
async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    getTasks();
}

// 🔹 Actualizar tarea
async function updateTask(id) {
    const newTitle = prompt("Nuevo nombre de la tarea:");

    if (!newTitle) return;

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle })
    });

    getTasks();
}

// cargar tareas al iniciar
getTasks();