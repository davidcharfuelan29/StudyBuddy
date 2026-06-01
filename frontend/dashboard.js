const API_URL = "http://127.0.0.1:8000";

function getAuthHeaders(){
    const token = localStorage.getItem("token");
    const headers = {"Content-Type": "application/json"};
    if(token){
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

if(!localStorage.getItem("token")){
    window.location.href = "login.html";
}

/* =========================
   TOAST SYSTEM
========================= */

function showToast(message, type = 'info', icon){

    const container =
        document.getElementById('toastContainer');

    if(!container) return;

    const icons = {
        success: 'ri-checkbox-circle-fill',
        info: 'ri-information-fill',
        warning: 'ri-alert-fill',
        error: 'ri-close-circle-fill',
    };

    const toast =
        document.createElement('div');

    toast.className =
        `toast ${type}`;

    toast.innerHTML = `
        <i class="${icon || icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        if(toast.parentNode){

            toast.remove();

        }

    }, 4000);

}

function showUndoToast(message, onUndo){

    const container =
        document.getElementById('toastContainer');

    if(!container) return;

    const toast =
        document.createElement('div');

    toast.className = 'toast warning has-undo';

    toast.innerHTML = `
        <i class="ri-delete-bin-line"></i>
        <span>${message}</span>
        <button class="toast-undo">Deshacer</button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-undo')
        .addEventListener('click', () => {

            if(onUndo) onUndo();
            toast.remove();

        });

    setTimeout(() => {

        if(toast.parentNode) toast.remove();

    }, 5000);

}

/* =========================
   PARTICLES SYSTEM
========================= */

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

/* CREATE PARTICLES */

for(let i = 0; i < 80; i++){

    particlesArray.push({

        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        radius: Math.random() * 2.2,

        speedY: Math.random() * 0.5 + 0.2,

        opacity: Math.random()

    });

}

/* ANIMATE PARTICLES */

function animateParticles(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particlesArray.forEach(particle => {

        particle.y -= particle.speedY;

        if(particle.y < 0){

            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;

        }

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(124,92,255,${particle.opacity})`;

        ctx.fill();

    });

    requestAnimationFrame(animateParticles);

}

animateParticles();

/* RESPONSIVE */

window.addEventListener('resize', () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

/* =========================
   DOM ELEMENTS
========================= */

const timerDisplay =
    document.getElementById('timer');

const startButton =
    document.getElementById('startBtn');

const pauseButton =
    document.getElementById('pauseBtn');

const resetButton =
    document.getElementById('resetBtn');

const progressCircle =
    document.querySelector('.progress-ring-circle');

const sessionStatus =
    document.getElementById('sessionStatus');

const flowCards =
    document.querySelectorAll('.flow-card');

const focusModeLabel =
    document.getElementById('focusModeLabel');

const sidebar =
    document.querySelector('.sidebar');

const sidebarToggle =
    document.getElementById('sidebarToggle');

const menuLinks =
    document.querySelectorAll('.menu a[data-section]');

const dashboardSections =
    document.querySelectorAll('.dashboard-section');

const sectionTriggers =
    document.querySelectorAll('[data-section-trigger]');

const taskForm =
    document.getElementById('taskForm');

const todayTaskList =
    document.getElementById('todayTaskList');

const allTaskList =
    document.getElementById('allTaskList');

const taskPageSummary =
    document.getElementById('taskPageSummary');

const calendarGrid =
    document.getElementById('calendarGrid');

const calendarTitle =
    document.getElementById('calendarTitle');

const selectedDayTitle =
    document.getElementById('selectedDayTitle');

const selectedDayTasks =
    document.getElementById('selectedDayTasks');

const prevMonthBtn =
    document.getElementById('prevMonthBtn');

const nextMonthBtn =
    document.getElementById('nextMonthBtn');

/* =========================
   TIMER VARIABLES
========================= */

const RING_RADIUS = 130;

const circumference =
    2 * Math.PI * RING_RADIUS;

progressCircle.style.strokeDasharray =
    circumference;

progressCircle.style.strokeDashoffset = 0;

let currentMode = 25;

let totalTime = currentMode * 60;

let timeLeft = totalTime;

let timerRunning = false;

let timerInterval;

/* =========================
   TASKS / CALENDAR STATE
========================= */

let tasks = [];

const today = new Date();

let calendarMonth = today.getMonth();

let calendarYear = today.getFullYear();

let selectedCalendarDate =
    formatDate(today);

/* =========================
   STATS VARIABLES
========================= */

let completedSessions =
    Number(localStorage.getItem('completedSessions')) || 0;

let totalStudyMinutes =
    Number(localStorage.getItem('studyMinutes')) || 0;

/* =========================
   XP SYSTEM
========================= */

let currentXP =
    Number(localStorage.getItem('currentXP')) || 0;

let currentLevel =
    Number(localStorage.getItem('currentLevel')) || 1;

const maxXP = 350;

/* =========================
   SOUND
========================= */

const completeSound =
    new Audio('assets/sonidos/complete.mp3');


/* =========================
   BUDDY STATES
========================= */

const BUDDY_BASE = 'assets/imagenes/';

const buddyImage =
    document.getElementById('buddyImage');

const buddyPlaceholder =
    document.getElementById('buddyPlaceholder');

/* Activar cuando tengas las imágenes en assets/imagenes/ */
const BUDDY_IMAGES_ENABLED = false;

function setBuddyMood(mood){

    if(!BUDDY_IMAGES_ENABLED || !buddyImage) return;

    const moods = {
        happy: 'buddy-happy.png',
        sleep: 'buddy-sleep.png',
        excited: 'buddy-excited.png',
        tired: 'buddy-tired.png',
    };

    if(!moods[mood]) return;

    buddyImage.src = `${BUDDY_BASE}${moods[mood]}`;
    buddyImage.classList.remove('is-hidden');

    if(buddyPlaceholder){

        buddyPlaceholder.style.display = 'none';

    }

}

/* =========================
   LOAD STATS
========================= */

function loadStats(){

    /* SESSIONS */

    const sessionsElement =
        document.getElementById('sessionsCount');

    if(sessionsElement){

        sessionsElement.textContent =
            completedSessions;

    }

    /* STUDY HOURS */

    const hours =
        Math.floor(totalStudyMinutes / 60);

    const studyHoursElement =
        document.getElementById('studyHours');

    if(studyHoursElement){

        studyHoursElement.textContent =
            `${hours}h`;

    }

    /* CONSISTENCY */

    const consistencyElement =
        document.getElementById('consistency');

    if(consistencyElement){

        const consistency =
            completedSessions > 0
                ? Math.min(100, Math.round((completedSessions / 7) * 100))
                : 100;

        consistencyElement.textContent = `${consistency}%`;

    }

    /* XP TEXT */

    const xpText =
        document.getElementById('xpText');

    if(xpText){

        xpText.textContent =
            `${currentXP} / ${maxXP} XP`;

    }

    /* LEVEL */

    const levelText =
        document.getElementById('levelText');

    if(levelText){

        levelText.textContent =
            `Nivel ${currentLevel}`;

    }

    /* XP BAR */

    const xpFill =
        document.getElementById('xpFill');

    if(xpFill){

        const xpPercent =
            (currentXP / maxXP) * 100;

        xpFill.style.width =
            `${xpPercent}%`;

    }

}

/* =========================
   UPDATE TIMER
========================= */

function updateTimer(){

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    document.title =
        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')} • StudyBuddy`;

    const progress =
        timeLeft / totalTime;

    progressCircle.style.strokeDashoffset =
        circumference * (1 - progress);

}

/* =========================
   START TIMER
========================= */

function startPomodoro(){

    if(timerRunning) return;

    timerRunning = true;

    setBuddyMood('happy');

    document.querySelector('.circle')
        .classList.add('running');

    startButton.innerHTML = `
        <i class="ri-loader-4-line"></i>
        En progreso
    `;

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();

        if(timeLeft <= 0){

            clearInterval(timerInterval);

            timerRunning = false;

            document.querySelector('.circle')
                .classList.remove('running');

            /* =========================
               SAVE SESSION
            ========================= */

            completedSessions++;

            totalStudyMinutes += currentMode;

            saveSessionToBackend(currentMode, 'pomodoro');

            /* =========================
               XP SYSTEM
            ========================= */

            currentXP += 50;

            if(currentXP >= maxXP){

                currentXP = 0;

                currentLevel++;

                showToast(
                    `¡Subiste al nivel ${currentLevel}! 🎉`,
                    'success'
                );

            }

            /* =========================
               SAVE LOCAL STORAGE
            ========================= */

            localStorage.setItem(
                'completedSessions',
                completedSessions
            );

            localStorage.setItem(
                'studyMinutes',
                totalStudyMinutes
            );

            localStorage.setItem(
                'currentXP',
                currentXP
            );

            localStorage.setItem(
                'currentLevel',
                currentLevel
            );

            /* =========================
               UPDATE UI
            ========================= */

            loadStats();

            /* PET MESSAGE */

            const petTitle =
                document.getElementById('petTitle');

            if(petTitle){

                petTitle.textContent =
                    '¡Excelente trabajo! Sigue así 🚀';

            }
            setBuddyMood('excited');

            /* SOUND */

            completeSound.play().catch(() => {});

            /* BUTTON */

            startButton.innerHTML = `
                <i class="ri-check-line"></i>
                Completado
            `;

            /* NOTIFICATION */

            sendNotification(
                '¡Sesión completada! 🎉',
                `${currentMode} minutos de enfoque. ¡Sigue así!`
            );

            /* ALERT */

            showToast(
                'Sesión completada 🎉 ¡Excelente trabajo!',
                'success'
            );

        }

    },1000);

}

/* =========================
   PAUSE TIMER
========================= */

function pausePomodoro(){

    setBuddyMood('tired');

    clearInterval(timerInterval);

    timerRunning = false;

    document.querySelector('.circle')
        .classList.remove('running');

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Continuar
    `;

}

/* =========================
   RESET TIMER
========================= */

function resetPomodoro(){

    setBuddyMood('sleep');

    clearInterval(timerInterval);

    timerRunning = false;

    document.querySelector('.circle')
        .classList.remove('running');

    timeLeft = totalTime;

    updateTimer();

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Iniciar
    `;

}

/* =========================
   SAVE SESSION TO BACKEND
========================= */

async function saveSessionToBackend(minutes, mode){

    try{

        await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                duration_minutes: minutes,
                mode: mode || 'pomodoro',
            }),
        });

    }

    catch(error){

        console.warn('No se pudo guardar la sesión en el backend:', error);

    }

}

