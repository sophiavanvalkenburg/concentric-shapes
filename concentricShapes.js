var BACKGROUND_COLOR = 200;
var EPSILON = 0.01;

var points = [];

function Point(x, y) {
    return {x: x, y: y};
}

function Line(p1,p2) {
    return {a: p1, b: p2};
}

function eq(a, b) {
    return abs(a - b) < EPSILON;
}

function pointEq(p1, p2) {
    return eq(p1.x, p2.x) && eq(p1.y, p2.y);
}

function drawLines(lines) {
    beginShape();
    for (var i = 0; i < lines.length; i++){
        line(lines[i].a.x, lines[i].a.y, lines[i].b.x, lines[i].b.y);
    }
    endShape(CLOSE);
}

function len(line) {
    var xDiff = line.a.x - line.b.x;
    var yDiff = line.a.y - line.b.y;
    return sqrt(xDiff * xDiff + yDiff * yDiff);
}

function pointOnLineSegment(p, line) {
    return len(Line(line.a, p)) <= len(line);
}

function slope(x1, y1, x2, y2) {
    return (y2 - y1) / (x2 - x1);
}

function yIntercept(x1, y1, x2, y2) {
    return y1 - x1 * (y2 - y1) / (x2 - x1);
}

function intersectionPoint(line1, line2) {
    var x, y;
    var m1 = slope(line1.a.x, line1.a.y, line1.b.x, line1.b.y);
    var m2 = slope(line2.a.x, line2.a.y, line2.b.x, line2.b.y);
    var b1 = yIntercept(line1.a.x, line1.a.y, line1.b.x, line1.b.y);
    var b2 = yIntercept(line2.a.x, line2.a.y, line2.b.x, line2.b.y);
    if (isFinite(m1) && isFinite(m2)) {
        x = (b2 - b1) / (m1 - m2);
        y = m1 * x + b1;
    } else if (!isFinite(m1) && isFinite(m2)) {
        x = line1.a.x;
        y = m2 * x + b2;
    } else if (isFinite(m1) && !isFinite(m2)) {
        x = line2.a.x;
        y = m1 * x + b1;
    } else {
        x = NaN;
        y = NaN;
    }
    return !isNaN(x) && !isNaN(y) ? Point(x, y) : null;
}

function splitIntersections(line, lines) {
    var newLines = null;
    var line2 = null;
    for (var i = 0; i < lines.length; i++) {
        line2 = lines[i];
        var p = intersectionPoint(line, line2);
        if (!p) continue;
        if ( pointOnLineSegment(p, line) && pointOnLineSegment(p, line2)) {
            newLines = [
                Line(line.a, p),
                Line(line.b, p),
                Line(line2.a, p),
                Line(line2.b, p)
            ];
            break;
        }
    }
    return newLines ? {add: newLines, remove: [line, line2]} : null;
}

function removeLine(line, lines) {
    var id = lines.indexOf(line);
    lines.splice(id, 1);
}

function createOutline(verts) {
    var lines = [];
    for (var i = 0; i < verts.length - 1; i++) {
        var a = verts[i];
        var b = verts[i + 1];
        lines.push(Line(a, b));
    }
    return lines;
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
}

function mouseDragged() {
    points.push(Point(mouseX, mouseY));
    point(mouseX, mouseY);
}
