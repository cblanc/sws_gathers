var GatherCounter = React.createClass({
  render: function () {
    return (
      <li>
        <a href="#"><i className="fa fa-users fa-fw"></i> Gatherers ({this.props.count})</a>
      </li>
    );
  }
});

var Gatherer = React.createClass({
  render: function () {
    return (
      <li>
        <a href="#">{this.props.gatherer.username}</a>
      </li>
    );
  }
});

var GathererMenu = React.createClass({
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
        <Gatherer gatherer={gatherer} />
      );
    });
    return (
      <ul className="nav" id="side-menu">
        <GatherCounter {...this.props} />
        {gatherers}
      </ul>
    );
  }
});



React.render(<GathererMenu count={0} gatherers={[]} />, document.getElementById('side-menu'));