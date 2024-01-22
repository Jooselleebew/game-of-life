"use strict";
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let dScale = 5;
let w = 0; // wiewport width
let h = 0; // wiewport height
let s = w * h;
let data1;
let data2;
let d1;
let d2;
function p2xy(p) {
    p /= 4;
    const x = p % w;
    const y = (p - x) / w;
    return [x, y];
}
function xy2p(x, y) {
    x = ((x % w) + w) % w;
    y = ((y % h) + h) % h;
    return (y * w + x) * 4;
}
let max = 0;
function nextPixelStep(life, x) {
    if (x > 2.5 && x < 3.5)
        return 1;
    return x > 1.5 && x < 2.5 && life ? 1 : 0;
}
function drawPixel(p) {
    const [x, y] = p2xy(p);
    let t = 0;
    for (let nx = -1; nx <= 1; nx++)
        for (let ny = -1; ny <= 1; ny++) {
            if (nx === 0 && ny === 0)
                continue;
            const px = x + nx;
            const py = y + ny;
            const pos = xy2p(px, py);
            t += d1[pos] & 1;
        }
    const d = d1[p] / 0xff;
    d2[p] = nextPixelStep(d, t) * 0xff;
    d2[p + 1] = !d1[p] ? 0 : d1[p + 1] + 1;
    d2[p + 2] = d2[p] < d1[p] ? 127 : d1[p + 2] - 1;
}
function draw() {
    for (let p = 0; p < s; p++) {
        drawPixel(p * 4);
    }
    context.putImageData(data2, 0, 0, 0, 0, w, h);
    [data1, data2] = [data2, data1];
    [d1, d2] = [d2, d1];
}
function init() {
    for (let x = 0; x < w; x++)
        for (let y = 0; y < h; y++) {
            context.fillStyle = Math.random() < 0.85 ? '#004' : '#f08';
            context.fillRect(x, y, 1, 1);
        }
    data1 = context.getImageData(0, 0, w, h);
    data2 = structuredClone(data1);
    d1 = data1.data;
    d2 = data2.data;
}
function loop() {
    context.clearRect(0, 0, w, h); // clear
    draw();
    setTimeout(loop);
}
function resize() {
    const scale = 1.2 ** dScale;
    w = canvas.width = Math.floor(window.innerWidth / scale);
    h = canvas.height = Math.floor(window.innerHeight / scale);
    canvas.style.scale = scale.toString();
    s = w * h;
    init();
}
function wheel(e) {
    const d = Math.sign(e.deltaY);
    dScale = Math.max(0, dScale + d);
    resize();
}
window.addEventListener('resize', resize);
window.addEventListener('wheel', wheel);
window.addEventListener('click', init);
resize();
loop();
document.body.append(canvas);