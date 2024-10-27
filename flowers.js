function flower(x, y, numPetals, midColor, petalColor, baseHue) {
    //Drawing stem of the flower
    drawStem(x + 2, y + 17);

    // Extract the HSB values from petalColor
    let baseHueValue = hue(petalColor);
    let baseSaturation = saturation(petalColor);
    let baseBrightness = brightness(petalColor);
    
    // Drawing petals
    for (let i = 0; i < numPetals; i++) {
        push();
        translate(x, y);
        rotate(TWO_PI * i / numPetals);
        let petalHue = (baseHueValue + map(normVol, 0, 1, -10, 10) + random(-5, 5)) % 360;
        let petalColor = color(petalHue, baseSaturation, baseBrightness);
        drawPetal(petalColor);
        pop();
    }

    // Set the fill color for the ellipse
    fill(midColor);

    // Drawing the center of the flower
    stroke(0);
    strokeWeight(1);
    ellipse(x, y, 30, 30);

    
}

function drawPetal(petalColor) {
    fill(petalColor);
    stroke(0); 
    strokeWeight(1);

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(20, -20); // Start point
    curveVertex(40, 0); // Control point
    curveVertex(20, 20); // End point
    curveVertex(0, 0); // Control point
    endShape(CLOSE);
}

function drawStem(x, y) {
    noFill();
    //fill(120, 100, 60); // No fill for the stem
    stroke(120, 100, 90); // Set the stroke color for the stem
    strokeWeight(8); // Set the stroke weight for the stem

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
    endShape();
}