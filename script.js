
// ========================================
// FONDO DE CORAZONES
// ========================================

const background = document.getElementById("background");

for (let i = 0; i < 28; i++) {
    const heart = document.createElement("div");

    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (12 + Math.random() * 20) + "px";
    heart.style.animationDuration = (6 + Math.random() * 8) + "s";
    heart.style.animationDelay = Math.random() * 8 + "s";

    background.appendChild(heart);
}


// ========================================
// MOVIMIENTO 3D DEL REGALO
// ========================================

const scene = document.getElementById("scene");
const gift = document.getElementById("gift");
const intro = document.getElementById("intro");

let rotationX = -15;
let rotationY = -25;

let dragging = false;
let moved = false;
let startX = 0;
let startY = 0;

let opened = false;

function updateGift() {
    gift.style.transform =
        `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

scene.addEventListener("pointerdown", (e) => {
    if (opened) return;

    dragging = true;
    moved = false;

    startX = e.clientX;
    startY = e.clientY;

    scene.setPointerCapture(e.pointerId);
});

scene.addEventListener("pointermove", (e) => {
    if (!dragging || opened) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) + Math.abs(dy) > 5) {
        moved = true;
    }

    rotationY += dx * 0.8;
    rotationX -= dy * 0.5;

    rotationX = Math.max(-65, Math.min(65, rotationX));

    startX = e.clientX;
    startY = e.clientY;

    updateGift();
});

scene.addEventListener("pointerup", () => {
    if (!dragging) return;

    dragging = false;

    if (!moved && !opened) {
        openGift();
    }
});

scene.addEventListener("pointercancel", () => {
    dragging = false;
});


// ========================================
// ABRIR EL REGALO
// ========================================

function openGift() {
    if (opened) return;

    opened = true;

    // Abrir tapa
    gift.classList.add("open");

    // Entrar al regalo
    setTimeout(() => {
        intro.classList.add("entering");
    }, 500);

    // Pantalla negra
    setTimeout(() => {
        const celebration =
            document.getElementById("celebration");

        celebration.classList.add("active");

        startFireworks();

        birthdaySequence();
    }, 1500);
}


// ========================================
// CUENTA REGRESIVA Y FELICITACIÓN
// ========================================

const wait = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

async function birthdaySequence() {

    const countdown = document.getElementById("countdown");

    // Cuenta regresiva
    for (let number of ["3", "2", "1"]) {

        countdown.textContent = number;
        countdown.classList.remove("pop");

        void countdown.offsetWidth;

        countdown.classList.add("pop");

        await wait(1100);
    }

    countdown.textContent = "";

    // FELIZ
    const word1 = document.getElementById("word1");
    word1.classList.add("show");

    await wait(1100);

    // CUMPLEAÑOS
    const word2 = document.getElementById("word2");
    word2.classList.add("show");

    await wait(1400);

    // SAMMY
    const word3 = document.getElementById("word3");
    word3.classList.add("show");

    await wait(3200);

    // Ocultar texto para presentar el dibujo
    document.getElementById("birthdayText")
        .style.transition = "opacity 1s";

    document.getElementById("birthdayText")
        .style.opacity = "0";

    await wait(1100);

    // Aparece el perrito
    document.getElementById("puppySection")
        .classList.add("show");
}


// ========================================
// FUEGOS ARTIFICIALES
// ========================================

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];
let rockets = [];
let fireworksRunning = false;

const colors = [
    "#ff4d6d",
    "#ff6b9d",
    "#ff9fc5",
    "#ffd0e1",
    "#e83e70",
    "#ff1744",
    "#ffb3c9"
];

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// Crear cohete
function createRocket() {
    const x = Math.random() * window.innerWidth;
    const targetY = window.innerHeight *
        (0.15 + Math.random() * 0.45);

    rockets.push({
        x: x,
        y: window.innerHeight + 10,
        targetY: targetY,
        speed: 5 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}


// Explosión
function explode(x, y, color) {

    const count = 65 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 5;

        particles.push({
            x: x,
            y: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            alpha: 1,
            radius: 1 + Math.random() * 2.5,

            color: Math.random() > 0.3
                ? color
                : colors[Math.floor(Math.random() * colors.length)]
        });
    }
}


// Animación
function animateFireworks() {

    if (!fireworksRunning) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Crear nuevos cohetes
    if (Math.random() < 0.055) {
        createRocket();
    }

    // Dibujar cohetes
    for (let i = rockets.length - 1; i >= 0; i--) {

        const rocket = rockets[i];

        rocket.y -= rocket.speed;

        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);

        ctx.fillStyle = rocket.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = rocket.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (rocket.y <= rocket.targetY) {

            explode(rocket.x, rocket.y, rocket.color);

            rockets.splice(i, 1);
        }
    }

    // Dibujar partículas
    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.035;
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.alpha -= 0.009;

        ctx.globalAlpha = Math.max(0, p.alpha);

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(animateFireworks);
}


// Iniciar espectáculo
function startFireworks() {

    if (fireworksRunning) return;

    fireworksRunning = true;

    // Primeras explosiones
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            if (!fireworksRunning) return;

            explode(
                window.innerWidth * (0.15 + Math.random() * 0.7),
                window.innerHeight * (0.15 + Math.random() * 0.4),
                colors[Math.floor(Math.random() * colors.length)]
            );

        }, i * 350);
    }

    animateFireworks();
}
