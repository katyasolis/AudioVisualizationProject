class Raindrop {
    constructor(x, y, width, height, speed, color, alpha) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;  // Store the color passed as argument
        this.alpha = alpha;
        this.oscillationSpeed = random(0.05, 0.2);
        this.oscillationOffset = random(TWO_PI);
    }

    update(yOffset) {
        this.y += this.speed + yOffset;

        // Reset position if raindrop goes off-screen
        if (this.y > height) {
            this.y = 0;
            this.x = random(width);
            this.oscillationSpeed = random(0.05, 0.2);
            this.oscillationOffset = random(TWO_PI);
        }
    }

    display() {
        // Check if `this.color` is a valid color; otherwise, set a default color
        let displayColor = this.color instanceof p5.Color ? this.color : color(220, 90, 100);

        fill(hue(displayColor), saturation(displayColor), brightness(displayColor), this.alpha / 255);
        noStroke();
        stroke('black');
        strokeWeight(1);

        beginShape();
        vertex(this.x, this.y);
        bezierVertex(this.x - this.width / 2, this.y + this.height / 4, this.x - this.width / 2, this.y + this.height, this.x, this.y + this.height);
        bezierVertex(this.x + this.width, this.y + this.height, this.x + this.width / 2, this.y + this.height / 4, this.x, this.y);
        endShape(CLOSE);
    }
}