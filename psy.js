const canvas = document.getElementById("psy-bg");
const ctx = canvas.getContext("2d");

let w, h;

let aliens = Array.from({length: 6}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  size: 12 + Math.random() * 8,
  speedY: 0.2 + Math.random() * 0.3,
  float: Math.random() * 100
}));

function drawAlien(a) {
  ctx.save();
  ctx.translate(a.x, a.y);

  let floatY = Math.sin(a.float) * 5;
  ctx.translate(0, floatY);

  ctx.shadowColor = "#00ffcc";
  ctx.shadowBlur = 10;

  // cabeça
  ctx.beginPath();
  ctx.ellipse(0, 0, a.size/1.5, a.size, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffcc";
  ctx.fill();

  // olhos
  ctx.beginPath();
  ctx.ellipse(-a.size/4, -2, 3, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(a.size/4, -2, 3, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  ctx.restore();
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();

/* ===== PARALLAX (MOUSE) ===== */
let mouse = { x: w/2, y: h/2 };

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* ===== ESTRELAS ===== */
let stars = Array.from({length: 120}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  size: Math.random() * 2,
  depth: Math.random()
}));

/* ===== NEBULOSA ===== */
function drawNebula() {
  let grad = ctx.createRadialGradient(
    mouse.x, mouse.y, 100,
    mouse.x, mouse.y, 600
  );

  grad.addColorStop(0, "rgba(0,255,200,0.15)");
  grad.addColorStop(0.3, "rgba(0,150,255,0.08)");
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/* ===== PLANETA ===== */
let planetAngle = 0;

function drawPlanet() {
  let x = w * 0.8;
  let y = h * 0.2;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(planetAngle);

  // gradiente profundo
  let grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
  grad.addColorStop(0, "#00ffcc");
  grad.addColorStop(0.4, "#009977");
  grad.addColorStop(1, "#001a14");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.fill();

  // manchas (efeito planeta real)
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.sin(i) * 30,
      Math.cos(i) * 20,
      15,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0,255,200,0.05)";
    ctx.fill();
  }

  // anel mais elegante
  ctx.strokeStyle = "rgba(0,255,200,0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 130, 45, 0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  planetAngle += 0.0015;
}

/* ===== UFO NORMAL ===== */
let ufos = Array.from({length: 6}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  size: 15 + Math.random()*10,
  speedX: (Math.random() - 0.5) * 0.3,
  speedY: (Math.random() - 0.5) * 0.3
}));

function drawUFO(u) {
  ctx.save();
  ctx.translate(u.x, u.y);

  ctx.shadowColor = "#00ffcc";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.ellipse(0, 0, u.size, u.size/3, 0, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,255,200,0.6)";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, -u.size/5, u.size/3, u.size/4, 0, 0, Math.PI*2);
  ctx.fillStyle = "#66fff0";
  ctx.fill();

  ctx.restore();
}

/* ===== FLY-BY (NAVE RÁPIDA) ===== */
let fly = null;

function spawnFly() {
  fly = {
    x: -200,
    y: Math.random() * h,
    speed: 15
  };
}

function drawFly() {
  if (!fly) return;

  ctx.beginPath();
  ctx.moveTo(fly.x, fly.y);
  ctx.lineTo(fly.x - 120, fly.y + 20);

  ctx.strokeStyle = "rgba(0,255,200,0.5)";
  ctx.lineWidth = 3;
  ctx.stroke();

  fly.x += fly.speed;

  if (fly.x > w + 200) fly = null;
}

/* ===== LOOP ===== */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, w, h);

  /* estrelas com parallax */
  stars.forEach(s => {
    let dx = (mouse.x - w/2) * s.depth * 0.02;
    let dy = (mouse.y - h/2) * s.depth * 0.02;

    ctx.beginPath();
    ctx.arc(s.x + dx, s.y + dy, s.size, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  });

  aliens.forEach(a => {
  a.y += a.speedY;
  a.float += 0.05;

  if (a.y > h + 50) {
    a.y = -50;
    a.x = Math.random() * w;
  }

  drawAlien(a);
});

  drawNebula();
  drawPlanet();

  ufos.forEach(u => {
    u.x += u.speedX;
    u.y += u.speedY;
    drawUFO(u);
  });

  drawFly();

  if (!fly && Math.random() < 0.005) spawnFly();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

animate();
