<<<<<<< Updated upstream
function rainDrop(x, y, width, height) {
    noFill();
    fill(210, 100, 100); // Set fill color
    noStroke();
    stroke('black'); // Set stroke color
    strokeWeight(2); // Set stroke weight

    beginShape();
    vertex(x, y);
    bezierVertex(x - width / 2, y + height / 4, x - width / 2, y + height, x, y + height);
    bezierVertex(x + width, y + height, x + width / 2, y + height / 4, x, y);    endShape(CLOSE);
=======
class Raindrop {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
>>>>>>> Stashed changes
    }

    update(yOffset) {
        this.y += yOffset;
        if (this.y > height) {
            this.y = 0; // Reset to the top if it goes off the bottom
        }
    }

    display() {
        noFill();
        fill(210, 100, 100); // Set fill color
        noStroke();
        stroke('black'); // Set stroke color
        strokeWeight(2); // Set stroke weight

        beginShape();
        vertex(this.x, this.y);
        bezierVertex(this.x - this.width / 2, this.y + this.height / 4, this.x - this.width / 2, this.y + this.height, this.x, this.y + this.height);
        bezierVertex(this.x + this.width, this.y + this.height, this.x + this.width / 2, this.y + this.height / 4, this.x, this.y);
        endShape(CLOSE);
    }
}
