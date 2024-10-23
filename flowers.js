function flower() {

    //sizing


    //drawing
    
    beginShape();
    curveVertex(200, 200); // Control point
    curveVertex(220, 180); // Start point
    curveVertex(240, 200); // Control point
    curveVertex(220, 220); // End point
    curveVertex(200, 200); // Control point
    endShape(CLOSE);
    /*beginShape();
    curveVertex(255, 180);
    curveVertex(253, 200);
    curveVertex(229, 209);
    curveVertex(231, 237);
    curveVertex(204, 233);
    curveVertex(180, 243);
    curveVertex(170, 215);
    curveVertex(148, 200);
    curveVertex(160, 185);
    endShape(CLOSE);*/

    fill(65, 75, 100);
    ellipse(200, 200, 40, 40);

}

//testing
function mousePressed() {
    console.log(mouseX, mouseY);
}