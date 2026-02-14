const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '0';
const starsDiv = document.getElementById('stars');
starsDiv.appendChild(canvas);
const ctx = canvas.getContext('2d');
let w, h, stars = [];
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
function Star() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * 1.2 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.dx = (Math.random() - 0.5) * 0.02;
    this.dy = (Math.random() - 0.5) * 0.02;
    this.twinkle = Math.random() * Math.PI * 2;
}
function createStars(num) {
    stars = [];
    for (let i = 0; i < num; i++) stars.push(new Star());
}
createStars(Math.floor(window.innerWidth / 4));
function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
        let s = stars[i];
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
        s.twinkle += 0.02 + Math.random() * 0.01;
        let twinkleAlpha = s.alpha + Math.sin(s.twinkle) * 0.25;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, twinkleAlpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }
    requestAnimationFrame(animate);
}
animate(); 