const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 20;
    this.angle = 0;
    this.rotation = 0;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      this.x + this.radius * Math.cos(this.angle),
      this.y - this.radius * Math.sin(this.angle)
    );
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.angle) + Math.sin(this.angle)),
      this.y + this.radius * (Math.sin(this.angle) - Math.cos(this.angle))
    );
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.angle) - Math.sin(this.angle)),
      this.y + this.radius * (Math.sin(this.angle) + Math.cos(this.angle))
    );
    ctx.closePath();
    ctx.stroke();
  }

  update() {
    if (this.thrusting) {
      this.thrust.x += 0.1 * Math.cos(this.angle);
      this.thrust.y -= 0.1 * Math.sin(this.angle);
    } else {
      this.thrust.x -= this.thrust.x * 0.02;
      this.thrust.y -= this.thrust.y * 0.02;
    }

    this.x += this.thrust.x;
    this.y += this.thrust.y;

    this.angle += this.rotation;

    // Handle screen edges
    if (this.x < 0 - this.radius) this.x = canvas.width + this.radius;
    if (this.x > canvas.width + this.radius) this.x = 0 - this.radius;
    if (this.y < 0 - this.radius) this.y = canvas.height + this.radius;
    if (this.y > canvas.height + this.radius) this.y = 0 - this.radius;
  }
}

const ship = new Ship();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ship.update();
  ship.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
