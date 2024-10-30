let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider;
let vol = .25;
let normVol;
let volSense = 100;
let slideStep = 10;
let startAudio = false;

let midColor1, midColor2, petalColor1, petalColor2, petalColor3, stemColor1;
let baseHue1, baseHue2, baseHue3;

let raindrops = [];
let numRaindrops = 50;

function setup() {
    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    //flower colors
    midColor1 = color(50, 70, 100);
    midColor2 = color(35, 70, 100);
    petalColor1 = color(300, 80, 100);
    petalColor2 = color(200, 80, 100);
    petalColor3 = color(100, 80, 100);
    stemColor1 = color(120, 100, 60);

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
    let yOffset2 = 0;
    let yOffset3 = 0;

    let rainDropyOffset = 0;

    if (startAudio) {
        vol = mic.getLevel();
        //let spectrum = fft.analyze();
        //let waveform = fft.waveform();

        volSense = volSenseSlider.value();
        normVol = vol * volSense;

        yOffset = map(normVol, 0, 1, 0, -50) * .175;
        yOffset2 = map(normVol, 0, 1, 0, -50) * .275;
        yOffset3 = map(normVol, 0, 1, 0, -50) * .375;

        //Constraint flowers to not go past the top of the screen
        yOffset = constrain(yOffset, -window.innerHeight + 10, 0);
        yOffset2 = constrain(yOffset2, -window.innerHeight + 10, 0);
        yOffset3 = constrain(yOffset3, -window.innerHeight + 10, 0);

       /* baseHue1 = hue(petalColor1);
        baseHue2 = hue(petalColor2);
        baseHue3 = hue(petalColor3);

        // Adjust the hue value based on the sound input
        baseHue1 = (baseHue1 + map(normVol, 0, 1, -10, 10)) % 50;
        baseHue2 = (baseHue2 + map(normVol, 0, 1, -10, 10)) % 50;
        baseHue3 = (baseHue3 + map(normVol, 0, 1, -10, 10)) % 50;

        // Set the petal colors based on the base hue value
        /*petalColor1 = color(baseHue1, 100, 100);
        petalColor2 = color(baseHue2, 100, 100);
        petalColor3 = color(baseHue3, 100, 100);*/

        rainDropyOffset = map(normVol, 0, 1, 0, 5);
    }

    // Draw the flowers
    flower(100, (window.innerHeight + 75) + yOffset, 250, 6, midColor1, petalColor1, stemColor1);
    flower(200, (window.innerHeight + 100) + yOffset, 100, 6, midColor1, petalColor1, stemColor1);
    flower(300, (window.innerHeight + 25) + yOffset3, 150, 6, midColor2, petalColor3, stemColor1);
    flower(400, (window.innerHeight + 50) + yOffset2, 200, 6, midColor2, petalColor2, stemColor1); 
    flower(600, (window.innerHeight + 25) + yOffset3, 150, 6, midColor1, petalColor3, stemColor1);
    flower(800, (window.innerHeight + 75) + yOffset, 250, 6, midColor2, petalColor1, stemColor1);
    flower(900, (window.innerHeight + 100) + yOffset, 100, 6, midColor2, petalColor1, stemColor1);
    flower(1000, (window.innerHeight + 50) + yOffset2, 150, 6, midColor1, petalColor2, stemColor1);
    flower(1050, (window.innerHeight + 25) + yOffset3, 200, 6, midColor1, petalColor3, stemColor1);
    flower(1200, (window.innerHeight + 25) + yOffset3, 200, 6, midColor2, petalColor3, stemColor1);
    flower(1300, (window.innerHeight + 75) + yOffset, 100, 6, midColor1, petalColor1, stemColor1);


    for (let raindrop of raindrops) {
        raindrop.update(rainDropyOffset);
        raindrop.display();
    }

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