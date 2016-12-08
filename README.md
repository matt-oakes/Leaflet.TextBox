# Leaflet.TextBox
Add a text box to the leaflet map using the SVG renderer.

## Leaflet version
The example is develped against Leaflet 1.0.

## Usage
The library works by adding a `setText` method to the `Rectangle` layers.

Basic example:
```
// Standard leaflet map setup
var map = L.map('map').setView([50.842941, -0.131312], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add the rectangle and set the text
var bounds = [[50.832941, -0.111312], [50.842941, -0.141312]];
var rectangle = L.rectangle(bounds, {color: "#ff7800", weight: 4})
rectangle.addTo(map);
rectangle.setText("Hello. This is a really long peice of text which should span multiple lines. It should not split words or overflow the box.")
```

## Demo
See the example in `example/index.html`.

## Changelog
### `0.1.0`
Initial release

## Licence
MIT
