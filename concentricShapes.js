var BACKGROUND_COLOR = 200;
var EPSILON = 5;

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

function getIntersections(line, lines) {
    var intersections = [];
    for (var i = 0; i < lines.length; i++) {
        line2 = lines[i];
        var p = intersectionPoint(line, line2);
        if (p && pointOnLineSegment(p, line) && pointOnLineSegment(p, line2)) {
            intersections.push({point: p, lineA: line, lineB: line2});
            point(p.x, p.y);
        }
    }
    return intersections;
}

function removeLine(line, lines) {
    var id = lines.indexOf(line);
    lines.splice(id, 1);
}

function createOutline(verts) {
    var lines = [];
    var i;
    for (i = 0; i < verts.length - 1; i++) {
        var a = verts[i];
        var b = verts[i + 1];
        lines.push(Line(a, b));
    }
    if (lines.length >= 2) lines.push(Line(lines[lines.length - 1].b, lines[0].a));
    var intersections = [];
    for (i = 0; i < lines.length - 4; i++) {
        var res = getIntersections(lines[i], lines.slice(i + 2, lines.length));
        if (res) intersections = intersections.concat(res);
    }
    console.log(intersections);
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
    strokeWeight(6);
    stroke(0);
    for(var i=0; i<points.length; i++) point(points[i].x, points[i].y);
    strokeWeight(5);
    stroke(255, 0, 0);
    var outline = createOutline(points);
    strokeWeight(2);
    stroke(0);
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
