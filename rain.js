function rainDrop(x, y, width, height) {
    noFill();
    fill(210, 100, 100); // Set fill color
    noStroke();
    stroke('black'); // Set stroke color
    strokeWeight(2); // Set stroke weight

    beginShape();
    vertex(x, y);
    bezierVertex(x - width / 2, y + height / 4, x - width / 2, y + height, x, y + height);
    bezierVertex(x + width, y + height, x + width / 2, y + height / 4, x, y);    endShape(CLOSE);
    }
