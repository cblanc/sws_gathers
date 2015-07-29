"use strict";

var fs = require("fs");
var path = require("path");
var source = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config/data/maps.json")));
var mapList = source.maps;

function Map () {

}

Map.list = mapList;

module.exports = Map;
