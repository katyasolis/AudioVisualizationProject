let ratio = 1.6;
let globeScale;

let mic, amplitude, startAudio, volSenseSlider;
let vol = 1;
let volSense = 100;
let slideStep = 10;

let midColor1, petalColor1, petalColor2;

function setup() {
    createCanvas(window.innerWidth, window.innerWidth / ratio);
    noLoop();
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    //flower colors
    midColor1 = color(50, 70, 100);
    petalColor1 = color(300, 80, 100);
    petalColor2 = color(200, 80, 100);

    //Audio Setup
    mic = new p5.AudioIn();
    mic.start();

    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);

    volSenseSlider = createSlider(0, 200, volSense, slideStep);
}

function draw() {
    background(210, 35, 100); 

    if (startAudio) {
        vol = mic.getLevel();

        volSense = volSenseSlider.value();
        normVol = vol * volSense;

        Amplitude();
    }


    flower(200, 200, 6, midColor1, petalColor1);
    flower(400, 200, 6, midColor1, petalColor2);

    //rainDrop();
 
}

function mousePressed() {
    getAudioContext().resume();
    if(!startAudio){
        mic = new p5.AudioIn();

        mic.start();
        startAudio = true;
    }
}

function Amplitude() {
    let level = amplitude.getLevel();

    let moveY = map(level, 0, 1, -50, 50);
}