(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SVGCatmullRomSpline = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var simplify$1 = createCommonjsModule(function (module) {
/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (typeof undefined === 'function' && undefined.amd) undefined(function() { return simplify; });
else module.exports = simplify;

})();
});

var simplify = simplify$1;

function toPoints(points, tolerance, highestQuality) {
    var mappedToObjXY = mapPointsArray2ObjectXY(points);
    var simplified;
    if (tolerance !== undefined || highestQuality !== undefined) {
        simplified = simplify(mappedToObjXY, tolerance, highestQuality);
    } else {
        simplified = mappedToObjXY;
    }
    var converted = catmullRom2bezier(simplified);
    return converted;
}

function toPath(points, tolerance, highestQuality) {
    var cubics = toPoints(points, tolerance, highestQuality);
    var attribute = `M${points[0][0]}, ${points[0][1]}`;
    for (let i = 0; i < cubics.length; i++) {
        attribute += `C${cubics[i][0]},${cubics[i][1]} ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
    }
    return attribute;
}

function catmullRom2bezier(pts) {
    var cubics = [];
    for (var i = 0, iLen = pts.length; i < iLen; i++) {
        var p = [
            pts[i - 1],
            pts[i],
            pts[i + 1],
            pts[i + 2]
        ];
        if (i === 0) {
            p[0] = {
                x: pts[0].x,
                y: pts[0].y
            };
        }
        if (i === iLen - 2) {
            p[3] = {
                x: pts[iLen - 2].x,
                y: pts[iLen - 2].y
            };
        }
        if (i === iLen - 1) {
            p[2] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
            p[3] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
        }
        var val = 6;
        cubics.push([
            (-p[0].x + val * p[1].x + p[2].x) / val,
            (-p[0].y + val * p[1].y + p[2].y) / val,
            (p[1].x + val * p[2].x - p[3].x) / val,
            (p[1].y + val * p[2].y - p[3].y) / val,
            p[2].x,
            p[2].y
        ]);
    }
    return cubics;
}

function mapPointsArray2ObjectXY(points) {
    return points.map(function(point) {
        return {
            x: point[0],
            y: point[1]
        };
    });
}

var index = {
    toPoints: toPoints,
    toPath: toPath
};

return index;

})));
