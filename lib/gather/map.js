"use strict";

var fs = require("fs");
var path = require("path");
var client = require(path.join(__dirname, "../ensl/client"))();
const mapsPath = path.join(__dirname, "../../config/data/maps.json");
const REFRESH_INTERVAL = 1000 * 60 * 60; // Check every hour

function Map () {

}

Map.list = JSON.parse(fs.readFileSync(mapsPath)).maps;

Map.updateMapList = () => {
	client.getMaps((error, result) => {
		if (error) {
			winston.error("Unable to download server list")
			winston.error(error);
			return;
		};
		Map.list = result.maps;
	});
};

Map.updateMapList();

setInterval(Map.updateMapList, REFRESH_INTERVAL);

module.exports = Map;
