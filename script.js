const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replay");
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const boy = document.getElementById("boy");
const scene3 = document.getElementById("scene3");
const scene4 = document.getElementById("scene4");
const message = document.getElementById("message");
const scene4El = scene4;
const ask = document.getElementById("ask");
const answers = document.getElementById("answers");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const actName = document.getElementById("actName");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Posición final del chico: el lugar donde aparece sentado junto a la chica
const BOY_STOP = "42cqw"; // justo donde queda sentado en la escena 3

async function play() {
    startButton.disabled = true;
    document.body.classList.add("opening");
    await wait(2200);

    // Escena 1: el chico en moto, de izquierda a derecha
    actName.textContent = "El camino";
    scene1.classList.add("active");
    await wait(7200);

    // Escena 2: llega caminando hasta la chica
    scene1.classList.remove("active");
    actName.textContent = "El encuentro";
    scene2.classList.add("active");
    await wait(1400);
    boy.style.left = BOY_STOP;
    await wait(6700);

    // Escena 3: ya juntos, aparece el mensaje
    boy.classList.add("arrived");
    await wait(600);
    actName.textContent = "La noche";
    scene3.classList.add("active");
    scene2.classList.remove("active");
    await wait(1500);
    message.classList.add("show");
    await wait(9000);

    // Termina el mensaje -> Escena 4
    message.classList.remove("show");
    await wait(2200);
    actName.textContent = "Para siempre";
    scene4.classList.add("active");
    scene3.classList.remove("active");
    await wait(2500);
    ask.classList.add("show");
}

// ---- El botón "No" huye: no se puede presionar ----
let pointer = { x: -999, y: -999 };

function dodge() {
    const sr = scene4El.getBoundingClientRect();
    const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
    if (!noBtn.classList.contains("loose")) {
        const r = noBtn.getBoundingClientRect();
        scene4El.appendChild(noBtn);
        noBtn.classList.add("loose");
        noBtn.style.left = (r.left - sr.left) + "px";
        noBtn.style.top = (r.top - sr.top) + "px";
        void noBtn.offsetWidth;
    }
    const yr = yesBtn.getBoundingClientRect();
    let best = null;
    for (let i = 0; i < 30; i++) {
        const x = 12 + Math.random() * (sr.width - bw - 24);
        const y = sr.height * 0.4 + Math.random() * (sr.height * 0.6 - bh - 12);
        const cx = sr.left + x + bw / 2, cy = sr.top + y + bh / 2;
        const farFromPointer = Math.hypot(cx - pointer.x, cy - pointer.y) > 160;
        const overYes = cx > yr.left - bw && cx < yr.right + bw && cy > yr.top - bh && cy < yr.bottom + bh;
        best = { x, y };
        if (farFromPointer && !overYes) break;
    }
    noBtn.style.left = best.x + "px";
    noBtn.style.top = best.y + "px";
}

function nearNo(e) {
    pointer = { x: e.clientX, y: e.clientY };
    if (!ask.classList.contains("show") || ask.classList.contains("done")) return;
    const r = noBtn.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (d < 110) dodge();
}

scene4El.addEventListener("pointermove", nearNo);
scene4El.addEventListener("pointerdown", nearNo);
noBtn.addEventListener("pointerenter", dodge);
noBtn.addEventListener("focus", () => { dodge(); noBtn.blur(); });
noBtn.addEventListener("click", (e) => { e.preventDefault(); dodge(); });

yesBtn.addEventListener("click", () => {
    noBtn.style.display = "none";
    ask.classList.add("done");
    setTimeout(() => replayButton.classList.add("show"), 3000);
});

function reset() {
    ask.classList.remove("show", "done");
    noBtn.classList.remove("loose");
    noBtn.removeAttribute("style");
    answers.appendChild(noBtn);
    replayButton.classList.remove("show");
    message.classList.remove("show");
    boy.classList.remove("arrived");
    boy.style.transition = "none";
    boy.style.left = "";
    void boy.offsetWidth;
    boy.style.transition = "";
    scene4.classList.remove("active");
    scene3.classList.remove("active");
    scene2.classList.remove("active");
    scene1.classList.remove("active");
    void scene1.offsetWidth;
    actName.textContent = "El comienzo";
    document.body.classList.remove("opening");
    startButton.disabled = false;
}

startButton.addEventListener("click", play);
replayButton.addEventListener("click", reset);