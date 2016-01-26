const React = require("react");
const ReactDOM = require("react-dom");
const App = require("javascripts/components/main");

module.exports = function (mount) { 
	ReactDOM.render(<App />, mount);
};
