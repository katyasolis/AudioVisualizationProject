let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider;
let vol = 1;
let normVol;
let volSense = 100;
let slideStep = 10;
let startAudio = false;

let midColor1, petalColor1, petalColor2;

function setup() {
    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    //flower colors
    midColor1 = color(50, 70, 100);
    petalColor1 = color(300, 80, 100);
    petalColor2 = color(200, 80, 100);

    volSenseSlider = createSlider(0, 200, volSense, slideStep);

    //Audio Setup
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}

function draw() {
    background(210, 35, 100); 

    let yOffset = 0;

    if (startAudio) {
        vol = mic.getLevel();
        //let spectrum = fft.analyze();
        //let waveform = fft.waveform();

        volSense = volSenseSlider.value();
        normVol = vol * volSense;

        yOffset = map(normVol, 0, 1, 0, -100);
    }

    flower(200, 200 + yOffset, 6, midColor1, petalColor1);
    flower(400, 200 + yOffset, 6, midColor1, petalColor2); 
}

function mousePressed() {
    getAudioContext().resume().then(() => {
    if(!startAudio){
        mic.start();
        startAudio = true;
        loop();
    }
});
}