/* =========================
   LOAD STATS FROM BACKEND
========================= */

async function loadStatsFromBackend(){

    try{

        const response =
            await fetch(`${API_URL}/stats`, {
                headers: getAuthHeaders(),
            });

        if(!response.ok) return;

        const stats = await response.json();

        completedSessions = stats.total_sessions;
        totalStudyMinutes = stats.total_minutes;

        localStorage.setItem('completedSessions', completedSessions);
        localStorage.setItem('studyMinutes', totalStudyMinutes);
        localStorage.setItem('currentXP', stats.xp);
        localStorage.setItem('currentLevel', stats.level);

        currentXP = stats.xp;
        currentLevel = stats.level;

        loadStats();

        const streakCount =
            document.getElementById('streakCount');

        if(streakCount){

            const days = stats.current_streak;

            streakCount.textContent =
                `${days} ${days === 1 ? 'día' : 'días'}`;

        }

        const streakMessage =
            document.getElementById('streakMessage');

        if(streakMessage){

            const s = stats.current_streak;

            if(s === 0){

                streakMessage.textContent =
                    'Completa tu primera sesión 🔥';

            } else if(s < 3){

                streakMessage.textContent =
                    'Buen inicio, sigue así 💪';

            } else if(s < 7){

                streakMessage.textContent =
                    '¡Vas genial! 🔥';

            } else {

                streakMessage.textContent =
                    `¡${s} días de racha, imparable! 🚀`;

            }

        }

    }

    catch(error){

        console.warn('No se pudieron cargar stats del backend:', error);

    }

    /* FETCH SESSIONS FOR CHART */

    try{

        const sRes =
            await fetch(`${API_URL}/sessions`, {
                headers: getAuthHeaders(),
            });

        if(sRes.ok){

            const sessions =
                await sRes.json();

            updateProductivityChart(sessions);

        }

    }

    catch(e){

        console.warn('No se pudieron cargar sesiones para chart:', e);

    }

}

