class Raindrop {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed; // Add a speed property
        this.alpha = 255; // Add an alpha property for transparency
        this.oscillationSpeed = random(0.05, 0.2); // Random speed for oscillation
        this.oscillationOffset = random(TWO_PI); // Random offset for oscillation
    }

    update(yOffset) {
        this.y += this.speed + yOffset; // Use the speed property
        this.alpha = 128 + 127 * sin(this.oscillationSpeed * frameCount + this.oscillationOffset); // Oscillate alpha
        if (this.y > height) {
            this.y = 0; // Reset to the top if it goes off the bottom
            this.x = random(width); // Randomize the x position when resetting
            this.oscillationSpeed = random(0.05, 0.2); // Random speed for oscillation
            this.oscillationOffset = random(TWO_PI); // Random offset for oscillation
        }
    }

    display() {
        noFill();
        fill(210, 50, 100, this.alpha); // Set fill color with alpha
        noStroke();
        stroke('black'); // Set stroke color
        strokeWeight(1); // Set stroke weight

        beginShape();
        vertex(this.x, this.y);
        bezierVertex(this.x - this.width / 2, this.y + this.height / 4, this.x - this.width / 2, this.y + this.height, this.x, this.y + this.height);
        bezierVertex(this.x + this.width, this.y + this.height, this.x + this.width / 2, this.y + this.height / 4, this.x, this.y);
        endShape(CLOSE);
    }
}