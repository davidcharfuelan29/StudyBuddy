const API_URL = "";

function getAuthHeaders(){
    const token = localStorage.getItem("token");
    const headers = {"Content-Type": "application/json"};
    if(token){
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

function getCurrentUserId(){
    try{
        const u = JSON.parse(localStorage.getItem('user'));
        return u && u.id ? u.id : null;
    } catch { return null; }
}

function handleUnauthorized(response){
    if(response.status === 401){
        showToast('Sesión expirada. Inicia sesión de nuevo.', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return true;
    }
    return false;
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

function showConfirmToast(message, onConfirm, onCancel, options = {}){

    const { timeoutMs = 0, confirmLabel = 'Sí', cancelLabel = 'No' } = options;

    const container =
        document.getElementById('toastContainer');

    if(!container) return;

    const toast =
        document.createElement('div');

    toast.className = 'toast info has-confirm';

    const timeoutHtml = timeoutMs > 0
        ? `<span class="toast-timeout" style="display:block;font-size:12px;color:#9ea4cf;margin-top:4px;">Auto: ${confirmLabel} en ${Math.ceil(timeoutMs / 1000)}s</span>`
        : '';

    toast.innerHTML = `
        <span>${message}</span>
        ${timeoutHtml}
        <div class="toast-actions">
            <button class="toast-confirm-yes">${confirmLabel}</button>
            <button class="toast-confirm-no">${cancelLabel}</button>
        </div>
    `;

    container.appendChild(toast);

    let countdown = null;

    if(timeoutMs > 0){
        const timeoutEl = toast.querySelector('.toast-timeout');
        let remaining = Math.ceil(timeoutMs / 1000);
        countdown = setInterval(() => {
            remaining--;
            if(timeoutEl) timeoutEl.textContent = `Auto: ${confirmLabel} en ${remaining}s`;
            if(remaining <= 0){
                clearInterval(countdown);
                if(onConfirm) onConfirm();
                toast.remove();
            }
        }, 1000);
    }

    toast.querySelector('.toast-confirm-yes')
        .addEventListener('click', () => {
            if(countdown) clearInterval(countdown);
            if(onConfirm) onConfirm();
            toast.remove();
        });

    toast.querySelector('.toast-confirm-no')
        .addEventListener('click', () => {
            if(countdown) clearInterval(countdown);
            if(onCancel) onCancel();
            toast.remove();
        });

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

const focusSubtitle =
    document.getElementById('focusSubtitle');

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

let selectedTask = null;

let savedTimerState = null;

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

let completedSessions = 0;
let totalStudyMinutes = 0;

/* DISTRACTION TRACKING */

let lastBreakEndTime = null;
let awaySeconds = 0;
let awayInterval = null;
const MAX_DISTRACTION_GAP_MIN = 30;

function getDistractionStorageKey(userId, dateStr){
    return `distractions_${userId}_${dateStr}`;
}

function getTodayDistraction(userId){
    const key = getDistractionStorageKey(userId, new Date().toISOString().slice(0,10));
    return Number(localStorage.getItem(key)) || 0;
}

function addDistraction(userId, minutes){
    const today = new Date().toISOString().slice(0,10);
    const key = getDistractionStorageKey(userId, today);
    const current = Number(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, current + minutes);
}

function getWeekDistractions(userId){
    let total = 0;
    const now = new Date();
    for(let i = 0; i < 7; i++){
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = getDistractionStorageKey(userId, d.toISOString().slice(0,10));
        total += Number(localStorage.getItem(key)) || 0;
    }
    return total;
}

/* =========================
   XP SYSTEM
========================= */

let currentXP = 0;
let currentLevel = 1;

const maxXP = 350;

/* =========================
   SOUND
========================= */

function playCompleteSound(){
    const sound = new Audio('assets/sonidos/complete.mp3');
    sound.volume = 0.5;
    sound.play().catch(() => {
        setTimeout(() => sound.play().catch(() => {}), 200);
    });
}


/* =========================
   BUDDY STATES
========================= */

const BUDDY_BASE = 'assets/imagenes/';

const buddyImage =
    document.getElementById('buddyImage');

const buddyPlaceholder =
    document.getElementById('buddyPlaceholder');

const BUDDY_IMAGES_ENABLED = true;

function setBuddyMood(mood){

    if(!BUDDY_IMAGES_ENABLED || !buddyImage) return;

    const moods = {
        happy: 'buddy-happy.png',
        sad: 'buddy-sad.png',
        greeting: 'buddy-greeting.png',
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

    /* MOOD CARD — mensajes cortos */
    const moodMessages = {
        happy:    ['Feliz 😊', 'Tu racha me emociona 💜'],
        sad:      ['Triste 😢', 'Te extraño, vuelve 💔'],
        greeting: ['¡Hola! 👋', 'Nuevo amigo en casa 🚀'],
        sleep:    ['Zzz 😴', 'Siempre listo para ti'],
        excited:  ['¡Eufórico! 🎉', 'Lo estás haciendo genial'],
        tired:    ['Descanso 🧘', 'Recarga energía y vuelve'],
    };

    /* PET BUBBLE — mensaje elaborado al lado de la imagen */
    const bubbleMessages = {
        happy:    ['¡Racha imparable! 🔥', 'Llevas una racha activa y cada sesión te acerca más a tu mejor versión. ¡Sigue así! 💜'],
        sad:      ['Un nuevo comienzo 💪', 'La racha se perdió, pero una sola sesión puede cambiarlo todo. ¿Comenzamos?'],
        greeting: ['¡Bienvenido! 🚀', 'Soy Buddy, tu compañero de estudio. ¿Listo para tu primera sesión? ✨'],
        sleep:    ['Sin preocupaciones 😴', 'Cuando quieras retomar, aquí estaré esperándote.'],
        excited:  ['¡Sesión completada! 🎉', 'Cada sesión terminada es un paso firme hacia tu mejor versión. ¡Grandioso trabajo!'],
        tired:    ['Momento de recargar 🧘', 'Una pausa no es rendirse, es prepararse para volver más fuerte. Te espero 💜'],
    };

    const moodTitle = document.getElementById('moodTitle');
    const moodText  = document.getElementById('moodText');
    const petTitle  = document.getElementById('petTitle');
    const petText   = document.getElementById('petMessageText');

    if(moodMessages[mood]){
        if(moodTitle) moodTitle.textContent = moodMessages[mood][0];
        if(moodText)  moodText.textContent  = moodMessages[mood][1];
    }

    if(bubbleMessages[mood]){
        if(petTitle) petTitle.textContent = bubbleMessages[mood][0];
        if(petText)  petText.textContent  = bubbleMessages[mood][1];
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
    const mins =
        totalStudyMinutes % 60;

    const studyHoursElement =
        document.getElementById('studyHours');

    if(studyHoursElement){

        studyHoursElement.textContent =
            hours > 0
                ? `${hours}h ${mins}m`
                : `${mins}m`;

    }

    /* CONSISTENCY */

    const consistencyElement =
        document.getElementById('consistency');

    if(consistencyElement){

        const consistency =
            completedSessions > 0
                ? Math.min(100, Math.round((completedSessions / 7) * 100))
                : 0;

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
   LOAD PET NAME
========================= */

function loadPetName(){

    const userId = getCurrentUserId();
    const name = userId ? localStorage.getItem(`petName_${userId}`) : null;
    const el = document.getElementById('petNameDisplay');
    if(el) el.textContent = name || 'Buddy';

}

/* =========================
   ONBOARDING MODAL
========================= */

function showOnboardingModal(){

    const overlay = document.getElementById('onboardingOverlay');

    if(!overlay) return;

    overlay.classList.add('is-visible');

    document.getElementById('onboardingSubmit')
        .addEventListener('click', function onboardingHandler(e){

            e.preventDefault();

            const userId = getCurrentUserId();

            if(!userId) return;

            const nameInput =
                document.getElementById('onboardingName');
            const petInput =
                document.getElementById('onboardingPetName');

            const displayName = nameInput.value.trim() || 'Estudiante';
            const petName     = petInput.value.trim()   || 'Buddy';

            localStorage.setItem(`displayName_${userId}`, displayName);
            localStorage.setItem(`petName_${userId}`, petName);
            localStorage.setItem(`onboarding_${userId}`, 'true');

            syncSettingsToBackend();
            loadPetName();
            loadUserInSidebar();

            overlay.classList.remove('is-visible');

        }, { once: true });

}

/* =========================
   ANALYTICS SECTION
========================= */

function loadAnalytics(stats, allTasks){

    const sessionsEl = document.getElementById('analyticsSessions');
    if(sessionsEl && stats){
        sessionsEl.textContent = stats.total_sessions;
    }

    const hoursEl = document.getElementById('analyticsHours');
    if(hoursEl && stats){
        const h = Math.floor(stats.total_minutes / 60);
        const m = stats.total_minutes % 60;
        hoursEl.textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;
    }

    const pendingEl = document.getElementById('analyticsPendingTasks');
    if(pendingEl && allTasks){
        pendingEl.textContent = allTasks.filter(t => !t.completed).length;
    }

    const streakEl = document.getElementById('analyticsStreak');
    if(streakEl && stats){
        const d = stats.current_streak;
        streakEl.textContent = `${d} ${d === 1 ? 'día' : 'días'}`;
    }

    /* =========================
       ANALYTICS INSIGHT
    ========================= */

    const insightEl = document.getElementById('analyticsInsight');
    if(insightEl && stats){
        if(stats.total_sessions === 0){
            insightEl.textContent = 'Completa tu primera sesión para generar métricas.';
        } else if(stats.total_sessions < 5){
            insightEl.textContent = 'Buen comienzo. Sigue acumulando sesiones para ver tendencias.';
        } else if(stats.current_streak >= 7){
            insightEl.textContent = `¡${stats.current_streak} días de racha! Tu constancia es impresionante.`;
        } else if(stats.total_sessions >= 20){
            insightEl.textContent = 'Ya tienes datos suficientes. Revisa tu progreso semanal en Inicio.';
        } else {
            insightEl.textContent = `${stats.total_sessions} sesiones completadas. Sigue así para ver más estadísticas.`;
        }
    }

}

/* =========================
   ACHIEVEMENTS
========================= */

function loadAchievements(stats){

    const firstEl = document.getElementById('achievementFirstSession');
    const streakEl = document.getElementById('achievementStreak');
    const levelEl = document.getElementById('achievementLevel');

    if(firstEl && stats){
        firstEl.classList.toggle('is-unlocked', stats.total_sessions >= 1);
    }
    if(streakEl && stats){
        streakEl.classList.toggle('is-unlocked', stats.current_streak >= 3);
    }
    if(levelEl && stats){
        levelEl.classList.toggle('is-unlocked', stats.level >= 2);
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

    if(currentMode === 25){
        const uid = getCurrentUserId();
        let breakEnd = lastBreakEndTime;
        let breakDuration = 5;
        if(uid){
            const stored = localStorage.getItem(`lastBreakEnd_${uid}`);
            if(stored) breakEnd = Number(stored);
            const dur = localStorage.getItem(`lastBreakDuration_${uid}`);
            if(dur) breakDuration = Number(dur);
        }
        if(breakEnd && uid){
            const elapsedMin = (Date.now() - breakEnd) / 60000;
            const buffer = 1;
            const extra = Math.round(elapsedMin - breakDuration - buffer);
            if(extra > 0 && extra < MAX_DISTRACTION_GAP_MIN){
                addDistraction(uid, extra);
            }
            lastBreakEndTime = null;
            localStorage.removeItem(`lastBreakEnd_${uid}`);
            localStorage.removeItem(`lastBreakDuration_${uid}`);
        }
    }

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
               SAVE SESSION & REFRESH STATS
            ========================= */

            let sessionMode;
            if(selectedTask){
                sessionMode = 'pomodoro';
            } else if(currentMode === 5){
                sessionMode = 'break';
            } else if(currentMode === 25){
                sessionMode = 'pomodoro';
            } else {
                sessionMode = 'long-break';
            }

            const taskId = selectedTask ? selectedTask.id : null;
            const taskTitle = selectedTask ? selectedTask.title : null;

            /* =========================
               UI FEEDBACK
            ========================= */

            setBuddyMood('excited');

            /* SOUND */

            const userId = getCurrentUserId();
            const soundEnabled = userId ? localStorage.getItem(`soundEnabled_${userId}`) : null;
            if(soundEnabled !== 'false'){
                playCompleteSound();
            }

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

            if(sessionMode === 'break' || sessionMode === 'long-break'){
                lastBreakEndTime = Date.now();
                const uid = getCurrentUserId();
                if(uid){
                    localStorage.setItem(`lastBreakEnd_${uid}`, String(lastBreakEndTime));
                    localStorage.setItem(`lastBreakDuration_${uid}`, String(currentMode));
                }
            }

            const isBreak = sessionMode === 'break' || sessionMode === 'long-break';

            if(isBreak){

                saveSessionToBackend(currentMode, sessionMode).then(ok => {
                    if(ok) loadStatsFromBackend();
                });
                if(savedTimerState){
                    restoreTimerState();
                } else {
                    resetToDefaultPomodoro();
                }
                awaySeconds = 0;
                return;

            }

            /* =========================
               AWAY TIME QUESTION
            ========================= */

            function handleAwayAndProceed(awayWasDistraction) {
                const awayMin = Math.round(awaySeconds / 60);
                if(awayWasDistraction && awayMin > 0){
                    const uid = getCurrentUserId();
                    if(uid) addDistraction(uid, awayMin);
                }

                /* =========================
                   TASK QUESTION
                ========================= */

                if(selectedTask){

                    showConfirmToast(
                        `¿Completaste "${selectedTask.title}"?`,
                        async () => {
                            await saveSessionToBackend(currentMode, sessionMode, taskId, taskTitle, true, awayMin);
                            await deleteTask(selectedTask.id);
                            selectedTask = null;
                            if(focusSubtitle){
                                focusSubtitle.textContent = 'Enfócate en ti, el resultado llegará.';
                                focusSubtitle.classList.remove('task-active');
                            }
                            resetToDefaultPomodoro();
                            loadStatsFromBackend();
                            awaySeconds = 0;
                        },
                        async () => {
                            await saveSessionToBackend(currentMode, sessionMode, taskId, taskTitle, false, awayMin);
                            loadStatsFromBackend();
                            selectedTask = null;
                            if(focusSubtitle){
                                focusSubtitle.textContent = 'Enfócate en ti, el resultado llegará.';
                                focusSubtitle.classList.remove('task-active');
                            }
                            resetToDefaultPomodoro();
                            awaySeconds = 0;
                        }
                    );

                } else {

                    saveSessionToBackend(currentMode, sessionMode, null, null, false, awayMin).then(ok => {
                        if(ok) loadStatsFromBackend();
                    });
                    resetToDefaultPomodoro();
                    awaySeconds = 0;

                }
            }

            const awayMin = Math.round(awaySeconds / 60);
            if(awayMin > 0){
                showConfirmToast(
                    `Estuviste ${awayMin} min fuera de la página ¿ese tiempo fue trabajo o distracción?`,
                    () => handleAwayAndProceed(false),
                    () => handleAwayAndProceed(true),
                    { timeoutMs: 10000, confirmLabel: 'Trabajo 👍', cancelLabel: 'Distracción 😅' }
                );
            } else {
                handleAwayAndProceed(false);
            }

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
   RESTORE STUDY STATE AFTER BREAK
========================= */

function restoreTimerState(){

    if(!savedTimerState) return;

    currentMode = savedTimerState.currentMode;
    totalTime = savedTimerState.totalTime;
    timeLeft = savedTimerState.timeLeft;
    selectedTask = savedTimerState.selectedTask;

    savedTimerState = null;

    clearInterval(timerInterval);

    timerRunning = false;

    document.querySelector('.circle')
        ?.classList.remove('running');

    updateTimer();

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Iniciar
    `;

    sessionStatus.innerHTML = `
        <span></span>
        Modo enfoque
    `;

    focusModeLabel.textContent = 'Enfocado';

    progressCircle.style.stroke = 'url(#gradientStroke)';

    if(selectedTask){

        focusSubtitle.textContent = selectedTask.title;
        focusSubtitle.classList.add('task-active');

    } else {

        focusSubtitle.textContent = 'Enfócate en ti, el resultado llegará.';
        focusSubtitle.classList.remove('task-active');

    }

    flowCards.forEach(c => c.classList.remove('active'));

    if(currentMode === 25){

        const pomoCard =
            document.querySelector('.flow-card[data-time="25"]');

        if(pomoCard) pomoCard.classList.add('active');

    }

}

/* =========================
   RESET TO DEFAULT POMODORO
========================= */

function resetToDefaultPomodoro(){

    clearInterval(timerInterval);

    timerRunning = false;

    document.querySelector('.circle')
        ?.classList.remove('running');

    currentMode = 25;
    totalTime = 25 * 60;
    timeLeft = totalTime;

    updateTimer();

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Iniciar
    `;

    sessionStatus.innerHTML = `
        <span></span>
        Modo enfoque
    `;

    focusModeLabel.textContent = 'Enfocado';

    progressCircle.style.stroke = 'url(#gradientStroke)';

    focusSubtitle.textContent = 'Enfócate en ti, el resultado llegará.';
    focusSubtitle.classList.remove('task-active');

    flowCards.forEach(c => c.classList.remove('active'));

    const pomoCard =
        document.querySelector('.flow-card[data-time="25"]');

    if(pomoCard) pomoCard.classList.add('active');

    selectedTask = null;

}

/* =========================
   SAVE SESSION TO BACKEND
========================= */

async function saveSessionToBackend(minutes, mode, taskId, taskTitle = null, taskCompleted = false, awayMinutes = 0){

    try{

        const body = {
            duration_minutes: minutes,
            mode: mode || 'pomodoro',
            task_completed: taskCompleted,
            away_minutes: awayMinutes,
        };

        if(taskId) body.task_id = taskId;
        if(taskTitle) body.task_title = taskTitle;

        const res = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if(handleUnauthorized(res)) return false;
        return res.ok;

    }

    catch(error){

        console.warn('No se pudo guardar la sesión en el backend:', error);
        return false;

    }

}

/* =========================
   LOAD STATS FROM BACKEND
========================= */

async function loadStatsFromBackend(){

    let stats = null;

    try{

        const response =
            await fetch(`${API_URL}/stats`, {
                headers: getAuthHeaders(),
            });

        if(handleUnauthorized(response)) return;
        if(!response.ok) return;

        stats = await response.json();

        if(stats.level > currentLevel){
            showToast(`¡Subiste al nivel ${stats.level}! 🎉`, 'success');
        }
        completedSessions = stats.total_sessions;
        totalStudyMinutes = stats.total_minutes;
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

        /* BUDDY MOOD BASED ON STREAK */

        const total = stats.total_sessions;
        const streak = stats.current_streak;

        if(total === 0){

            setBuddyMood('greeting');

        } else if(streak === 0){

            setBuddyMood('sad');

        } else {

            setBuddyMood('happy');

        }

        /* ONBOARDING — usuario nuevo sin sesiones */

        const onboardingKey = `onboarding_${getCurrentUserId()}`;

        if(!localStorage.getItem(onboardingKey)){
            if(total > 0){
                localStorage.setItem(onboardingKey, 'true');
            } else {
                showOnboardingModal();
            }
        }

    }

    catch(error){

        console.warn('No se pudieron cargar stats del backend:', error);
        showToast(
            'No se pudieron cargar estadísticas. Verifica conexión al servidor.',
            'warning'
        );

    }

    if(stats){
        loadAnalytics(stats, tasks);
        loadAchievements(stats);
    }

    /* FETCH SESSIONS FOR CHART */

    try{

        const sRes =
            await fetch(`${API_URL}/sessions`, {
                headers: getAuthHeaders(),
            });

        if(handleUnauthorized(sRes)) return;
        if(sRes.ok){

            const sessions =
                await sRes.json();

            updateProductivityChart(sessions);
            renderMiniStreak(sessions);
            renderSessions();

        }

    }

    catch(e){

        console.warn('No se pudieron cargar sesiones para chart:', e);
        renderMiniStreak([]);

    }

}

/* =========================
   UPDATE PRODUCTIVITY CHART
========================= */

function updateProductivityChart(sessions){

    if(!studyChart) return;

    let deepMinutes = 0;
    let lightMinutes = 0;
    let breakMinutes = 0;
    let pomodoroCount = 0;

    sessions.forEach(s => {
        const mins = s.duration_minutes || 0;
        if(s.mode === 'pomodoro'){
            pomodoroCount++;
            if(mins > 15){
                deepMinutes += mins;
            } else {
                lightMinutes += mins;
            }
        } else {
            breakMinutes += mins;
        }
    });

    const focusMinutes = deepMinutes + lightMinutes;

    /* CALCULATE DISTRACTIONS FROM TRACKED IDLE TIME */

    const userId = getCurrentUserId();
    const distractionMinutes = userId ? getWeekDistractions(userId) : 0;

    const totalMinutes = focusMinutes + breakMinutes + distractionMinutes || 1;

    /* CHART DATA — raw minutes, chart.js handles proportions */

    studyChart.data.datasets[0].data = [
        deepMinutes,
        lightMinutes,
        breakMinutes,
        distractionMinutes,
    ];

    studyChart.update();

    /* PRODUCTIVITY SCORE */

    const scoreEl =
        document.querySelector('.productivity-score strong');

    if(scoreEl){
        const focusPct = totalMinutes > 0
            ? Math.round((focusMinutes / totalMinutes) * 100)
            : 0;
        scoreEl.textContent = `${focusPct}%`;
    }

    /* PROGRESS BARS */

    const progressItems =
        document.querySelectorAll('.progress-item');

    const categories = [
        { label: 'Enfoque profundo', minutes: deepMinutes },
        { label: 'Estudio ligero', minutes: lightMinutes },
        { label: 'Descansos', minutes: breakMinutes },
        { label: 'Distracciones', minutes: distractionMinutes },
    ];

    categories.forEach((cat, i) => {

        const item = progressItems[i];
        if(!item) return;

        const labelSpan = item.querySelector('.progress-info span:first-child');
        if(labelSpan){
            const dot = labelSpan.querySelector('.legend-dot');
            labelSpan.innerHTML = '';
            if(dot) labelSpan.appendChild(dot);
            labelSpan.append(' ' + cat.label);
        }

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

    /* DYNAMIC INSIGHT */

    const insightEl = document.getElementById('insightText');
    if(!insightEl) return;

    const pomodoroSessionCount = pomodoroCount;

    if(pomodoroSessionCount === 0 && breakMinutes === 0 && distractionMinutes === 0){
        insightEl.textContent = 'Completa tu primera sesión para generar insights de productividad.';
    } else if(focusMinutes === 0){
        insightEl.textContent = 'Aún no has registrado sesiones de enfoque. ¡Activa el Pomodoro!';
    } else if(pomodoroSessionCount < 3){
        insightEl.textContent = `Buen comienzo: ${focusMinutes} min de enfoque en ${pomodoroSessionCount} sesiones. Sigue así para ver patrones.`;
    } else {
        const focusH = Math.floor(focusMinutes / 60);
        const focusM = focusMinutes % 60;
        const focusPct = totalMinutes > 0
            ? Math.round((focusMinutes / totalMinutes) * 100)
            : 0;
        let text =
            `${pomodoroSessionCount} sesiones de estudio · ` +
            `${focusH > 0 ? `${focusH}h ` : ''}${focusM}m de enfoque (${focusPct}%)`;
        if(distractionMinutes > 0){
            const distH = Math.floor(distractionMinutes / 60);
            const distM = distractionMinutes % 60;
            text += ` · ${distH > 0 ? `${distH}h ` : ''}${distM}m distraído`;
        }
        insightEl.textContent = text;
    }

}

/* =========================
   MINI-STREAK DYNAMIC
========================= */

function renderMiniStreak(sessions){

    const container = document.querySelector('.mini-days');
    if(!container) return;

    const dayNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const sessionDates = new Set();
    (sessions || []).forEach(s => {
        if(s.created_at){
            sessionDates.add(s.created_at.slice(0, 10));
        }
    });

    container.innerHTML = '';

    for(let i = 0; i < 7; i++){

        const day = new Date(monday);
        day.setDate(monday.getDate() + i);

        const y = day.getFullYear();
        const m = String(day.getMonth() + 1).padStart(2, '0');
        const d = String(day.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const isToday = dateStr === today.toISOString().slice(0, 10);
        const hasSession = sessionDates.has(dateStr);
        const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const div = document.createElement('div');
        div.className = 'mini-day';

        if(isToday) div.classList.add('current');
        if(hasSession) div.classList.add('active');
        if(!hasSession && isPast) div.classList.add('inactive');
        if(!hasSession && !isPast && !isToday) div.classList.add('pending');

        div.innerHTML = `
            <span>${dayNames[i]}</span>
            <i class="${hasSession ? 'ri-check-line' : ''}"></i>
        `;

        container.appendChild(div);

    }

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
   LOGOUT
========================= */

function handleLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

const logoutBtn = document.querySelector('.logout-btn');

if(logoutBtn){
    logoutBtn.addEventListener('click', handleLogout);
}

const menuLogout = document.querySelector('.menu-logout');

if(menuLogout){
    menuLogout.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
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

    if(focusSubtitle){
        focusSubtitle.textContent = 'Enfócate en ti, el resultado llegará.';
        focusSubtitle.classList.remove('task-active');
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

        if(minutes === 5 && !savedTimerState){
            savedTimerState = {
                timeLeft,
                totalTime,
                currentMode,
                selectedTask,
            };
        } else if(minutes !== 5){
            savedTimerState = null;
        }

        selectedTask = null;
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
            <button class="task-start-btn" title="Iniciar timer con esta tarea">
                <i class="ri-play-circle-line"></i>
            </button>
            <button class="task-menu" title="Eliminar tarea">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `;

    const startBtn =
        taskElement.querySelector('.task-start-btn');

    if(startBtn && !task.completed){
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTaskFromCard(task);
        });
    }

    if(startBtn && task.completed){
        startBtn.style.display = 'none';
    }

    const checkbox =
        taskElement.querySelector('input');

    checkbox.addEventListener('change', () => {

        updateTask(task.id, task, {
            completed: checkbox.checked,
        });

    });

    const menuButton =
        taskElement.querySelector('.task-menu');

    if(menuButton){

        menuButton.addEventListener('click', (e) => {

            e.stopPropagation();

            deleteTask(task.id, task);

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

        if(handleUnauthorized(response)) return;

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
    loadAnalytics(null, tasks);

}

async function createTask(payload){

    try{

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

    catch(error){
        if(error.message !== 'No se pudo crear la tarea'){
            showToast(
                'Error de conexión. ¿El backend está activo?',
                'error'
            );
        }
        throw error;
    }

}

async function updateTask(taskId, taskData = null, payload){

    if(arguments.length === 2){
        payload = taskData;
        taskData = null;
    }

    const currentTask = taskData || tasks.find(t => t.id === Number(taskId));

    if(!currentTask) return;

    try{

        const response =
            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ...currentTask,
                    ...payload,
                }),
            });

        if(handleUnauthorized(response)) return;

        if(response.ok){

            await fetchTasks();

        } else {

            const data = await response.json().catch(() => ({}));

            showToast(
                data.detail || 'Error al actualizar la tarea',
                'error'
            );

        }

    }

    catch(error){

        showToast(
            'Error de conexión al actualizar la tarea',
            'error'
        );

    }

}

async function deleteTask(taskId, taskData = null){

    const task = taskData || tasks.find(t => t.id === Number(taskId));

    try{

        const response =
            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

        if(handleUnauthorized(response)) return;

        if(response.ok){

            if(task){

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

            }

            await fetchTasks();

        } else {

            const data = await response.json().catch(() => ({}));

            showToast(data.detail || 'Error al eliminar la tarea', 'error');

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

function selectTaskFromCard(task){
    selectedTask = task;
    flowCards.forEach(c => c.classList.remove('active'));

    savedTimerState = null;

    const mins = task.duration_minutes || 25;
    currentMode = mins;
    totalTime = mins * 60;
    timeLeft = totalTime;
    clearInterval(timerInterval);
    timerRunning = false;
    document.querySelector('.circle')?.classList.remove('running');
    updateTimer();

    sessionStatus.innerHTML = `<span></span>Modo enfoque`;
    focusModeLabel.textContent = 'Enfocado';
    progressCircle.style.stroke = 'url(#gradientStroke)';

    if(focusSubtitle){
        focusSubtitle.textContent = task.title;
        focusSubtitle.classList.add('task-active');
    }

    startButton.innerHTML = `
        <i class="ri-play-fill"></i>
        Iniciar sesión
    `;

    const timerSection = document.querySelector('.focus-circle')?.closest('.dashboard-section') || document.querySelector('.focus-circle');
    if(timerSection){
        timerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setActiveSection('home');
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

        if(handleUnauthorized(response)) return;
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

            const raw = s.created_at;
            const hasTz = /[Zz]$|[+-]\d{2}:\d{2}$/.test(raw);
            const date = new Date(hasTz ? raw : raw + 'Z');

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

            let taskHtml = '';
            if(s.task_title){
                taskHtml = s.task_completed
                    ? `<span class="session-task completed">📋 ${s.task_title} ✅</span>`
                    : `<span class="session-task">📋 ${s.task_title}</span>`;
            }

            const awayHtml = s.away_minutes > 0
                ? `<span class="session-away" style="font-size:12px;color:#9ea4cf;">· ${s.away_minutes} min fuera</span>`
                : '';

            row.innerHTML = `
                <span class="session-date">${dateStr} · ${timeStr}</span>
                ${taskHtml}
                <span class="session-duration">${s.duration_minutes} min</span>
                <span class="session-mode ${modeClass}">${modeLabel}</span>
                ${awayHtml}
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
                'Enfoque profundo',
                'Estudio ligero',
                'Descansos',
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
   SETTINGS SYNC (Backend)
========================= */

async function syncSettingsToBackend(){
    const userId = getCurrentUserId();
    if(!userId) return;

    const data = {
        displayName: localStorage.getItem(`displayName_${userId}`) || '',
        petName: localStorage.getItem(`petName_${userId}`) || '',
        pomodoroDuration: parseInt(localStorage.getItem(`pomodoroDuration_${userId}`), 10) || 25,
        soundEnabled: localStorage.getItem(`soundEnabled_${userId}`) === 'true',
        onboardingCompleted: localStorage.getItem(`onboarding_${userId}`) === 'true',
    };

    try{
        await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ data }),
        });
    } catch(e){
        console.warn('No se pudieron sincronizar ajustes:', e);
    }
}

async function loadSettingsFromBackend(){
    const userId = getCurrentUserId();
    if(!userId) return;

    try{
        const res = await fetch(`${API_URL}/settings`, {
            headers: getAuthHeaders(),
        });
        if(!res.ok) return;
        const { data } = await res.json();

        if(!data || Object.keys(data).length === 0) return;

        if(data.displayName) localStorage.setItem(`displayName_${userId}`, data.displayName);
        if(data.petName) localStorage.setItem(`petName_${userId}`, data.petName);
        if(data.pomodoroDuration) localStorage.setItem(`pomodoroDuration_${userId}`, String(data.pomodoroDuration));
        if(data.soundEnabled !== undefined) localStorage.setItem(`soundEnabled_${userId}`, String(data.soundEnabled));
        if(data.onboardingCompleted) localStorage.setItem(`onboarding_${userId}`, 'true');

        loadUserInSidebar();
        loadPetName();
        loadSettings();
    } catch(e){
        console.warn('No se pudieron cargar ajustes del backend:', e);
    }
}

/* =========================
   LOAD USER INTO SIDEBAR
========================= */

function loadUserInSidebar(){

    const stored = localStorage.getItem('user');

    if(!stored) return;

    try{

        const userData = JSON.parse(stored);

        const displayName = localStorage.getItem(`displayName_${userData.id}`);
        const name =
            displayName || userData.email.split('@')[0] || userData.email;

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
   INLINE NAME EDIT
========================= */

function setupNameEdit(){

    const row = document.querySelector('.user-name-row');
    if(!row) return;

    /* Usamos delegación para no tener que re-attach tras editar */

    row.addEventListener('click', (e) => {

        const btn = e.target.closest('.edit-name-btn');
        if(!btn) return;

        const h3      = row.querySelector('h3');
        const edBtn   = row.querySelector('.edit-name-btn');
        if(!h3 || !edBtn) return;

        const currentName = h3.textContent;

        /* INPUT de edición */

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-name-input';
        input.value = currentName;

        /* Botón confirmar ✓ */

        const okBtn = document.createElement('button');
        okBtn.className = 'edit-name-confirm';
        okBtn.title = 'Guardar';
        okBtn.innerHTML = '<i class="ri-check-line"></i>';

        h3.replaceWith(input);
        edBtn.replaceWith(okBtn);

        input.focus();
        input.select();

        let done = false;

        function commit(){

            if(done) return;
            done = true;

            const userId = getCurrentUserId();
            if(!userId) return rollback();

            const val = input.value.trim();

            if(val){
                localStorage.setItem(`displayName_${userId}`, val);
            } else {
                localStorage.removeItem(`displayName_${userId}`);
            }

            syncSettingsToBackend();
            rollback();
            loadUserInSidebar();

        }

        function rollback(){

            const newH3 = document.createElement('h3');
            newH3.textContent = currentName;

            const newBtn = document.createElement('button');
            newBtn.className = 'edit-name-btn';
            newBtn.title = 'Editar nombre';
            newBtn.innerHTML = '<i class="ri-pencil-line"></i>';

            if(input.parentNode) input.replaceWith(newH3);
            if(okBtn.parentNode) okBtn.replaceWith(newBtn);

        }

        okBtn.addEventListener('click', commit);

        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') { e.preventDefault(); commit(); }
            if(e.key === 'Escape') { e.preventDefault(); rollback(); }
        });

        input.addEventListener('blur', commit);

    });

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

    if(document.hidden && timerRunning && !awayInterval){

        awayInterval = setInterval(() => { awaySeconds++; }, 1000);

    } else if(!document.hidden && awayInterval){

        clearInterval(awayInterval);
        awayInterval = null;

    }

});

/* =========================
   SETTINGS
========================= */

function loadSettings(){

    const userId = getCurrentUserId();

    if(!userId) return;

    const displayName = localStorage.getItem(`displayName_${userId}`);
    const pomodoroDuration = localStorage.getItem(`pomodoroDuration_${userId}`);
    const soundEnabled = localStorage.getItem(`soundEnabled_${userId}`);

    const nameInput = document.getElementById('displayNameInput');
    const pomoInput = document.getElementById('defaultPomodoroInput');
    const soundInput = document.getElementById('soundEnabledInput');

    if(nameInput && displayName){
        nameInput.value = displayName;
        const nameEl = document.querySelector('.user-info h3');
        if(nameEl) nameEl.textContent = displayName;
        const greetingEl = document.getElementById('greetingName');
        if(greetingEl) greetingEl.textContent = displayName;
    }

    if(pomoInput && pomodoroDuration){
        pomoInput.value = pomodoroDuration;
        const mins = parseInt(pomodoroDuration, 10);
        if(mins && !timerRunning){
            currentMode = mins;
            totalTime = mins * 60;
            timeLeft = totalTime;
            const display = document.getElementById('timerDisplay');
            if(display){
                const m = String(mins).padStart(2, '0');
                display.textContent = `${m}:00`;
            }
        }
    }

    if(soundInput && soundEnabled !== null){
        soundInput.checked = soundEnabled === 'true';
    }

}

const settingsForm = document.getElementById('settingsForm');

if(settingsForm){

    settingsForm.addEventListener('submit', (e) => {

        e.preventDefault();

        const userId = getCurrentUserId();

        if(!userId) return;

        const nameInput = document.getElementById('displayNameInput');
        const pomoInput = document.getElementById('defaultPomodoroInput');
        const soundInput = document.getElementById('soundEnabledInput');

        if(nameInput){
            localStorage.setItem(`displayName_${userId}`, nameInput.value);
            const nameEl = document.querySelector('.user-info h3');
            if(nameEl) nameEl.textContent = nameInput.value;
            const greetingEl = document.getElementById('greetingName');
            if(greetingEl) greetingEl.textContent = nameInput.value;
        }

        if(pomoInput){
            localStorage.setItem(`pomodoroDuration_${userId}`, pomoInput.value);
        }

        if(soundInput){
            localStorage.setItem(`soundEnabled_${userId}`, soundInput.checked);
        }

        syncSettingsToBackend();
        showToast('Ajustes guardados', 'success');

    });

}

/* =========================
   INITIALIZE
========================= */

updateTimer();

loadStats();

setBuddyMood('greeting');

renderMiniStreak([]);

loadStatsFromBackend();

loadUserInSidebar();

loadPetName();

setupNameEdit();

loadSettingsFromBackend().then(() => syncSettingsToBackend());

loadSettings();

fetchTasks();
