let ratio = 1.6;
let globeScale;

function setup() {
    createCanvas(window.innerWidth, window.innerWidth/ratio);
    globeScale = min(width, height);
    colorMode(HSB);

}

function draw() {
    background(210, 35, 70);

    flower();
}