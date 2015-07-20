var MenuCounter = React.createClass({
  componentDidMount: function () {
    socket.on('gatherCount', this.updateCount)
  },
  updateCount: function (data) {
    this.setProps({count: data.count});
  },
  render: function () {
    return (
      <li>
        <a href="#"><i className="fa fa-users fa-fw"></i> Gatherers ({this.props.count})</a>
      </li>
    );
  }
});

React.render(<MenuCounter count={0} />, document.getElementById('side-menu'));