/* =========================
   UPDATE PRODUCTIVITY CHART
========================= */

function updateProductivityChart(sessions){

    if(!studyChart) return;

    let focusMinutes = 0;
    let breakMinutes = 0;

    sessions.forEach(s => {
        if(s.mode === 'pomodoro'){
            focusMinutes += s.duration_minutes;
        } else {
            breakMinutes += s.duration_minutes;
        }
    });

    const totalMinutes = focusMinutes + breakMinutes || 1;
    const focusPct = Math.round((focusMinutes / totalMinutes) * 100);

    studyChart.data.datasets[0].data = [
        focusPct,
        Math.round((breakMinutes / totalMinutes) * 100),
        0,
        0,
    ];

    studyChart.update();

    /* PRODUCTIVITY SCORE */

    const scoreEl =
        document.querySelector('.productivity-score strong');

    if(scoreEl){
        scoreEl.textContent = `${focusPct}%`;
    }

    /* PROGRESS BARS */

    const progressItems =
        document.querySelectorAll('.progress-item');

    const categories = [
        { label: 'Enfoque', minutes: focusMinutes },
        { label: 'Descansos', minutes: breakMinutes },
        { label: 'Estudio ligero', minutes: 0 },
        { label: 'Distracciones', minutes: 0 },
    ];

    categories.forEach((cat, i) => {

        const item = progressItems[i];
        if(!item) return;

        const timeSpan =
            item.querySelector('.progress-info span:last-child');

        if(timeSpan){
            const h = Math.floor(cat.minutes / 60);
            const m = cat.minutes % 60;
            timeSpan.textContent =
                h > 0
                    ? `${h}h ${m}m`
                    : `${m}m`;
        }

        const fill =
            item.querySelector('.progress-fill');

        if(fill){
            const pct =
                totalMinutes > 0
                    ? Math.round((cat.minutes / totalMinutes) * 100)
                    : 0;
            fill.style.width = `${Math.max(pct, 0)}%`;
        }

    });

}

