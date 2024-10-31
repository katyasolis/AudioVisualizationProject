function flower(x, y, size, numPetals, midColor, petalColor, stemColor) {
    //Drawing stem of the flower
    drawStem(x + 2, y + 17, size, stemColor);

    // Extract the HSB values from petalColor
    let baseHueValue = hue(petalColor);
    let baseSaturation = saturation(petalColor);
    let baseBrightness = brightness(petalColor);
    
    // Drawing petals
    for (let i = 0; i < numPetals; i++) {
        push();
        translate(x, y);
        rotate(TWO_PI * i / numPetals);
        let petalHue = (baseHueValue + map(normVol, 0, 1, -10, 10) + random(-5, 5)) % 50;
        let petalColor = color(petalHue, baseSaturation, baseBrightness);
        drawPetal(petalColor, size);
        pop();
    }
    
     // Set the fill color for the ellipse
     fill(midColor);

     // Drawing the center of the flower
     stroke(0);
     strokeWeight(1);
     ellipse(x, y, size * 0.3, size * 0.3); // Adjust the size of the center
 
}

function drawPetal(petalColor, size) {
    fill(petalColor);
    stroke(0); 
    strokeWeight(1);

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(size * 0.2, -size * 0.2); // Start point
    curveVertex(size * 0.4, 0); // Control point
    curveVertex(size * 0.2, size * 0.2); // End point
    curveVertex(0, 0); // Control point
    endShape(CLOSE);
}

function drawStem(x, y, size, stemColor) {
    noFill();
    //fill(120, 100, 60); // No fill for the stem
    stroke(stemColor); // Set the stroke color for the stem
    strokeWeight(0.08 * size); // Set the stroke weight for the stem

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
    curveVertex(x + 12, y + 300);
    curveVertex(x + -12, y + 330);
    curveVertex(x + 14, y + 380);
    curveVertex(x + -14, y + 420);
    endShape();
}

