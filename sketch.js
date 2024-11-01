let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider, numRaindropsSlider;
let vol = 0.25;
let normVol;
let volSense = 100;
let slideStep = 10;
let startAudio = false;

let midColor1, midColor2, petalColor1, petalColor2, petalColor3, stemColor1;
let canColor1, flameColor1, canColor2, flameColor2, canColor3, flameColor3;
let baseHue1, baseHue2, baseHue3;
let lowFreqHue, highFreqHue;

let raindrops = [];
let numRaindrops = 50;

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    // Set flower and candle colors
    midColor1 = color(50, 70, 100);
    midColor2 = color(35, 70, 100);
    petalColor1 = color(300, 80, 100);
    petalColor2 = color(200, 80, 100);
    petalColor3 = color(100, 80, 100);
    stemColor1 = color(120, 100, 60);
    canColor1 = color(45, 25, 100);
    canColor2 = color(10, 35, 100);
    canColor3 = color(300, 30, 100);
    flameColor1 = color(25, 100, 100);
    flameColor2 = color(75, 80, 100);
    flameColor3 = color(150, 50, 100);

    volSenseSlider = createSlider(0, 200, volSense, slideStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.style('width', '400px');
    volSenseSlider.style('height', '20px');

    numRaindropsSlider = createSlider(10, 200, numRaindrops, slideStep);
    numRaindropsSlider.position(10, 50);
    numRaindropsSlider.style('width', '400px');
    numRaindropsSlider.style('height', '20px');
    numRaindropsSlider.class('slider-raindrop');

    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);

    for (let i = 0; i < numRaindrops; i++) {
        raindrops.push(new Raindrop(random(width), random(height), 20, 40, random(1, 5)));
    }
}

function draw() {
    background(210, 35, 100);

    let yOffset = 0, yOffset2 = 0, yOffset3 = 0, yOffset4 = 0, rainDropyOffset = 0;

    if (startAudio) {
        vol = mic.getLevel();
        let spectrum = fft.analyze();

        let lowFreqAvg = 0, highFreqAvg = 0, lowFreqCount = 0, highFreqCount = 0;

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

        lowFreqHue = map(lowFreqAvg, 0, 255, 190, 210);
        highFreqHue = map(highFreqAvg, 0, 255, 0, 50);

        for (let y = 0; y < height; y++) {
            let inter = map(y, 0, height, 0, 1);
            let c = lerpColor(color(lowFreqHue, 100, 100), color(highFreqHue, 100, 100), inter);
            stroke(c);
            line(0, y, width, y);
        }

        volSense = volSenseSlider.value();
        let targetNumRaindrops = numRaindropsSlider.value();
        normVol = vol * volSense;

        yOffset = map(normVol, 0, 1, 0, -60) * 0.175;
        yOffset2 = map(normVol, 0, 1, 0, -100) * 0.275;
        yOffset3 = map(normVol, 0, 1, 0, -75) * 0.375;
        yOffset4 = map(normVol, 0, 1, 0, -140) * 0.475;
        rainDropyOffset = map(normVol, 0, 1, 0, 5);

        if (raindrops.length < targetNumRaindrops) {
            for (let i = raindrops.length; i < targetNumRaindrops; i++) {
                raindrops.push(new Raindrop(random(width), random(height), 20, 40, random(1, 5)));
            }
        } else if (raindrops.length > targetNumRaindrops) {
            raindrops.splice(targetNumRaindrops);
        }

        for (let raindrop of raindrops) {
            raindrop.update(rainDropyOffset);
            raindrop.display();
        }

        baseHue1 = (hue(petalColor1) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue2 = (hue(petalColor2) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue3 = (hue(petalColor3) + map(normVol, 0, 1, -10, 10)) % 360;

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
     candle(100, (window.innerHeight + 75) + yOffset, 100, canColor1, flameColor1);
     candle(150, (window.innerHeight + 100) + yOffset3 , 50, canColor2, flameColor1);
     candle(350, (window.innerHeight + 30) + yOffset2, 200, canColor3, flameColor2);
     candle(400, (window.innerHeight + 50) + yOffset4, 75, canColor2, flameColor1);
     candle(550, (window.innerHeight + 80) + yOffset, 55, canColor1, flameColor3);
     candle(650, (window.innerHeight + 90) + yOffset2, 30, canColor1, flameColor2);
     candle(750, (window.innerHeight + 120) + yOffset4, 130, canColor2, flameColor2);
     candle(875, (window.innerHeight + 25) + yOffset4, 65, canColor3, flameColor1);
     candle(900, (window.innerHeight + 90) + yOffset4, 75, canColor2, flameColor1);
     candle(1000, (window.innerHeight + 30) +yOffset, 140, canColor3, flameColor3);
     candle(1150, (window.innerHeight + 80) + yOffset3, 55, canColor1, flameColor2);
     candle(1250, (window.innerHeight + 75) + yOffset, 190, canColor3, flameColor1);

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