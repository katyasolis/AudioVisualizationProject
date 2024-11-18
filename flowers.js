class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        //syd: scaled this.vx and this.vy by width and height
        this.vx = random(-0.03 * width, 0.03 * width); // Scale by width
        this.vy = random(-0.03 * height, 0.03 * height); // Scale by height
        this.alpha = 255;
        this.size = size;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 25;
    }

    display() {
        noStroke();
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
        ellipse(this.x, this.y, this.size / 20);
    }

    isFinished() {
        return this.alpha <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticle(x, y, size, color) {
        //Sydney: More particles = more lag 
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(x, y, size, color));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isFinished()) {
                this.particles.splice(i, 1);
            }
        }
    }

    display() {
        for (let particle of this.particles) {
            particle.display();
        }
    }
}

function flower(x, y, size, numPetals, midColor, petalColor, stemColor, hueRange, opacity) {
    //Drawing stem of the flower

    //SYD: Added parameter for stem length
    drawStem(x + 2, y + 17, size, stemColor, globeScale * 0.5, opacity);

    // Extract the HSB values from petalColor
    let baseHueValue = hue(petalColor);
    let baseSaturation = saturation(petalColor);
    let baseBrightness = brightness(petalColor);
    
    // Introduce a time-based factor that changes slowly
    let slowFactor = map(sin(millis() / 5000), -1, 1, -hueRange, hueRange); // Change every 5 seconds

    // Drawing petals
    for (let i = 0; i < numPetals; i++) {
        push();
        translate(x, y);
        rotate(TWO_PI * i / numPetals);
        let petalHue = (baseHueValue + slowFactor + random(-hueRange, hueRange)) % 360;
        //let petalSaturation = constrain(baseSaturation + random(-satRange, satRange), 0, 100);
        let flowerPetalColor = color(petalHue, baseSaturation, baseBrightness, opacity / 255); // Use petalSaturation here
        drawPetal(flowerPetalColor, size);
        pop();
    }
    
     // Set the fill color for the ellipse
     fill(midColor);

     // Drawing the center of the flower
     stroke(0);
     strokeWeight(1);
     ellipse(x, y, size * 0.3, size * 0.3); // Adjust the size of the center
 
     // Trigger explosion at the end of the interval
    if (millis() - lastSwitchTime > switchInterval - 1000) {

        particleSystem.addParticle(x, y, size, petalColor);
    }

    //SYD: TRIGGER EXPLOSION FOR DEBUGGING 
    // if(mouseIsPressed){
    //     particleSystem.addParticle(x, y, size, petalColor);
    // }
}

function drawPetal(petalColor, size) {
    fill(petalColor);
    stroke(0); 
    strokeWeight(1);

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(size * 0.2, -size * 0.2); // Start point
    curveVertex(size * 0.4, 0); // Control point
    curveVertex(size * 0.2, size * 0.2); // End point
    curveVertex(0, 0); // Control point
    endShape(CLOSE);
}

function drawStem(x, y, size, stemColor, stemLength, opacity) {
    noFill();
    stroke(hue(stemColor), saturation(stemColor), brightness(stemColor), opacity/255); // Set the stroke color for the stem
    strokeWeight(0.08 * size); // Set the stroke weight for the stem

    //SYD: Added Parameter for stem length
    let segmentLength = stemLength / 12; // Divide the stem length into segments

    beginShape();
    curveVertex(x, y); // Starting point at the base of the flower
    curveVertex(x, y); // Control point
    curveVertex(x - 5, y + segmentLength); // Control point
    curveVertex(x + 5, y + 2 * segmentLength); // Control point
    curveVertex(x - 8, y + 3 * segmentLength); // Control point
    curveVertex(x + 8, y + 4 * segmentLength); // Control point
    curveVertex(x - 10, y + 5 * segmentLength); // Control point
    curveVertex(x + 10, y + 6 * segmentLength); // Control point
    curveVertex(x - 10, y + 7 * segmentLength);
    curveVertex(x + 10, y + 8 * segmentLength);
    endShape();
}