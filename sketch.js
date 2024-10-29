let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider;
let vol = 1;
let normVol;
let volSense = 100;
let slideStep = 10;
let startAudio = false;

let midColor1, petalColor1, petalColor2;

let raindrops = [];
let numRaindrops = 50;

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

    for (let i = 0; i < numRaindrops; i++) {
        raindrops.push(new Raindrop(random(width), random(height), 20, 40));
    }
}

function draw() {
    background(210, 35, 100); 

    let yOffset = 0;

    let rainDropyOffset = 0;

    if (startAudio) {
        vol = mic.getLevel();
        let spectrum = fft.analyze();
        let waveform = fft.waveform();

        volSense = volSenseSlider.value();
        normVol = vol * volSense;

<<<<<<< Updated upstream
        yOffset = map(normVol, 0, 1, 0, -100);
=======
        yOffset = map(normVol, 0, 1, 0, -50) * .375;
        yOffset2 = map(normVol, 0, 1, 0, -50) * .475;
        yOffset3 = map(normVol, 0, 1, 0, -50) * .575;

        //Constraint flowers to not go past the top of the screen
        yOffset = constrain(yOffset, -200, 0);
        yOffset2 = constrain(yOffset2, -200, 0);
        yOffset3 = constrain(yOffset3, -200, 0);

        baseHue1 = hue(petalColor1);
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
>>>>>>> Stashed changes
    }

    flower(200, 200 + yOffset, 6, midColor1, petalColor1);
    flower(400, 200 + yOffset, 6, midColor1, petalColor2); 

<<<<<<< Updated upstream
    rainDrop(width / 2, 0, 20, 40);
=======
    for (let raindrop of raindrops) {
        raindrop.update(rainDropyOffset);
        raindrop.display();
    }
    

>>>>>>> Stashed changes
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
