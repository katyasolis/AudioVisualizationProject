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

let displayFlowers = true; // Variable to track whether to display flowers or candles
let switchInterval = 10000; // Interval to switch between flowers and candles (in milliseconds)
let lastSwitchTime = 0; // Track the last switch time
let growthFactor = 1; // Growth factor for flames

let particleSystem

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    particleSystem = new ParticleSystem();
    
    // Set flower colors
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

    // Volume Sensitivity Slider for flowers & background
    volSenseSlider = createSlider(0, 200, volSense, slideStep);
    volSenseSlider.position(10, 10);
    volSenseSlider.style('width', '400px');
    volSenseSlider.style('height', '20px');

    // sensitivity slider for # of raindrops
    numRaindropsSlider = createSlider(10, 200, numRaindrops, slideStep);
    numRaindropsSlider.position(10, 50); // Position the slider below the volume sensitivity slider
    numRaindropsSlider.style('width', '400px');
    numRaindropsSlider.style('height', '20px');
    numRaindropsSlider.class('slider-raindrop');


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
        let waveform = fft.waveform();

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
        let targetNumRaindrops = numRaindropsSlider.value();
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

          // Adjust the number of raindrops based on the slider value
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

        // Adjust base hues for petal colors based on volume
        baseHue1 = (hue(petalColor1) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue2 = (hue(petalColor2) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue3 = (hue(petalColor3) + map(normVol, 0, 1, -10, 10)) % 360;

        // Update petal colors with new hues
        petalColor1 = color(baseHue1, 100, 100);
        petalColor2 = color(baseHue2, 100, 100);
        petalColor3 = color(baseHue3, 100, 100);
    }

    // Switch between displaying flowers and candles based on the timer
    if (millis() - lastSwitchTime > switchInterval) {
        displayFlowers = !displayFlowers;
        lastSwitchTime = millis();
        growthFactor = 1; // Reset growth factor when switching to candles
        if (!displayFlowers) {
            particleSystem.addParticle(width / 2, height / 2, 50, color(255, 204, 0)); // Trigger explosion
        }
    }

    // Update growth factor
    if (!displayFlowers) {
        growthFactor += 0.01; // Only update growth factor for flames
    }

if (displayFlowers) {
    // Draw flowers at different positions with updated colors and offsets
    flower(width * 0.1, height - 125 + yOffset, 250, 6, midColor1, petalColor1, stemColor1);
    flower(width * 0.2, height - 150 + yOffset, 100, 8, midColor1, petalColor1, stemColor1);
    flower(width * 0.3, height - 75 + yOffset3, 150, 6, midColor2, petalColor3, stemColor1);
    flower(width * 0.4, height - 100 + yOffset4, 200, 5, midColor2, petalColor2, stemColor1);
    flower(width * 0.5, height - 75 + yOffset3, 150, 6, midColor1, petalColor3, stemColor1);
    flower(width * 0.6, height - 125 + yOffset, 250, 7, midColor2, petalColor1, stemColor1);
    flower(width * 0.7, height - 150 + yOffset, 100, 6, midColor2, petalColor1, stemColor1);
    flower(width * 0.8, height - 100 + yOffset2, 150, 6, midColor1, petalColor2, stemColor1);
    flower(width * 0.85, height - 75 + yOffset3, 200, 4, midColor1, petalColor3, stemColor1);
    flower(width * 0.9, height - 75 + yOffset3, 200, 6, midColor2, petalColor3, stemColor1);
    flower(width * 0.95, height - 125 + yOffset, 100, 9, midColor1, petalColor1, stemColor1);
} else {
     //Draw candles
     candle(width * 0.1, height - 125 + yOffset, 100, canColor1, flameColor1);
     candle(width * 0.15, height - 150 + yOffset3 , 50, canColor2, flameColor1);
     candle(width * 0.35, height - 80 + yOffset2, 200, canColor3, flameColor2);
     candle(width * 0.4, height - 100 + yOffset4, 75, canColor2, flameColor1);
     candle(width * 0.55, height - 130 + yOffset, 55, canColor1, flameColor3);
     candle(width * 0.65, height - 140 + yOffset2, 30, canColor1, flameColor2);
     candle(width * 0.75, height - 170 + yOffset4, 130, canColor2, flameColor2);
     candle(width * 0.875, height - 75 + yOffset4, 65, canColor3, flameColor1);
     candle(width * 0.9, height - 140 + yOffset4, 75, canColor2, flameColor1);
     candle(width * 0.95, height - 80 +yOffset, 140, canColor3, flameColor3);
     candle(width * 1.15, height - 130 + yOffset3, 55, canColor1, flameColor2);
     candle(width * 1.25, height - 125 + yOffset, 190, canColor3, flameColor1);
    }
    // Update and display raindrops
    for (let raindrop of raindrops) {
        raindrop.update(rainDropyOffset);
        raindrop.display();
    }
    // Update and display particles for explosion effect
    particleSystem.update();
    particleSystem.display();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Resize canvas to match window dimensions
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

