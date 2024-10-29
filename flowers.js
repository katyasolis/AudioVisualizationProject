function flower(x, y, numPetals, midColor, petalColor) {
    // Drawing petals
    for (let i = 0; i < numPetals; i++) {
        push();
        translate(x, y);
        rotate(TWO_PI * i / numPetals);
        drawPetal(petalColor);
        pop();
    }

    // Set the fill color for the ellipse
    fill(midColor);

    // Drawing the center of the flower
    ellipse(x, y, 30, 30);
}

function drawPetal(petalColor) {
    fill(petalColor);
    stroke(0); 

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(20, -20); // Start point
    curveVertex(40, 0); // Control point
    curveVertex(20, 20); // End point
    curveVertex(0, 0); // Control point
    endShape(CLOSE);
}