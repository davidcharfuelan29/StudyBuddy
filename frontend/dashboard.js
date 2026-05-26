console.log("StudyBuddy Dashboard Loaded");

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
   CHART.JS
========================= */

const chartCanvas =
    document.getElementById('studyChart');

if(chartCanvas){

    const ctxChart =
        chartCanvas.getContext('2d');

    new Chart(ctxChart, {

        type: 'line',

        data: {

            labels: [
                'L',
                'M',
                'X',
                'J',
                'V',
                'S',
                'D'
            ],

            datasets: [{

                data: [2, 4, 3, 5, 6, 4, 7],

                borderColor: '#7c5cff',

                backgroundColor: 'rgba(124,92,255,0.15)',

                borderWidth: 3,

                tension: 0.5,

                fill: true,

                pointRadius: 4,

                pointBackgroundColor: '#9f7bff',

                pointHoverRadius: 7,

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    }

                },

                y: {

                    beginAtZero: true,

                    grid: {

                        color: 'rgba(255,255,255,0.05)'

                    }

                }

            }

        }

    });

}

/* =========================
   INITIALIZE
========================= */

updateTimer();

loadStats();