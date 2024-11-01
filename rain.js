class Raindrop {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.alpha = 255;
        this.oscillationSpeed = random(0.05, 0.2);
        this.oscillationOffset = random(TWO_PI);
    }

    update(yOffset) {
        this.y += this.speed + yOffset;
        this.alpha = 128 + 127 * sin(this.oscillationSpeed * frameCount + this.oscillationOffset);
        if (this.y > height) {
            this.y = 0;
            this.x = random(width);
            this.oscillationSpeed = random(0.05, 0.2);
            this.oscillationOffset = random(TWO_PI);
        }
    }

    display() {
        noFill();
        fill(210, 50, 100, this.alpha);
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