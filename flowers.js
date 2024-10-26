function flower(x, y, numPetals, midColor, petalColor) {
    //Drawing stem of the flower
    for (let i = 0; i < 10; i++) {
        push();
        translate(x, y);
        rotate(PI / 2);
        drawStem();
        pop();
    }
    
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

function drawStem() {
    fill(120, 100, 100);
    stroke(0);
    strokeWeight(3);
    //line(200, 200, 200, 300);

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(90, -20); // Start point
    curveVertex(90, -40); // Control point
    curveVertex(90, -90); // End point
    curveVertex(90, 0); // Control point
    endShape(CLOSE);

}