var EPSILON = 5;

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

function len(line) {
    var xDiff = line.a.x - line.b.x;
    var yDiff = line.a.y - line.b.y;
    return sqrt(xDiff * xDiff + yDiff * yDiff);
}

function lineToUnitVec(p1, p2) {
    var v = createVector(p1.x - p2.x, p1.y - p2.y).normalize();
    return v;
}