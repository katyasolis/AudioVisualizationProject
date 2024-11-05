class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.vx = random(-25, 25);
        this.vy = random(-25, 25);
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
        for (let i = 0; i < 100; i++) {
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

function flower(x, y, size, numPetals, midColor, petalColor, stemColor) {
    //Drawing stem of the flower
    drawStem(x + 2, y + 17, size, stemColor);

    // Extract the HSB values from petalColor
    let baseHueValue = hue(petalColor);
    let baseSaturation = saturation(petalColor);
    let baseBrightness = brightness(petalColor);
    
    // Drawing petals
    for (let i = 0; i < numPetals; i++) {
        push();
        translate(x, y);
        rotate(TWO_PI * i / numPetals);
        let petalHue = (baseHueValue + map(normVol, 0, 1, -10, 10) + random(-5, 5)) % 50;
        let petalColor = color(petalHue, baseSaturation, baseBrightness);
        drawPetal(petalColor, size);
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

function drawStem(x, y, size, stemColor) {
    noFill();
    //fill(120, 100, 60); // No fill for the stem
    stroke(stemColor); // Set the stroke color for the stem
    strokeWeight(0.08 * size); // Set the stroke weight for the stem

    beginShape();
    curveVertex(x, y); // Starting point at the base of the flower
    curveVertex(x, y); // Control point
    curveVertex(x + -5, y + 25); // Control point
    curveVertex(x + 5, y + 50); // Control point
    curveVertex(x + -8, y + 80); // Control point
    curveVertex(x + 8, y + 110); // Control point
    curveVertex(x + -10, y + 140); // Control point
    curveVertex(x + 10, y + 170); // Control point
    curveVertex(x + -10, y + 200);
    curveVertex(x + 10, y + 230);
    curveVertex(x + -10, y + 270);
    curveVertex(x + 12, y + 300);
    curveVertex(x + -12, y + 330);
    curveVertex(x + 14, y + 380);
    curveVertex(x + -14, y + 420);
    endShape();
}