console.log("StudyBuddy Dashboard Loaded");

const API_URL = "http://127.0.0.1:8000";

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

            /* =========================
               XP SYSTEM
            ========================= */

            currentXP += 50;

            if(currentXP >= maxXP){

                currentXP = 0;

                currentLevel++;

                alert(`🎉 Subiste al nivel ${currentLevel}`);

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

            /* ALERT */

            alert('🎉 Sesión completada');

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
            <button class="task-menu" title="Más opciones">
                <i class="ri-more-2-fill"></i>
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

    return taskElement;

}

async function fetchTasks(){

    try{

        const response =
            await fetch(`${API_URL}/tasks`);

        if(!response.ok) throw new Error('No se pudieron cargar las tareas');

        const data =
            await response.json();

        tasks =
            data.map(normalizeTask);

    }

    catch(error){

        console.warn(error);

        tasks = [];

    }

    renderTodayTasks();
    renderAllTasks();
    renderCalendar(calendarMonth, calendarYear);

}

async function createTask(payload){

    const response =
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

    if(!response.ok){

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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...currentTask,
                ...payload,
            }),
        });

    if(response.ok){

        await fetchTasks();

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

    const todayTasks =
        tasks.filter(task => task.due_date === formatDate(today));

    renderTaskList(
        todayTaskList,
        todayTasks.slice(0, 4)
    );

    const pendingCount =
        todayTasks.filter(task => !task.completed).length;

    const todayCounter =
        document.querySelector('.tasks-title span');

    if(todayCounter){

        todayCounter.textContent =
            `${pendingCount} pendientes`;

    }

}

function renderAllTasks(){

    renderTaskList(allTaskList, tasks);

    if(taskPageSummary){

        const pending =
            tasks.filter(task => !task.completed).length;

        taskPageSummary.textContent =
            `${tasks.length} tareas registradas • ${pending} pendientes`;

    }

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

        }

        catch(error){

            alert('No se pudo crear la tarea. Revisa que el backend esté activo.');

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

if(chartCanvas && window.Chart){

    const ctxChart =
        chartCanvas.getContext('2d');

    new Chart(ctxChart, {

        type: 'doughnut',

        data: {

            labels: [
                'Enfoque profundo',
                'Estudio ligero',
                'Descansos',
                'Distracciones'
            ],

            datasets: [{

                data: [60, 23, 11, 6],

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
   INITIALIZE
========================= */

updateTimer();

loadStats();

fetchTasks();
