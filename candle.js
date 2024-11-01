function candle(x, y, size, color, flameColor) {
    let w = size; 
    let h = size * 2;
    canBase(x, y, w, h, color);
    canFlame(x, y - h/5, w / 2, flameColor);

}

function canBase(x, y, w, h, color) {
    fill(color); // Set fill color for the cylinder
    stroke(0); // Set stroke color for the cylinder
    

    // Draw the connecting rectangle
    rect(x - w / 2, y, w, h);

    // Draw the top ellipse
    ellipse(x, y, w, w / 5);

    // Draw the bottom half of the ellipse with stroke
    noStroke();
    arc(x, y + h, w, w / 5, 0, PI);
}

function canFlame(x, y, size, flameColor) {
    fill(flameColor); // Set fill color for the flame (orange)
    stroke(25, 100, 75); // Set stroke color for the flame (darker orange)
    strokeWeight(3);


    beginShape();
    vertex(x, y); // Bottom point of the teardrop
    bezierVertex(x - size / 2, y + size, x + size / 2, y + size, x, y); // Left and right control points
    bezierVertex(x - size / 4, y + size / 2, x + size / 4, y + size / 2, x, y); // Inner control points for a smoother shape
    endShape(CLOSE);
}