/* =========================
   BUTTON EVENTS
========================= */

startButton.addEventListener(
    'click',
    startPomodoro
);

pauseButton.addEventListener(
    'click',
    pausePomodoro
);

resetButton.addEventListener(
    'click',
    resetPomodoro
);

/* =========================
   SIDEBAR TOGGLE
========================= */

sidebarToggle.addEventListener('click', () => {

    sidebar.classList.toggle('collapsed');

});

/* =========================
   LOGOUT BUTTON
========================= */

const logoutBtn = document.querySelector('.logout-btn');

if(logoutBtn){

    logoutBtn.addEventListener('click', () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';

    });

}

/* =========================
   SESSION MODES (FLOW CARDS)
========================= */

function applySessionMode(minutes){

    currentMode = minutes;

    totalTime = minutes * 60;

    timeLeft = totalTime;

    clearInterval(timerInterval);

    timerRunning = false;

    document.querySelector('.circle')
        ?.classList.remove('running');

    updateTimer();

    if(minutes === 25){

        if(sessionStatus){

            sessionStatus.innerHTML = `
                <span></span>
                Modo enfoque
            `;

        }

        if(focusModeLabel){

            focusModeLabel.textContent = 'Enfocado';

        }

        progressCircle.style.stroke = 'url(#gradientStroke)';

    }

    else if(minutes === 5){

        if(sessionStatus){

            sessionStatus.innerHTML = `
                <span></span>
                Descanso corto
            `;

        }

        if(focusModeLabel){

            focusModeLabel.textContent = 'Descanso';

        }

        progressCircle.style.stroke = '#34d399';

    }

    else{

        if(sessionStatus){

            sessionStatus.innerHTML = `
                <span></span>
                Descanso largo
            `;

        }

        if(focusModeLabel){

            focusModeLabel.textContent = 'Descanso largo';

        }

        progressCircle.style.stroke = '#f59e0b';

    }

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Iniciar sesión
    `;

}

function selectFlowCard(card){

    flowCards.forEach(btn => {

        btn.classList.remove('active');

    });

    card.classList.add('active');

    const minutes = parseInt(card.dataset.time, 10);

    if(!Number.isNaN(minutes)){

        applySessionMode(minutes);

    }

}

flowCards.forEach(card => {

    card.addEventListener('click', () => {

        selectFlowCard(card);

    });

    card.addEventListener('keydown', (event) => {

        if(event.key === 'Enter' || event.key === ' '){

            event.preventDefault();

            selectFlowCard(card);

        }

    });

});

/* =========================
   INTERNAL NAVIGATION
========================= */

function setActiveSection(sectionId){

    dashboardSections.forEach(section => {

        section.classList.toggle(
            'active',
            section.id === `section-${sectionId}`
        );

    });

    menuLinks.forEach(link => {

        link.classList.toggle(
            'active',
            link.dataset.section === sectionId
        );

    });

    if(sectionId === 'calendar'){

        renderCalendar(calendarMonth, calendarYear);

    }

    if(sectionId === 'tasks'){

        renderAllTasks();

    }

    if(sectionId === 'sessions'){

        renderSessions();

    }

}

menuLinks.forEach(link => {

    link.addEventListener('click', event => {

        event.preventDefault();

        setActiveSection(link.dataset.section);

    });

});

sectionTriggers.forEach(trigger => {

    trigger.addEventListener('click', () => {

        setActiveSection(trigger.dataset.sectionTrigger);

    });

});

/* =========================
   REAL TASKS
========================= */

function formatDate(date){

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, '0');

    const day =
        String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

}

function normalizeTask(task){

    return {
        id: task.id,
        title: task.title || 'Tarea sin título',
        due_date: task.due_date || formatDate(today),
        priority: task.priority || 'media',
        duration_minutes: Number(task.duration_minutes) || 30,
        completed: Boolean(task.completed),
    };

}

function getPriorityClass(priority){

    const normalized =
        String(priority || 'media').toLowerCase();

    if(normalized === 'alta') return 'high';

    if(normalized === 'baja') return 'low';

    return 'medium';

}

function getPriorityIcon(priority){

    const normalized =
        String(priority || 'media').toLowerCase();

    if(normalized === 'alta') return 'purple';

    if(normalized === 'baja') return 'blue';

    return 'orange';

}

function createTaskElement(task){

    const taskElement =
        document.createElement('div');

    taskElement.className =
        `task${task.completed ? ' completed' : ''}`;

    taskElement.dataset.taskId =
        task.id;

    taskElement.innerHTML = `
        <div class="task-left">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-icon ${getPriorityIcon(task.priority)}">
                <i class="ri-file-list-3-line"></i>
            </div>
            <span>${task.title}</span>
        </div>

        <div class="task-meta">
            <span class="badge ${getPriorityClass(task.priority)}">
                ${task.priority}
            </span>
            <small>${task.duration_minutes} min</small>
            <button class="task-menu" title="Eliminar tarea">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `;

    const checkbox =
        taskElement.querySelector('input');

    checkbox.addEventListener('change', () => {

        updateTask(task.id, {
            completed: checkbox.checked,
        });

    });

    const menuButton =
        taskElement.querySelector('.task-menu');

    if(menuButton){

        menuButton.addEventListener('click', (e) => {

            e.stopPropagation();

            deleteTask(task.id);

        });

    }

    return taskElement;

}

async function fetchTasks(){

    /* SHOW SKELETONS */

    const skeletonHtml =
        Array(3).fill('<div class="skeleton skeleton-task"></div>').join('');

    if(todayTaskList) todayTaskList.innerHTML = skeletonHtml;
    if(allTaskList) allTaskList.innerHTML = skeletonHtml;

    try{

        const response =
            await fetch(`${API_URL}/tasks`, {
                headers: getAuthHeaders(),
            });

        if(response.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        if(!response.ok) throw new Error('No se pudieron cargar las tareas');

        const data =
            await response.json();

        tasks =
            data.map(normalizeTask);

    }

    catch(error){

        console.warn(error);

        tasks = [];

        showToast(
            'No se pudieron cargar las tareas. Verifica conexión.',
            'error'
        );

    }

    renderTodayTasks();
    renderAllTasks();
    renderCalendar(calendarMonth, calendarYear);

}

async function createTask(payload){

    const response =
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

    if(!response.ok){

        showToast(
            'No se pudo crear la tarea',
            'error'
        );

        throw new Error('No se pudo crear la tarea');

    }

    await fetchTasks();

}

async function updateTask(taskId, payload){

    const currentTask =
        tasks.find(task => task.id === Number(taskId));

    if(!currentTask) return;

    const response =
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ...currentTask,
                ...payload,
            }),
        });

    if(response.ok){

        await fetchTasks();

    } else {

        showToast(
            'Error al actualizar la tarea',
            'error'
        );

    }

}

async function deleteTask(taskId){

    const task =
        tasks.find(t => t.id === Number(taskId));

    if(!task) return;

    try{

        const response =
            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

        if(response.ok){

            showUndoToast('Tarea eliminada', async () => {

                try{

                    await fetch(`${API_URL}/tasks`, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify({
                            title: task.title,
                            due_date: task.due_date,
                            priority: task.priority,
                            duration_minutes: task.duration_minutes,
                            completed: task.completed,
                        }),
                    });

                    showToast('Tarea restaurada', 'success');

                    await fetchTasks();

                }

                catch(err){

                    showToast('No se pudo restaurar la tarea', 'error');

                }

            });

            await fetchTasks();

        } else {

            showToast('Error al eliminar la tarea', 'error');

        }

    }

    catch(error){

        showToast('Error de conexión al eliminar', 'error');

    }

}

function renderTaskList(container, taskItems){

    if(!container) return;

    container.innerHTML = '';

    taskItems.forEach(task => {

        container.appendChild(
            createTaskElement(task)
        );

    });

}

function renderTodayTasks(){

    const pendingTasks =
        tasks.filter(task => !task.completed);

    renderTaskList(
        todayTaskList,
        pendingTasks.slice(0, 5)
    );

    const pendingCount =
        pendingTasks.length;

    const todayCounter =
        document.querySelector('.tasks-title span');

    if(todayCounter){

        todayCounter.textContent =
            `${pendingCount} pendientes`;

    }

    updateBadgeCount();

}

function renderAllTasks(){

    renderTaskList(allTaskList, tasks);

    if(taskPageSummary){

        const pending =
            tasks.filter(task => !task.completed).length;

        taskPageSummary.textContent =
            `${tasks.length} tareas registradas • ${pending} pendientes`;

    }

    updateBadgeCount();

}

function getTasksByDate(dateString){

    return tasks.filter(task => task.due_date === dateString);

}

function renderSelectedDayTasks(dateString){

    const date =
        new Date(`${dateString}T00:00:00`);

    if(selectedDayTitle){

        selectedDayTitle.textContent =
            date.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

    }

    renderTaskList(
        selectedDayTasks,
        getTasksByDate(dateString)
    );

}

/* =========================
   RENDER SESSIONS
========================= */

async function renderSessions(){

    const list =
        document.getElementById('sessionsList');

    if(!list) return;

    try{

        const response =
            await fetch(`${API_URL}/sessions`, {
                headers: getAuthHeaders(),
            });

        if(!response.ok) throw new Error();

        const sessions = await response.json();

        if(!sessions.length){

            list.innerHTML = `
                <div class="sessions-empty">
                    <i class="ri-timer-flash-line"></i>
                    <p>No hay sesiones registradas aún. Completa un Pomodoro para ver tu historial aquí.</p>
                </div>
            `;
            return;

        }

        list.innerHTML = '';

        sessions.forEach(s => {

            const date = new Date(s.created_at + 'Z');

            const dateStr =
                date.toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

            const timeStr =
                date.toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                });

            const modeLabel =
                s.mode === 'pomodoro' ? 'Enfoque'
                    : s.mode === 'long-break' ? 'Descanso largo'
                    : 'Descanso';

            const modeClass =
                s.mode === 'pomodoro' ? 'pomodoro'
                    : s.mode === 'long-break' ? 'long-break'
                    : 'break';

            const row =
                document.createElement('div');

            row.className = 'session-row';

            row.innerHTML = `
                <span class="session-date">${dateStr} · ${timeStr}</span>
                <span class="session-duration">${s.duration_minutes} min</span>
                <span class="session-mode ${modeClass}">${modeLabel}</span>
                <i class="ri-checkbox-circle-fill" style="color:#4cff88;font-size:18px;"></i>
            `;

            list.appendChild(row);

        });

    }

    catch(error){

        list.innerHTML = `
            <div class="sessions-empty">
                <i class="ri-cloud-off-line"></i>
                <p>No se pudieron cargar las sesiones. Verifica conexión con el backend.</p>
            </div>
        `;

    }

}

/* =========================
   UPDATE BADGE COUNT
========================= */

function updateBadgeCount(){

    const badge =
        document.getElementById('taskBadge');

    if(!badge) return;

    const pending =
        tasks.filter(t => !t.completed).length;

    badge.textContent = pending;

    badge.style.display =
        pending > 0 ? '' : 'none';

}

function renderCalendar(month, year){

    if(!calendarGrid || !calendarTitle) return;

    calendarGrid.innerHTML = '';

    const firstDay =
        new Date(year, month, 1);

    const firstWeekday =
        (firstDay.getDay() + 6) % 7;

    const calendarStart =
        new Date(year, month, 1 - firstWeekday);

    calendarTitle.textContent =
        firstDay.toLocaleDateString('es-CO', {
            month: 'long',
            year: 'numeric',
        });

    for(let index = 0; index < 42; index++){

        const day =
            new Date(calendarStart);

        day.setDate(calendarStart.getDate() + index);

        const dateString =
            formatDate(day);

        const dayTasks =
            getTasksByDate(dateString);

        const dayButton =
            document.createElement('button');

        dayButton.type = 'button';

        dayButton.className = 'calendar-day';

        dayButton.classList.toggle(
            'is-muted',
            day.getMonth() !== month
        );

        dayButton.classList.toggle(
            'is-today',
            dateString === formatDate(today)
        );

        dayButton.classList.toggle(
            'is-selected',
            dateString === selectedCalendarDate
        );

        dayButton.innerHTML = `
            <span class="calendar-day-number">${day.getDate()}</span>
            <span>
                ${dayTasks.slice(0, 3).map(() => '<i class="calendar-task-dot"></i>').join('')}
            </span>
            ${dayTasks[0] ? `<span class="calendar-task-preview">${dayTasks[0].title}</span>` : ''}
        `;

        dayButton.addEventListener('click', () => {

            selectedCalendarDate = dateString;

            renderCalendar(calendarMonth, calendarYear);

            renderSelectedDayTasks(dateString);

        });

        calendarGrid.appendChild(dayButton);

    }

    renderSelectedDayTasks(selectedCalendarDate);

}

if(taskForm){

    taskForm.addEventListener('submit', async event => {

        event.preventDefault();

        const title =
            document.getElementById('taskTitle').value.trim();

        if(!title) return;

        const submitBtn =
            taskForm.querySelector('.task-submit');

        const originalText =
            submitBtn.innerHTML;

        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <i class="ri-loader-4-line"></i>
            Creando...
        `;

        try{

            await createTask({
                title,
                due_date: document.getElementById('taskDate').value || formatDate(today),
                priority: document.getElementById('taskPriority').value,
                duration_minutes: Number(document.getElementById('taskDuration').value) || 30,
                completed: false,
            });

            taskForm.reset();

            document.getElementById('taskDuration').value = 30;

            submitBtn.disabled = false;

            submitBtn.innerHTML = originalText;

        }

        catch(error){

            submitBtn.disabled = false;

            submitBtn.innerHTML = originalText;

            showToast(
                'No se pudo crear la tarea. ¿El backend está activo?',
                'error'
            );

        }

    });

}

