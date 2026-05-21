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

const modeButtons =
    document.querySelectorAll('.mode-btn');

const sidebar =
    document.querySelector('.sidebar');

const sidebarToggle =
    document.getElementById('sidebarToggle');

/* =========================
   TIMER VARIABLES
========================= */

const radius = 130;

const circumference =
    2 * Math.PI * radius;

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

const buddyImage =
    document.getElementById('buddyImage');

function setBuddyMood(mood){

    if(mood === 'happy'){

        buddyImage.src =
            'assets/buddy-happy.png';

    }

    else if(mood === 'sleep'){

        buddyImage.src =
            'assets/buddy-sleep.png';

    }

    else if(mood === 'excited'){

        buddyImage.src =
            'assets/buddy-excited.png';

    }

    else if(mood === 'tired'){

        buddyImage.src =
            'assets/buddy-tired.png';

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

        consistencyElement.textContent = '92%';

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

            completeSound.play();

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
   POMODORO MODES
========================= */

modeButtons.forEach(button => {

    button.addEventListener('click', () => {

        /* REMOVE ACTIVE */

        modeButtons.forEach(btn => {

            btn.classList.remove('active');

        });

        /* ADD ACTIVE */

        button.classList.add('active');

        /* GET MODE TIME */

        const minutes =
            parseInt(button.dataset.time);

        currentMode = minutes;

        totalTime = minutes * 60;

        timeLeft = totalTime;

        /* RESET TIMER */

        clearInterval(timerInterval);

        timerRunning = false;

        document.querySelector('.circle')
            .classList.remove('running');


        updateTimer();

        /* CHANGE STATUS */

        if(minutes === 25){

            sessionStatus.innerHTML = `
                <span></span>
                Modo enfoque
            `;

            progressCircle.style.stroke =
                '#7c5cff';

        }

        else if(minutes === 5){

            sessionStatus.innerHTML = `
                <span></span>
                Descanso corto
                `;

                progressCircle.style.stroke =
                    '#34d399';

        }

        else{

            sessionStatus.innerHTML = `
                <span></span>
                Descanso largo
            `;

            progressCircle.style.stroke =
                '#f59e0b';

        }

        /* RESET BUTTON */

        startButton.innerHTML = `
            <i class="ri-play-fill"></i>
            Iniciar
        `;

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

                borderWidth: 3,

                tension: 0.5,

                fill: true,

                pointRadius: 4,

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