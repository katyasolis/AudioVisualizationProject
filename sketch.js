let ratio = 1.6;
let globeScale;
let mic, amplitude;

function setup() {
    createCanvas(window.innerWidth, window.innerWidth/ratio);
    globeScale = min(width, height);
    colorMode(HSB);

    mic = new p5.AudioIn();
    mic.start();

    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);
}

function draw() {
    background(210, 35, 100); 

    let level = amplitude.getLevel();

    let moveY = map(level, 0, 1, -50, 50)

    flower(width / 2, height / 2 + moveY);

    rainDrop();
 
}