if(prevMonthBtn){

    prevMonthBtn.addEventListener('click', () => {

        calendarMonth--;

        if(calendarMonth < 0){

            calendarMonth = 11;
            calendarYear--;

        }

        renderCalendar(calendarMonth, calendarYear);

    });

}

if(nextMonthBtn){

    nextMonthBtn.addEventListener('click', () => {

        calendarMonth++;

        if(calendarMonth > 11){

            calendarMonth = 0;
            calendarYear++;

        }

        renderCalendar(calendarMonth, calendarYear);

    });

}

/* =========================
   CHART.JS
========================= */

const chartCanvas =
    document.getElementById('studyChart');

let studyChart = null;

if(chartCanvas && window.Chart){

    const ctxChart =
        chartCanvas.getContext('2d');

    studyChart = new Chart(ctxChart, {

        type: 'doughnut',

        data: {

            labels: [
                'Enfoque',
                'Descansos',
                'Estudio ligero',
                'Distracciones'
            ],

            datasets: [{

                data: [0, 0, 0, 0],

                backgroundColor: [
                    '#50e486',
                    '#7894ff',
                    '#ffad4c',
                    '#ff6b6b'
                ],

                borderColor: 'rgba(11,15,42,0.95)',

                borderWidth: 8,

                hoverOffset: 4,

                cutout: '72%',

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                animateRotate: true,

                duration: 900

            },

            plugins: {

                legend: {

                    display: false

                }

            },
        }

    });

}

/* =========================
   LOAD USER INTO SIDEBAR
========================= */

function loadUserInSidebar(){

    const stored = localStorage.getItem('user');

    if(!stored) return;

    try{

        const userData = JSON.parse(stored);

        const name =
            userData.email.split('@')[0] || userData.email;

        const nameElement =
            document.querySelector('.user-info h3');

        const roleElement =
            document.querySelector('.user-info p');

        if(nameElement){

            nameElement.textContent = name;

        }

        if(roleElement){

            roleElement.textContent = userData.email;

        }

        const greetingName =
            document.getElementById('greetingName');

        if(greetingName){

            greetingName.textContent = name.charAt(0).toUpperCase() + name.slice(1);

        }

    }

    catch(e){

        console.warn('No se pudo cargar usuario en sidebar');

    }

}

/* =========================
   NOTIFICATION API
========================= */

function sendNotification(title, body){

    if(!('Notification' in window)) return;

    if(Notification.permission === 'granted'){

        new Notification(title, {
            body,
            icon: 'assets/imagenes/logo.png',
        });

    } else if(Notification.permission !== 'denied'){

        Notification.requestPermission();

    }

}

/* =========================
   KEYBOARD SHORTCUT (SPACE)
========================= */

document.addEventListener('keydown', (e) => {

    if(e.target.tagName === 'INPUT' ||
       e.target.tagName === 'TEXTAREA' ||
       e.target.tagName === 'SELECT') return;

    if(e.key === ' ' || e.code === 'Space'){

        e.preventDefault();

        if(timerRunning){

            pausePomodoro();

        } else {

            const btnText =
                startButton.textContent.trim();

            if(btnText === 'Iniciar sesión' ||
               btnText === 'Continuar'){

                startPomodoro();

            }

        }

    }

});

/* =========================
   PAUSE ON TAB HIDDEN
========================= */

document.addEventListener('visibilitychange', () => {

    if(document.hidden && timerRunning){

        pausePomodoro();

    }

});

/* =========================
   INITIALIZE
========================= */

updateTimer();

loadStats();

loadStatsFromBackend();

loadUserInSidebar();

fetchTasks();
