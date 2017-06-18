'use strict';

var findClosestCenter = function(point, centers) {
    var n = centers.length;
    var minIndex = 0;
    var i = 0;
    var dist;
    var minDist = distPoints(point, centers[i]);
    for (i = 1; i < n; i++) {
        if ((dist = distPoints(point, centers[i])) < minDist) {
            minIndex = i;
            minDist = dist;
        }
    }
    return {
        center: centers[minIndex],
        index: minIndex,
        dist: minDist
    };
}
var findCenters = function(points, k) {
    // For the K-means++: https://en.wikipedia.org/wiki/K-means%2B%2B
    var centers = [];
    var n = points.length;
    var distArray;
    var i, j;
    //1 - Choose one center uniformly at random from among the data points
    centers.push(points[randomInt(0, n)]);
    for (i = 1; i < k; i++) {
        //2 - For each data point x, compute D(x), the distance between x and the nearest center that has already been chosen
        distArray = []
        for (j = 0; j < n; j++) {
            distArray.push(Math.pow(findClosestCenter(points[j], centers).dist, 2));
        }
        //3 - Choose one new data point at random as a new center, using a weighted probability distribution where a point x is chosen with probability proportional to D(x)2
        centers.push(choiceWeighted(points, distArray));
    }//4 - Repeat Steps 2 and 3 until k centers have been chosen.
    return centers;
}
/*
 var clusterInertias = function(points, clusters, centers) {
    var n = points.length;
    var k = centers.length;
    var i, j;
    var inertias = initArray(0, k);
    for (i = 0; i < n; i++) {
        j = clusters[i];
        inertias[j] += Math.pow(points[i].x - centers[j].x, 2) + Math.pow(points[i].y - centers[j].y, 2);
    }
    return inertias;
}
*/
var kmeans = function(points, k, centers, iterMax) {
    var n = points.length;
    var point;
    var centerIndex;
    var iter = 0;
    var i;
    var clusters = [];
    var clustersChanged = true;
    //Init centers
    var clusterSizes = initArray(0, k);

    // Initialize clusters
    for (i = 0; i < n; i++) {
        centerIndex = findClosestCenter(points[i], centers).index;
        clusters.push(centerIndex);
    }
    // Run K-means
    while (clustersChanged && iter < iterMax) {
        //--- Re-compute centers

        // Init centers
        for (i = 0; i < k; i++) {
            centers[i] = {x: 0, y: 0};
            clusterSizes[i] = 0;
        }
        // Sum point coordinates and point count
        for (i = 0; i < n; i++) {
            point = points[i];
            centers[clusters[i]].x += point.x;
            centers[clusters[i]].y += point.y;
            clusterSizes[clusters[i]]++;
        }
        // Divide by centerSizes to get the average
        for (i = 0; i < k; i++) {
            if (clusterSizes[i]) {
                centers[i].x /= clusterSizes[i];
                centers[i].y /= clusterSizes[i];
            }
            else {
                console.log("Division by zero!");
                centers[i].x = width/2;
                centers[i].y = height/2;
            }
        }

        //--- Re-compute clusters

        // Assign points to a cluster
        clustersChanged = false;
        for (i = 0; i < n; i++) {
            centerIndex = findClosestCenter(points[i], centers).index;
            if (clusters[i] != centerIndex) {
                clusters[i] = centerIndex;
                clustersChanged = true;
            }
        }
        iter++;
    }

    return {
        centers: centers,
        clusters: clusters,
        clusterSizes: clusterSizes
    }
}