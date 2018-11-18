const React = require("react");
const ReactDOM = require("react-dom");
const App = require("javascripts/components/main");
const io = require("socket.io-client");
const socketUrl = window.location.protocol + "//" + window.location.host;
const socket = io(socketUrl.replace(/^http/,'ws'));

module.exports = function (mount) {
	ReactDOM.render(<App socket={socket} />, mount);
};

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
