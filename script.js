const canvas = document.getElementById("psy-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

let particles = [];
const PARTICLE_COUNT = 90;

let mouse = {
  x: null,
  y: null,
  radius: 120
};

/* INTERAÇÃO MOUSE + TOQUE */
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

/* PARTICULA */
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;

    this.speedX = (Math.random() - 0.5) * 0.7;
    this.speedY = (Math.random() - 0.5) * 0.7;

    this.hue = Math.random() * 360;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    /* rebater nas bordas */
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    /* interação com mouse */
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        this.x += dx / 10;
        this.y += dy / 10;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
    ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
    ctx.shadowBlur = 20;

    ctx.fill();
  }
}

/* CONECTAR PARTÍCULAS */
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < 12000) {
        let opacity = 1 - distance / 12000;

        ctx.strokeStyle = `rgba(0,255,200,${opacity})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

/* INIT */
function init() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

/* LOOP */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();

  requestAnimationFrame(animate);
}

/* RESPONSIVO */
window.addEventListener("resize", () => {
  resizeCanvas();
  init();
});

/* START */
init();
animate();

/* EFEITO INTERATIVO NOS BOTÕES */
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btn.style.setProperty("--x", `${x}px`);
    btn.style.setProperty("--y", `${y}px`);
  });
});