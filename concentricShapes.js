var BACKGROUND_COLOR = 200;
var LAYER_PADDING = 5;
var POINT_CREATION_THRESHOLD = 5;
var MIDPOINT_CREATION_THRESHOLD = 20;
var POINT_DISTANCE_THRESHOLD = 0.01;
var KEY_C = 67;
var KEY_R = 82;

var concentricMode = false;
var lastX = 0;
var lastY = 0;

//var allIntersections = [];
var allPoints = [];
//var allLines = [];
var points = [[]]; // list of lists
var outlines = []; // list of lists

function drawLines(lines) {
    for (var i = 0; i < lines.length; i++){
        var p1 = lines[i].a;
        var p2 = lines[i].b;
        //stroke(255, 0, 0);
        //strokeWeight(3);
        line(p1.x, p1.y, p2.x, p2.y);
        //strokeWeight(6);
        //stroke(0);
        //point(p1.x, p1.y);
        //point(p2.x, p2.y);

    }
}

function getNewPoint(line1, line2) {
    // get unit vectors from adjacent lines with middle point as origin
    var v1 = lineToUnitVec(line1.b, line1.a);
    var v2 = lineToUnitVec(line2.a, line2.b);
    // get the angle between the vectors
    var angleDir = v2.cross(v1).z >= 0 ? 1 : -1;
    var angle = angleDir * acos(constrain(v2.dot(v1), -1, 1));
    // get the vector from which we start calculating the angle
    var right = createVector(angleDir * 1, 0);
    // get the angle between the second vector and the angle start vector
    var v2AngleDir = v2.cross(right).z >= 0 ? 1 : -1;
    var v2Angle = v2AngleDir * acos(constrain(v2.dot(right), -1, 1)); 
    // place new point in between the original vectors
    var newAngle = angle / 2 - v2Angle;
    // add new point 
    return Point(LAYER_PADDING * cos(newAngle) + line2.a.x, LAYER_PADDING * sin(newAngle) + line2.a.y)
}

function findPointWithinDistance(p, distance) {
    var v1 = createVector(p.x, p.y);
    for (var i = 0; i < allPoints.length; i++) {
        var v2 = createVector(allPoints[i].x, allPoints[i].y);
        var v1v2Distance = abs(v1.dist(v2));
        if (lt(v1v2Distance, distance, POINT_DISTANCE_THRESHOLD)) {
            return allPoints[i];
        }
    }
    return null;
}

function addLayer(outline, pInd) {
    var layerLines = [];
    var line1 = outline[outline.length - 1];
    var line2;
    var lastP;
    var newPoints = [];
    for (var i = 0; i < outline.length; i++) {
        line2 = outline[i];
        var newP = getNewPoint(line1, line2);
        line1 = line2;
        if (findPointWithinDistance(newP, LAYER_PADDING)) continue;
        newPoints.push(newP);
        if (lastP){
            var newLine = Line(lastP, newP);
            //var intersections = getIntersections(newLine, allLines);
            //if (intersections.length > 0) console.log(intersections);
            //allIntersections = allIntersections.concat(intersections);
            layerLines.push(newLine);
        }
        lastP = newP;
    }
    if (layerLines.length > 1) layerLines.push(Line(lastP, layerLines[0].a));
    allPoints = allPoints.concat(newPoints);
    return layerLines;
}

function getMidPoint(p1, p2) {
    var v = createVector(p2.x - p1.x, p2.y - p1.y)
    if (v.mag() <= MIDPOINT_CREATION_THRESHOLD) return null;
    v.mult(0.5);
    return Point(p1.x + v.x, p1.y + v.y);
}

function addMidPoints(outline) {
    var newOutline = [];
    for (var i = 0; i < outline.length; i++) {
        var line = outline[i];
        var midpoint = getMidPoint(line.a, line.b)
        if (midpoint && !findPointWithinDistance(midpoint, POINT_DISTANCE_THRESHOLD)) {
            newOutline.push(Line(line.a, midpoint));
            newOutline.push(Line(midpoint, line.b));
        } else {
            newOutline.push(line);
        }
    }
    return newOutline;
}

function resetCanvas(){
    clear();
    background(BACKGROUND_COLOR);
    strokeWeight(3);
    stroke(0);
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    resetCanvas();
}

function createOutlines() {
    resetCanvas();
    for (var i = 0; i < points.length - 1; i++) {
        var outline = createOutline(points[i]);
        outlines.push(outline);
        drawLines(outline);
        allPoints = allPoints.concat(points[i]);
    }
}

function addLayers() {
    stroke(255, 0, 0);
    var i;
    for (i = 0; i < outlines.length; i++) {
        var outline = addMidPoints(outlines[i]);
        outlines[i] = addLayer(outline, i);
        //allLines = allLines.concat(outlines[i]);
    }
    for (i = 0; i < outlines.length; i++) {
        drawLines(outlines[i]);
    }
    /*
    for (i = 0; i < allIntersections.length; i++) {
        stroke(0, 0, 255);
        point(allIntersections[i].point.x, allIntersections[i].point.y );
    }
    allIntersections.length = 0;
    */

}

function mouseReleased(){
    if (concentricMode && outlines.length) {
        addLayers();
    } else {
        points.push([]);
    } 
}

function refresh() {
    concentricMode = false;
    resetCanvas();
    points = [[]];
    outlines = [];
    allPoints = [];
}

function keyReleased() {
    if (keyCode === KEY_C && !concentricMode) {
        concentricMode = true;
        createOutlines();
    } else if (keyCode === KEY_R) {
        refresh();
    }
}

function mouseDragged() {
    if (!concentricMode &&
        (!eq(lastX, mouseX, POINT_CREATION_THRESHOLD) || 
        !eq(lastY, mouseY, POINT_CREATION_THRESHOLD))
        ) {
            points[points.length - 1].push(Point(mouseX, mouseY));
            lastX = mouseX;
            lastY = mouseY;
            point(mouseX, mouseY);
    }
}
