let ratio = 1.6;
let globeScale;

let mic, fft, volSenseSlider, numRaindropsSlider;
let vol = 0.25;
let normVol;
let volSense = 100;
let slideStep = 5;
let startAudio = false;
let detectBeat = false;
let detectBeat2 = false;

let midColor1, midColor2, petalColor1, petalColor2, petalColor3, stemColor1;
let canColor1, flameColor1, canColor2, flameColor2, canColor3, flameColor3, backFlameColor, backCanColor1, backCanColor2;
let baseHue1, baseHue2, baseHue3;
let lowFreqHue, highFreqHue;
let rainColor;
let rainDayBackColor, rainNightBackColor;
let assetSize = 1;


// Define target and current positions for smoothing
let targetYOffset = 0, targetYOffset2 = 0, targetYOffset3 = 0, targetYOffset4 = 0;
let currentYOffset = 0, currentYOffset2 = 0, currentYOffset3 = 0, currentYOffset4 = 0;

let raindrops = [];
let middleRaindrops = [];
let backgroundRaindrops = [];
let numBackgroundRaindrops = 25;
let numMiddleRaindrops = 35;
let numRaindrops = 50;
let rainDropyOffset = 0;

let displayFlowers = true; // Variable to track whether to display flowers or candles
let switchInterval = 10000; // Interval to switch between flowers and candles (in milliseconds)
let lastSwitchTime = 0; // Track the last switch time
let growthFactor = 1; // Growth factor for flames

let particleSystem;

let offset1, offset2, offset3;//SYD: for scaling position from hieght
let dropW, dropH; //SYD: for scaling raindrop size

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerWidth);
    windowResized();
    globeScale = min(width, height);
    colorMode(HSB);
    getAudioContext().suspend();

    particleSystem = new ParticleSystem();

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
    backFlameColor = color(25, 95, 70);
    backCanColor1 = color(50, 65, 80);
    backCanColor2 = color(15, 55, 80);
    backCanColor3 = color(310, 75, 80);

    volSenseSlider = createSlider(0, 100, volSense, slideStep);
    volSenseSlider.position(10, height*0.02);
    //volSenseSlider.style('width', '400px');
    volSenseSlider.class('slider-volsense');
    volSenseSlider.input(() => updateSliderBackground(volSenseSlider, 'rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.3)'));

    numRaindropsSlider = createSlider(10, 200, numRaindrops, slideStep);
    numRaindropsSlider.position(10, height*0.05);
    //numRaindropsSlider.style('width', '400px');
    numRaindropsSlider.class('slider-raindrop');
    numRaindropsSlider.input(() => updateSliderBackground(numRaindropsSlider, 'rgba(0, 0, 255, 0.7)', 'rgba(0, 0, 255, 0.3)'));

    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);

    // Create background raindrops
    for (let i = 0; i < numBackgroundRaindrops; i++) {
        dropW = random(globeScale * 0.02, globeScale * 0.04);
        dropH = dropW * 1.5;
        let rainColor = color(220, 90, 100);
        backgroundRaindrops.push(new Raindrop(random(width), random(height), dropW, dropH, random(1, 2.5), rainColor, 160));
    }

    // Create middle ground raindrops
    for (let i = 0; i < numMiddleRaindrops; i++) {
        dropW = random(globeScale * 0.02, globeScale * 0.04);
        dropH = dropW * 1.75;
        let rainColor = color(215, 70, 100);
        middleRaindrops.push(new Raindrop(random(width), random(height), dropW, dropH, random(1.5, 4), rainColor, 230));
    }

    // Create raindrops
    //SYD: Made your raindrops scale with globeScale
    for (let i = 0; i < numRaindrops; i++) {
         dropW = random(globeScale*0.02, globeScale*0.04); 
         dropH = dropW * 2; 
         let rainColor = color(210, 50, 100);
        raindrops.push(new Raindrop(random(width), random(height), dropW, dropH, random(2, 5), rainColor, 255));
    } 
}

