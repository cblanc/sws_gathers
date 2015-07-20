// var GathererCounter = React.createClass({
//   componentDidMount: function () {
//     socket.on('gatherCount', this.updateCount)
//   },
//   updateCount: function (data) {
//     console.log(data);
//     this.setProps({count: data.count});
//   },
//   render: function () {
//     return (<div className="panel panel-primary">
//             <div className="panel-heading">
//               <div className="row">
//                 <div className="col-xs-3">
//                   <i className="fa fa-users fa-5x"></i>
//                 </div>
//                 <div className="col-xs-9 text-right">
//                   <div className="huge" id="gather-counter">
//                     {this.props.count}
//                   </div>
//                   <div>Gatherers Online</div>
//                 </div>
//               </div>
//             </div>
//           </div>);
//   }
// });

var MenuCounter = React.createClass({displayName: "MenuCounter",
  componentDidMount: function () {
    socket.on('gatherCount', this.updateCount)
  },
  updateCount: function (data) {
    this.setProps({count: data.count});
  },
  render: function () {
    return (
      React.createElement("li", null, 
        React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-users fa-fw"}), " Gatherers (", this.props.count, ")")
      )
    );
  }
});

React.render(React.createElement(MenuCounter, {count: 0}), document.getElementById('sideMenu'));