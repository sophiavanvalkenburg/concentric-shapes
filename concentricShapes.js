var BACKGROUND_COLOR = 200;

var points = [];

function drawLines(lines) {
    beginShape();
    for (var i = 0; i < lines.length; i++){
        var p1 = lines[i].a;
        var p2 = lines[i].b;
        strokeWeight(6);
        point(p1.x, p1.y);
        point(p2.x, p2.y);
        strokeWeight(3);
        line(p1.x, p1.y, p2.x, p2.y);
    }
    endShape(CLOSE);
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(BACKGROUND_COLOR);
    strokeWeight(3);
    stroke(0);
}

function mouseReleased(){
    clear();
    background(BACKGROUND_COLOR);
    var outline = createOutline(points);
    drawLines(outline);

    points = [];
    strokeWeight(3);
    stroke(0)
}

var lastX = 0;
var lastY = 0;
function mouseDragged() {
    if (!eq(lastX, mouseX) || !eq(lastY, mouseY)) {
        points.push(Point(mouseX, mouseY));
        lastX = mouseX;
        lastY = mouseY;
        point(mouseX, mouseY);
    }
}
