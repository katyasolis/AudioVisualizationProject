function flower() {

    //sizing


    //drawing
    
    beginShape();
    curveVertex(178, 170);
    curveVertex(185, 140);
    curveVertex(217, 167);
    curveVertex(247, 170);
    curveVertex(253, 200);
    endShape(CLOSE);

    ellipse(200, 200, 50, 50);
}

//testing
function mousePressed() {
    console.log(mouseX, mouseY);
}