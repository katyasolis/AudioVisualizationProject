function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(210, 35, 100);
}

function draw() {
    background(210, 35, 100); // Clear the background each frame
    rainDrop(width / 2, height / 2, 20, 40);
}

function rainDrop(x, y, width, height) {
    fill(210, 100, 100); // Set fill color
    stroke('black'); // Set stroke color
    strokeWeight(2); // Set stroke weight

    beginShape();
    vertex(x, y);
    bezierVertex(x - width / 2, y + height / 2, x + width / 2, y + height / 2, x, y + height);
    bezierVertex(x - width / 2, y + height / 2, x + width / 2, y + height / 2, x, y);
    endShape(CLOSE);
    }
    
