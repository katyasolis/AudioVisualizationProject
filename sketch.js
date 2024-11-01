let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider;
let vol = .25;
let normVol;
let volSense = 100;
let slideStep = 10;
let startAudio = false;

let midColor1, midColor2, petalColor1, petalColor2, petalColor3, stemColor1;
let canColor1, flameColor1;
let baseHue1, baseHue2, baseHue3;
let lowFreqHue, highFreqHue;

let raindrops = [];
let numRaindrops = 50;

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    // Set flower colors
    midColor1 = color(50, 70, 100);
    midColor2 = color(35, 70, 100);
    petalColor1 = color(300, 80, 100);
    petalColor2 = color(200, 80, 100);
    petalColor3 = color(100, 80, 100);
    stemColor1 = color(120, 100, 60);

    //candle color
    canColor1 = color(45, 25, 100);
    flameColor1 = color(25, 100, 100);
    

    volSenseSlider = createSlider(0, 200, volSense, slideStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.style('width', '400px');
    volSenseSlider.style('height', '20px');

    // Audio Setup
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);

    // Raindrop setup
    for (let i = 0; i < numRaindrops; i++) {
        raindrops.push(new Raindrop(random(width), random(height), 20, 40, random(1,5)));
    }
}

function draw() {
    background(210, 35, 100);

    let yOffset = 0;
    let yOffset2 = 0;
    let yOffset3 = 0;
    let yOffset4 = 0;
    let rainDropyOffset = 0;

    if (startAudio) {
        vol = mic.getLevel();
        let spectrum = fft.analyze();

        // Calculate low and high frequency averages
        let lowFreqAvg = 0;
        let highFreqAvg = 0;
        let lowFreqCount = 0;
        let highFreqCount = 0;

        for (let i = 0; i < spectrum.length; i++) {
            if (i < spectrum.length / 2) {
                lowFreqAvg += spectrum[i];
                lowFreqCount++;
            } else {
                highFreqAvg += spectrum[i];
                highFreqCount++;
            }
        }

        lowFreqAvg /= lowFreqCount;
        highFreqAvg /= highFreqCount;

        // Map frequency averages to hues
        lowFreqHue = map(lowFreqAvg, 0, 255, 190, 210);
        highFreqHue = map(highFreqAvg, 0, 255, 0, 50);

        // Gradient background based on frequency
        for (let y = 0; y < height; y++) {
            let inter = map(y, 0, height, 0, 1);
            let c = lerpColor(color(lowFreqHue, 100, 100), color(highFreqHue, 100, 100), inter);
            stroke(c);
            line(0, y, width, y);
        }

        volSense = volSenseSlider.value();
        normVol = vol * volSense;

        // Calculate yOffsets based on volume
        yOffset = map(normVol, 0, 1, 0, -60) * 0.175;
        yOffset2 = map(normVol, 0, 1, 0, -100) * 0.275;
        yOffset3 = map(normVol, 0, 1, 0, -75) * 0.375;
        yOffset4 = map(normVol, 0, 1, 0, -140) * 0.475;

        // Constrain yOffsets to not exceed the screen height
        yOffset = constrain(yOffset, -window.innerHeight + 10, 0);
        yOffset2 = constrain(yOffset2, -window.innerHeight + 10, 0);
        yOffset3 = constrain(yOffset3, -window.innerHeight + 10, 0);
        yOffset4 = constrain(yOffset4, -window.innerHeight + 10, 0);

        rainDropyOffset = map(normVol, 0, 1, 0, 5);

        // Adjust base hues for petal colors based on volume
        baseHue1 = (hue(petalColor1) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue2 = (hue(petalColor2) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue3 = (hue(petalColor3) + map(normVol, 0, 1, -10, 10)) % 360;

        // Update petal colors with new hues
        petalColor1 = color(baseHue1, 100, 100);
        petalColor2 = color(baseHue2, 100, 100);
        petalColor3 = color(baseHue3, 100, 100);
    }

    // Draw flowers
    flower(100, (window.innerHeight + 75) + yOffset, 250, 6, midColor1, petalColor1, stemColor1);
    flower(200, (window.innerHeight + 100) + yOffset, 100, 8, midColor1, petalColor1, stemColor1);
    flower(300, (window.innerHeight + 25) + yOffset3, 150, 6, midColor2, petalColor3, stemColor1);
    flower(400, (window.innerHeight + 50) + yOffset4, 200, 5, midColor2, petalColor2, stemColor1);
    flower(600, (window.innerHeight + 25) + yOffset3, 150, 6, midColor1, petalColor3, stemColor1);
    flower(800, (window.innerHeight + 75) + yOffset, 250, 7, midColor2, petalColor1, stemColor1);
    flower(900, (window.innerHeight + 100) + yOffset, 100, 6, midColor2, petalColor1, stemColor1);
    flower(1000, (window.innerHeight + 50) + yOffset2, 150, 6, midColor1, petalColor2, stemColor1);
    flower(1050, (window.innerHeight + 25) + yOffset4, 200, 4, midColor1, petalColor3, stemColor1);
    flower(1200, (window.innerHeight + 25) + yOffset3, 200, 6, midColor2, petalColor3, stemColor1);
    flower(1300, (window.innerHeight + 75) + yOffset, 100, 9, midColor1, petalColor1, stemColor1);

    //Draw candles
    candle(200, window.innerHeight, 100, canColor1, flameColor1);

    // Update and display raindrops
    for (let raindrop of raindrops) {
        raindrop.update(rainDropyOffset);
        raindrop.display();
    }
}

function mousePressed() {
    getAudioContext().resume().then(() => {
        if (!startAudio) {
            mic.start();
            startAudio = true;
            loop();
        }
    });
}