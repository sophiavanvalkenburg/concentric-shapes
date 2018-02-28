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

function getNewPoint(line1, line2) {
    // get unit vectors from adjacent lines with middle point as origin
    var v1 = lineToUnitVec(line1.b, line1.a);
    var v2 = lineToUnitVec(line2.a, line2.b)
    // get the angle between the vectors
    var angleDir = v2.cross(v1).z >= 0 ? 1 : -1;
    var angle = angleDir * acos(v2.dot(v1))
    // get the vector from which we start calculating the angle
    var right = createVector(angleDir * 1, 0);
    // get the angle between the second vector and the angle start vector
    var v2AngleDir = v2.cross(right).z >= 0 ? 1 : -1;
    var v2Angle = v2AngleDir * acos(v2.dot(right)); 
    // place new point in between the original vectors
    var newAngle = angle / 2 - v2Angle;
    // add new point 
    return Point(LAYER_PADDING * cos(newAngle) + line2.a.x, LAYER_PADDING * sin(newAngle) + line2.a.y)
}

function addLayer() {
    var layerLines = [];
    var line1 = outline[outline.length - 1];
    var line2;
    stroke(255, 0, 0);
    var lastP;
    for (var i = 0; i < outline.length; i++) {
        line2 = outline[i];
        var newP = getNewPoint(line1, line2);
        if (lastP){
            layerLines.push(Line(lastP, newP));
        }
        lastP = newP;
        line1 = line2;
    }
    if (layerLines.length > 1) layerLines.push(Line(lastP, layerLines[0].a));
    drawLines(layerLines);
    outline = layerLines;
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
