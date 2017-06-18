var inverse_sqrt_2pi = 1/Math.sqrt(2*Math.PI);

var randomScalar = function(min, max) {
    return (max - min)*Math.random() + min;
}
var randomInt = function(min, max) {
    return Math.floor(randomScalar(min, max));
}
var randomPoints = function(n, boundingbox) {
    var i;
    var pointsOut = [];
    for (i = 0; i < n; i++) {
        pointsOut.push({
            x: randomScalar(boundingbox.xMin, boundingbox.xMax),
            y: randomScalar(boundingbox.yMin, boundingbox.yMax)
        });
    }
    return pointsOut;
}
var distPoints = function(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

var gaussianCenteredFunc = function(x2, sigma) {
    return (inverse_sqrt_2pi/sigma)*Math.exp(-x2/(2*Math.pow(sigma, 2)));
}

var applyPointGaussianForce = function(point, center, force, sigma, noise) {
    var xNoise = noise*(0.5 - Math.random());
    var yNoise = noise*(0.5 - Math.random());
    var dist2 = Math.pow(point.x - center.x + xNoise, 2) + Math.pow(point.y - center.y + yNoise, 2);
    var dist = Math.sqrt(dist2);
    var gaussianForce = force*gaussianCenteredFunc(dist2, sigma);
    point.x += gaussianForce*(point.x - center.x + xNoise)/dist;
    point.y += gaussianForce*(point.y - center.y + yNoise)/dist;
    return point;
}

var applyBoundaryGaussianForce = function(point, boundarybox, force, sigma) {
    //xMin
    var dist = point.x - boundarybox.xMin;
    var dist2 = Math.pow(dist, 2);
    var gaussianForce = force*gaussianCenteredFunc(dist2, sigma);
    point.x += gaussianForce;
    //xMax
    dist = boundarybox.xMax - point.x;
    dist2 = Math.pow(dist, 2);
    gaussianForce = force*gaussianCenteredFunc(dist2, sigma);
    point.x -= gaussianForce;
    //yMin
    dist = point.y - boundarybox.yMin;
    dist2 = Math.pow(dist, 2);
    gaussianForce = force*gaussianCenteredFunc(dist2, sigma);
    point.y += gaussianForce;
    //yMax
    dist = boundarybox.yMax - point.y;
    dist2 = Math.pow(dist, 2);
    gaussianForce = force*gaussianCenteredFunc(dist2, sigma);
    point.y -= gaussianForce;
    return point;
}

var applyBoundingbox = function (point, boundingbox) {
    point.x = Math.min(Math.max(point.x, boundingbox.xMin + 1), boundingbox.xMax - 1);
    point.y = Math.min(Math.max(point.y, boundingbox.yMin + 1), boundingbox.yMax - 1);
    return point;
}

var initArray = function(value, n) {
    var array = [];
    var i;
    for (i = 0; i < n; i++) {
        array.push(value);
    }
    return array;
}
var setArrayValue = function(array, value) {
    var n = array.length;
    var i;
    for (i = 0; i < n; i++) {
        array[i] = value;
    }
    return array;
}

var choiceWeighted = function(items, weights) {
    var n = items.length;
    var weightSum = 0;
    var i;
    for (i = 0; i < n; i++) {
        weightSum += weights[i];
    }
    var rand = randomScalar(0, weightSum);
    var partialSum = 0;
    for (i = 0; i < n; i++) {
        partialSum += weights[i];
        if (rand < partialSum) {
            return items[i];
        }
    }
    console.log("From choiceWeighted(): should not get here!");
}


















