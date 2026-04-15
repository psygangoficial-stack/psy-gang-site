const canvas = document.getElementById("psy-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let ufos = [];
const COUNT = 25; // leve e fluido

class UFO {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 20 + 10;

        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;

        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += 0.02;

        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.angle) * 0.2);

        // glow leve
        ctx.shadowColor = "#00ffcc";
        ctx.shadowBlur = 15;

        // BASE
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffcc";
        ctx.globalAlpha = 0.6;
        ctx.fill();

        ctx.globalAlpha = 1;

        // CABINE
        ctx.beginPath();
        ctx.ellipse(0, -this.size / 6, this.size / 3, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#66fff0";
        ctx.fill();

        // LUZES FIXAS (não random a cada frame)
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.arc(i * (this.size / 4), this.size / 6, 2, 0, Math.PI * 2);
            ctx.fillStyle = "#ff00cc";
            ctx.fill();
        }

        ctx.restore();
    }
}

function init() {
    ufos = [];
    for (let i = 0; i < COUNT; i++) {
        ufos.push(new UFO());
    }
}

function animate() {
    // fundo com leve transparência (efeito rastro + visível)
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ufos.forEach(u => {
        u.update();
        u.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    resizeCanvas();
    init();
});

init();
animate();