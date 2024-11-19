function candle(x, y, size, flameHeight, color, flameColor, opacity) {
    let w = size; 
    let h = size * 2;
    canBase(x, y, w, h, color, opacity);
    canFlame(x, y - h/5, w / 2, flameHeight, flameColor, opacity);

     // Trigger explosion with dynamic color sampling
     if (millis() - lastSwitchTime > switchInterval - 1000) {
        let sampledColor;
        try {
            // Safely sample the color at the flame's position
            sampledColor = color(get(x, y - h / 5));
        } catch (e) {
            // Fallback color if sampling fails
            console.warn("Color sampling failed, using default flameColor.");
            sampledColor = flameColor;
        }

        particleSystem.addParticle(x, y - h / 5, size, sampledColor);
    }
}

function canBase(x, y, w, h, color, opacity) {
    colorMode(HSB, 360, 100, 100, 1); // Set color mode to HSB
    fill(hue(color), saturation(color), brightness(color), opacity/255); // Set fill color with opacity
    stroke(hue(1), saturation(0), brightness(100), opacity/255); // Set stroke color for the cylinder
    strokeWeight(w * 0.02);
    

    // Draw the connecting rectangle
    rect(x - w / 2, y, w, h);

    // Draw the top ellipse
    ellipse(x, y, w, w / 5);

    // Draw the bottom half of the ellipse with stroke
    noStroke();
    arc(x, y + h, w, w / 5, 0, PI);
}

function canFlame(x, y, size, flameHeight, flameColor, opacity) {
    // Set the shadow properties for the glow effect
    drawingContext.shadowBlur = flameHeight * 1;
    drawingContext.shadowColor = flameColor;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    colorMode(HSB, 360, 100, 100, 1); // Set color mode to HSB
    fill(hue(flameColor), saturation(flameColor), brightness(flameColor), opacity/255); // Set fill color with opacity
    stroke(hue(25), saturation(100), brightness(75), opacity/255); // Set stroke color for the flame (dark orange)
    strokeWeight(size * 0.02);


    beginShape();
    vertex(x, y); // Bottom point of the teardrop
    bezierVertex(x - size / 2, (y + size * flameHeight) + flameHeight, x + size / 2, (y + size * flameHeight) + flameHeight, x, y); // Left and right control points
    bezierVertex(x - size / 4, (y + size / 2 * flameHeight) + flameHeight, x + size / 4, (y + size / 2 * flameHeight) + flameHeight, x, y); // Inner control points for a smoother shape
    endShape(CLOSE);

    // Reset the shadow properties to avoid affecting other drawings
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';
}