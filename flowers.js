let midColor1, petalColor1;
//let mic, amplitude;

function setup() {
    createCanvas(400, 400);
    noLoop();

    //flower colors
    midColor1 = color(50, 70, 100);
    petalColor1 = color(300, 80, 100);

    //Audio setup
    mic = new p5.AudioIn();
    mic.start();

    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);

    
}

function draw() {

    flower(200, 200 + moveY, 6, midColor1, petalColor1); 
    //flower(300, 300 + moveY, 5, midColor1, petalColor1);

    let level = amplitude.getLevel();

    let moveY = map(level, 0, 1, -50, 50);    
}

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

    beginShape();
    curveVertex(0, 0); // Control point
    curveVertex(20, -20); // Start point
    curveVertex(40, 0); // Control point
    curveVertex(20, 20); // End point
    curveVertex(0, 0); // Control point
    endShape(CLOSE);
}

// Testing
function mousePressed() {
    console.log(mouseX, mouseY);
}