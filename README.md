
# SVGCatmullRomSpline
Make path line of SVG smooth.

- Convert series of CatmullRom points to Spline
- Simplify points (use [simplify-js](https://github.com/mourner/simplify-js))

### Demo
[demo page](https://satoshikawabata.github.io/SVGCatmullRomSpline/)

## Install
### download from url
```
https://satoshikawabata.github.io/SVGCatmullRomSpline/bundle.js
```

## Usage
### get spline points
```js
var points = [[0, 0], [200, 200], [200, 0], [0, 200]];
var splinePoints = SVGCatmullRomSpline.toPoints(points);
```

### apply spline attribute to SVG path
```js
var points = [[0, 0], [200, 200], [200, 0], [0, 200]];
var tolerance = 4;
var highestQuality = true;
var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
var attribute = SVGCatmullRomSpline.toPath(points.map(points), tolerance, highestQuality);
path.setAttributeNS(null, 'd', attribute);
```
