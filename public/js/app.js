var GatherCounter = React.createClass({displayName: "GatherCounter",
  render: function () {
    return (
      React.createElement("li", null, 
        React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-users fa-fw"}), " Gatherers (", this.props.count, ")")
      )
    );
  }
});

var Gatherer = React.createClass({displayName: "Gatherer",
  render: function () {
    return (
      React.createElement("li", null, 
        React.createElement("a", {href: "#"}, this.props.gatherer.username)
      )
    );
  }
});

var GathererMenu = React.createClass({displayName: "GathererMenu",
  componentDidMount: function () {
    socket.on('gatherCount', this.updateGatherers);
  },
  updateGatherers: function (data) {
    this.setProps({
      count: data.count,
      gatherers: data.gatherers
    });
  },
  render: function () {
    var gatherers = this.props.gatherers.map(function (gatherer) {
      return (
        React.createElement(Gatherer, {gatherer: gatherer})
      );
    });
    return (
      React.createElement("ul", {className: "nav", id: "side-menu"}, 
        React.createElement(GatherCounter, React.__spread({},  this.props)), 
        gatherers
      )
    );
  }
});



React.render(React.createElement(GathererMenu, {count: 0, gatherers: []}), document.getElementById('side-menu'));