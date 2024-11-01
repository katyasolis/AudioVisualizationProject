function candle(x, y, size, color, flameColor) {
    let w = size; 
    let h = size * 2;
    canBase(x, y, w, h, color);
    canFlame(x, y - h/5, w / 2, flameColor);

}

function canBase(x, y, w, h, color) {
    fill(color); // Set fill color for the cylinder
    stroke(1,0, 100); // Set stroke color for the cylinder
    strokeWeight(w * 0.02);
    

    // Draw the connecting rectangle
    rect(x - w / 2, y, w, h);

    // Draw the top ellipse
    ellipse(x, y, w, w / 5);

    // Draw the bottom half of the ellipse with stroke
    noStroke();
    arc(x, y + h, w, w / 5, 0, PI);
}

function canFlame(x, y, size, flameColor) {
    // Set the shadow properties for the glow effect
    drawingContext.shadowBlur = size * 0.1;
    drawingContext.shadowColor = flameColor;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    fill(flameColor); // Set fill color for the flame (orange)
    stroke(25, 100, 75); // Set stroke color for the flame (darker orange)
    strokeWeight(size * 0.02);


    beginShape();
    vertex(x, y); // Bottom point of the teardrop
    bezierVertex(x - size / 2, y + size, x + size / 2, y + size, x, y); // Left and right control points
    bezierVertex(x - size / 4, y + size / 2, x + size / 4, y + size / 2, x, y); // Inner control points for a smoother shape
    endShape(CLOSE);

    // Reset the shadow properties to avoid affecting other drawings
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';
}