var BACKGROUND_COLOR = 200;
var LAYER_PADDING = 10;

var points = [];
var outline = [];

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

function rotate2D(p, origin, angle) {
    var x = p.x - origin.x;
    var y = p.y - origin.y;
    var resX = x * cos(angle) - y * sin(angle);
    var resY = y * cos(angle) + x * sin(angle);
    return Point(resX + origin.x, resY + origin.y);
}

function addLayer() {
    var layerLines = [];
    var line1 = outline[outline.length - 1];
    var line2;
    for (var i = 0; i < outline.length; i++) {
        line2 = outline[i];
        var v1 = lineToUnitVec(line1.b, line1.a);
        var v2 = lineToUnitVec(line2.a, line2.b);
        var angle = 2*PI - acos(v2.dot(v1));
        //text(int(degrees(angle)), line2.a.x, line2.a.y);
        var newP = rotate2D(Point(v1.x, v1.y), line2.a, angle / 2);
        point(newP.x, newP.y);
        line1 = line2;
    }
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(BACKGROUND_COLOR);
    strokeWeight(3);
    stroke(0);
}

function mouseReleased(){
    if (points.length) {
        clear();
        background(BACKGROUND_COLOR);
        outline = createOutline(points);
        drawLines(outline);
        points = [];
    } else if (outline.length) {
        addLayer();
    } 
}

var lastX = 0;
var lastY = 0;
function mouseDragged() {
    if (!eq(lastX, mouseX) || !eq(lastY, mouseY)) {
        points.push(Point(mouseX, mouseY));
        lastX = mouseX;
        lastY = mouseY;
        strokeWeight(3);
        point(mouseX, mouseY);
    }
}
