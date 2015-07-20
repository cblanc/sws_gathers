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

React.render(React.createElement(MenuCounter, {count: 0}), document.getElementById('side-menu'));