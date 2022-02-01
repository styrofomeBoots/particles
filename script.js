const canvas = document.querySelector(".particle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lineDistanceX = canvas.width / 7;
const lineDistanceY = canvas.height / 7;
let particlesArray;

const mouse = {
  x: null,
  y: null,
  radius: (canvas.width / 100) * (canvas.height / 100),
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mouse.radius = (canvas.width / 100) * (canvas.height / 100);
  init();
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    (this.x = x), (this.y = y);
    (this.directionX = directionX),
      (this.directionY = directionY),
      (this.size = size),
      (this.color = color);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#16222A";
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    const distanceX = mouse.x - this.x;
    const distanceY = mouse.y - this.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function init() {
  particlesArray = [];
  const numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    const y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    const directionX = Math.random() * 5 - 2.5;
    const directionY = Math.random() * 5 - 2.5;
    const color = "#16222A";
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

function connect() {
  for (const mainParticle of particlesArray) {
    for (const otherParticle of particlesArray) {
      const distance =
        (mainParticle.x - otherParticle.x) *
          (mainParticle.x - otherParticle.x) +
        (mainParticle.y - otherParticle.y) * (mainParticle.y - otherParticle.y);
      if (distance < lineDistanceX * lineDistanceY) {
        const opacity = 1 - distance / 10000;
        ctx.strokeStyle = `rgba(22, 34, 42, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(mainParticle.x, mainParticle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const particle of particlesArray) {
    particle.update();
  }
  connect();
}

init();
animate();
