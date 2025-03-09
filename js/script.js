const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let mouse = { x: null, y: null };

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = "rgba(184, 134, 11, 0.5)"; // To'q tilla rang (GoldenRod)
        this.dx = (Math.random() - 0.5) * 1;
        this.dy = (Math.random() - 0.5) * 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Ekrandan chiqib ketmaslik uchun
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        // Asl tezlikni saqlab qolish uchun boshlang'ich dx, dy qiymatlari
        this.originalDx = this.originalDx || this.dx;
        this.originalDy = this.originalDy || this.dy;

        // Sichqonchadan qochish effekti
        let distance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
        if (distance < 80) {
            this.dx += (this.x - mouse.x) * 0.01;
            this.dy += (this.y - mouse.y) * 0.01;
        } else {
            // Agar sichqoncha uzoqlashgan bo'lsa, asl tezlikka qaytarish
            this.dx += (this.originalDx - this.dx) * 0.05;
            this.dy += (this.originalDy - this.dy) * 0.05;
        }


        this.draw();
    }
}

// Yulduzlarni yaratish
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

// Yulduzlar orasidagi bog'lanishlarni chizish
function drawLines() {
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            let distance = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = "rgba(184, 134, 11, 0.3)";
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }
}

// Animatsiyani ishga tushirish
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    stars.forEach(star => star.update());
    requestAnimationFrame(animate);
}

// Sichqoncha harakatini yozib borish
window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Oyna o'lchami o'zgarsa, canvas hajmini yangilash
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    createStars();
});

// Boshlash
createStars();
animate();