function updateSliderBackground(slider, color1, color2) {
    let value = slider.value();
    let max = slider.elt.max;
    let percentage = (value / max) * 100;
    slider.style('background', `linear-gradient(to right, ${color1} ${percentage}%, ${color2} ${percentage}%)`);
}
function draw() {
    background(210, 35, 100);

    if (startAudio) {
        vol = mic.getLevel();
        let spectrum = fft.analyze();
        detectBeat = fft.getEnergy("bass") > 150;
        detectBeat2 = fft.getEnergy("bass") > 200;

        //Beat detection
        if (detectBeat2) {
            assetSize = 1.75;
        } else if (detectBeat) {
            assetSize = 1.5;
        } else {
            assetSize = 1;
        }

        //frequency analysis
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

        // sliders 
        volSense = volSenseSlider.value();
        let targetNumRaindrops = numRaindropsSlider.value();
        normVol = vol * (volSense * 1.5);

        // Calculate target positions based on volume
        //SYD: Changed this so it would scale to height of canvas
        targetYOffset = map(normVol, 0, 1, 0, -height * 0.175);
        targetYOffset2 = map(normVol, 0, 1, 0, -height * 0.295);
        targetYOffset3 = map(normVol, 0, 1, 0, -height * 0.425);
        targetYOffset4 = map(normVol, 0, 1, 0, -height * 0.475);

        // Smoothly interpolate current positions towards target positions
        currentYOffset = lerp(currentYOffset, targetYOffset, 0.1);
        currentYOffset2 = lerp(currentYOffset2, targetYOffset2, 0.1);
        currentYOffset3 = lerp(currentYOffset3, targetYOffset3, 0.1);
        currentYOffset4 = lerp(currentYOffset4, targetYOffset4, 0.1);

        //raindrop analysis
        rainDropyOffset = map(normVol, 0, 1, 0, 5);

        if (raindrops.length < targetNumRaindrops) {
            for (let i = raindrops.length; i < targetNumRaindrops; i++) {
                raindrops.push(new Raindrop(random(width), random(height), dropW, dropH, random(1, 5), rainColor, 255));
            }
        } else if (raindrops.length > targetNumRaindrops) {
            raindrops.splice(targetNumRaindrops);
        } 

        for (let raindrop of raindrops) {
            raindrop.update(rainDropyOffset);
            raindrop.display();
        } 

        // Change flower colors based on volume
        baseHue1 = (hue(petalColor1) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue2 = (hue(petalColor2) + map(normVol, 0, 1, -10, 10)) % 360;
        baseHue3 = (hue(petalColor3) + map(normVol, 0, 1, -10, 10)) % 360;

        petalColor1 = color(baseHue1, 100, 100);
        petalColor2 = color(baseHue2, 100, 100);
        petalColor3 = color(baseHue3, 100, 100);

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

        // Display flowers or candles based on `displayFlowers` state
        if (displayFlowers) {
            // Day background with frenquency analysis
            lowFreqAvg /= lowFreqCount;
            highFreqAvg /= highFreqCount;

            lowFreqHue = map(lowFreqAvg, 0, 127.5, 175, 200);
            highFreqHue = map(highFreqAvg, 127.51, 255, 30, 65);

            // Define different brightness and saturation values
            let lowFreqSaturation = 85;
            let lowFreqBrightness = 100;
            let highFreqSaturation = 85;
            let highFreqBrightness = 100;

            for (let y = 0; y < height; y++) {
                let inter = map(y, 0, height, 0, 1);
                let c = lerpColor(color(lowFreqHue, lowFreqSaturation, lowFreqBrightness), color(highFreqHue, highFreqSaturation, highFreqBrightness), inter);
                stroke(c);
                line(0, y, width, y);
            }

           

            //SYD: Your flower sizes were hard coded
            //I scaled them using globeScale
            //Also needed to scale the number for height offset
            // You need to finish the rest of the flowers
            offset1 = height * 0.2;
            offset2 = height * 0.14;
            offset3 = height * 0.12;

            flower(width * 0.1, (height - (offset1 + 380)) + currentYOffset2, (globeScale * 0.1) * assetSize, 6, color(60, 100, 50), color(40, 100, 50), color(130, 100, 50), 10, 200);
            flower(width * 0.25, (height - (offset2 + 530)) + currentYOffset, (globeScale * 0.18) * assetSize, 4, color(60, 100, 50), color(210, 100, 50), color(130, 100, 50), 10, 200);
            flower(width * 0.4, (height - (offset1 + 350)) + currentYOffset3, (globeScale * 0.15) * assetSize, 6, color(60, 100, 50), color(270, 100, 50), color(130, 100, 50), 10, 200);
            flower(width * 0.55, (height - (offset3 + 480)) + currentYOffset2, (globeScale * 0.12) * assetSize, 7, color(60, 100, 50), color(330, 100, 50), color(130, 100, 50), 10, 200);
            flower(width * 0.7, (height - (offset2 + 530)) + currentYOffset4, (globeScale * 0.18) * assetSize, 6, color(60, 100, 50), color(90, 100, 50), color(130, 100, 50), 10, 200);
            flower(width * 0.85, (height - (offset1 + 520)) + currentYOffset, (globeScale * 0.13) * assetSize, 5, color(60, 100, 50), color(150, 100, 50), color(130, 100, 50), 10, 200);    

            drawingRain(backgroundRaindrops);

            flower(width * 0.05, (height - (offset1 + 200)) + currentYOffset4, (globeScale * 0.33) * assetSize, 6, color(60, 100, 60), color(300, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.25, (height - (offset2 + 180)) + currentYOffset2, (globeScale * 0.25) * assetSize, 4, color(60, 100, 60), color(260, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.35, (height - (offset1 + 160)) + currentYOffset3, (globeScale * 0.3) * assetSize, 6, color(60, 100, 60), color(30, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.5, (height - (offset3 + 115)) + currentYOffset2, (globeScale * 0.36) * assetSize, 7, color(60, 100, 60), color(200, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.65, (height - (offset2 + 235)) + currentYOffset3, (globeScale * 0.22) * assetSize, 6, color(60, 100, 60), color(330, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.8, (height - (offset1 + 140)) + currentYOffset4, (globeScale * 0.28) * assetSize, 5, color(60, 100, 60), color(270, 90, 70), color(120, 90, 70), 15, 235);
            flower(width * 0.95, (height - (offset3 + 265)) + currentYOffset, (globeScale * 0.35) * assetSize, 6, color(60, 100, 60), color(25, 90, 70), color(120, 90, 70), 15, 235);

            drawingRain(middleRaindrops);

            // Draw flowers
            flower(width * 0.05, (height - offset1) + currentYOffset2, (globeScale * 0.32) * assetSize, 6, color(60, 100, 100), color(190, 80, 100), color(120, 100, 100), 25, 255);
            flower(width * 0.85, (height - offset3) + currentYOffset, (globeScale * 0.14) * assetSize, 8, color(60, 100, 100), color(330, 80, 100), color(120, 100, 100), 30, 255);
            flower(width * 0.175, (height - offset1) + currentYOffset3, (globeScale * 0.42) * assetSize, 6, color(60, 100, 100), color(270, 80, 100), color(120, 100, 100), 20, 255);
            flower(width * 0.225, (height - offset2) + currentYOffset2, (globeScale * 0.35) * assetSize, 6, color(60, 100, 100), color(25, 70, 100), color(120, 100, 100), 25, 255);
            flower(width * 0.265, (height - offset1) + currentYOffset4, (globeScale * 0.2) * assetSize, 5, color(60, 100, 100), color(300, 80, 100), color(120, 100, 100), 20, 255);
            flower(width * 0.375, (height - offset2) + currentYOffset3, (globeScale * 0.28) * assetSize, 6, color(60, 100, 100), color(200, 80, 100), color(120, 100, 100), 40, 255);
            flower(width * 0.45, (height - offset1) + currentYOffset, (globeScale * 0.23) * assetSize, 7, color(60, 100, 100), color(300, 80, 100), color(120, 100, 100), 35, 255);
            flower(width * 0.55, (height - offset3) + currentYOffset2, (globeScale * 0.35) * assetSize, 6, color(60, 100, 100), color(330, 80, 100), color(120, 100, 100), 20, 255);
            flower(width * 0.7, (height - offset1) + currentYOffset, (globeScale * 0.5) * assetSize, 6, color(60, 100, 100), color(190, 80, 100), color(120, 100, 100), 20, 255);
            flower(width * 0.78, (height - offset3) + currentYOffset3, (globeScale * 0.3) * assetSize, 4, color(60, 100, 100), color(300, 80, 100), color(120, 100, 100), 30, 255);
            flower(width * 0.85, (height - offset1) + currentYOffset4, (globeScale * 0.43) * assetSize, 6, color(60, 100, 100), color(25, 70, 100), color(120, 100, 100), 25, 255);
            flower(width * 0.95, (height - offset1) + currentYOffset2, (globeScale * 0.25) * assetSize, 9, color(60, 100, 100), color(270, 80, 100), color(120, 100, 100), 25, 255);
        } else {
            // Night background with frequency analysis
            lowFreqAvg /= lowFreqCount;
            highFreqAvg /= highFreqCount;

            lowFreqHue = map(lowFreqAvg, 0, 127.5, 190, 250);
            highFreqHue = map(highFreqAvg, 127.51, 255, 1, 40);

            let lowFreqSaturation = 100;
            let lowFreqBrightness = 45;
            let highFreqSaturation = 100;
            let highFreqBrightness = 75;

            for (let y = 0; y < height; y++) {
                let inter = map(y, 0, height, 0, 1);
                let c = lerpColor(color(lowFreqHue, lowFreqSaturation, lowFreqBrightness), color(highFreqHue, highFreqSaturation, highFreqBrightness), inter);
                stroke(c);
                line(0, y, width, y);
            }

            drawingRain(backgroundRaindrops);
            // Draw background candles
            candle(width * 0.065, (height - (offset2 + 550)) + currentYOffset, (globeScale * 0.065), assetSize, canColor1, backFlameColor, 100);
            candle(width * 0.125, (height - (offset2 + 450)) + currentYOffset3, (globeScale * 0.1), assetSize, canColor2, backFlameColor, 100);
            candle(width * 0.25, (height - (offset2 + 400)) + currentYOffset2, (globeScale * 0.08), assetSize, canColor3, backFlameColor, 100);
            candle(width * 0.375, (height - (offset2 + 350)) + currentYOffset4, (globeScale * 0.05), assetSize, canColor1, backFlameColor, 100);
            candle(width * 0.45, (height - (offset2 + 500)) + currentYOffset, (globeScale * 0.05), assetSize, canColor2, backFlameColor, 100);
            candle(width * 0.55, (height - (offset2 + 450)) + currentYOffset3, (globeScale * 0.09), assetSize, canColor3, backFlameColor, 100);
            candle(width * 0.625, (height - (offset2 + 600)) + currentYOffset2, (globeScale * 0.03), assetSize, canColor1, backFlameColor, 100);
            candle(width * 0.725, (height - (offset2 + 500)) + currentYOffset4, (globeScale * 0.07), assetSize, canColor2, backFlameColor, 100);
            candle(width * 0.825, (height - (offset2 + 400)) + currentYOffset, (globeScale * 0.1), assetSize, canColor3, backFlameColor, 100);
            candle(width * 0.925, (height - (offset2 + 350)) + currentYOffset3, (globeScale * 0.08), assetSize, canColor1, backFlameColor, 100);

            drawingRain(middleRaindrops);
            // Draw middle candles
            candle(width * 0.095, (height - (offset2 + 230)) + currentYOffset2, (globeScale * 0.225), assetSize, backCanColor3, backFlameColor, 230);
            candle(width * 0.3, (height - (offset2 + 180)) + currentYOffset4, (globeScale * 0.2), assetSize, backCanColor2, backFlameColor, 230);
            candle(width * 0.5, (height - (offset2 + 195)) + currentYOffset, (globeScale * 0.13), assetSize, backCanColor1, backFlameColor, 230);
            candle(width * 0.6, (height - (offset2 + 220)) + currentYOffset2, (globeScale * 0.1), assetSize, backCanColor2, backFlameColor, 230);
            candle(width * 0.7, (height - (offset2 + 210)) + currentYOffset3, (globeScale * 0.2), assetSize, backCanColor3, backFlameColor, 230);
            candle(width * 0.9, (height - (offset2 + 250)) + currentYOffset, (globeScale * 0.17), assetSize, backCanColor2, backFlameColor, 230);

            //Draw candles
            candle(width * 0.03, (height - offset1) + currentYOffset2, (globeScale * 0.3), assetSize, canColor3, flameColor3, 255);
            candle(width * 0.1, (height - offset2) + currentYOffset, (globeScale * 0.2), assetSize, canColor1, flameColor1, 255);
            candle(width * 0.175, (height - offset3) + currentYOffset3, (globeScale * 0.12), assetSize, canColor2, flameColor1, 255);
            candle(width * 0.22, (height - offset1) + currentYOffset2, (globeScale * 0.14), assetSize, canColor3, flameColor2, 255);
            candle(width * 0.35, (height - offset2) + currentYOffset4, (globeScale * 0.3), assetSize, canColor2, flameColor1, 255);
            candle(width * 0.4, (height - offset3) + currentYOffset, (globeScale * 0.1), assetSize, canColor1, flameColor3, 255);
            candle(width * 0.5, (height - offset1) + currentYOffset2, (globeScale * 0.2), assetSize, canColor1, flameColor2, 255);
            candle(width * 0.575, (height - offset2) + currentYOffset4, (globeScale * 0.13), assetSize, canColor2, flameColor2, 255);
            candle(width * 0.625, (height - offset3) + currentYOffset, (globeScale * 0.15), assetSize, canColor3, flameColor1, 255);
            candle(width * 0.7, (height - offset1) + currentYOffset4, (globeScale * 0.12), assetSize, canColor2, flameColor1, 255);
            candle(width * 0.755, (height - offset2) + currentYOffset2, (globeScale * 0.35), assetSize, canColor1, flameColor3, 255);
            candle(width * 0.825, (height - offset2) + currentYOffset, (globeScale * 0.3), assetSize, canColor3, flameColor3, 255);
            candle(width * 0.95, (height - offset1) + currentYOffset3, (globeScale * 0.1), assetSize, canColor1, flameColor2, 255);
            candle(width * 0.975, (height - offset3) + currentYOffset2, (globeScale * 0.13), assetSize, canColor3, flameColor1, 255);
        }
    }

    drawingRain(raindrops);
    // Update and display particles for explosion effect
    particleSystem.update();
    particleSystem.display();

}

function drawingRain(raindrops) {
    for (let raindrop of raindrops) {
        raindrop.update(rainDropyOffset);
        raindrop.display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    globeScale = min(width, height);
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