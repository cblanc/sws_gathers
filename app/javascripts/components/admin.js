import React from "react";
import { object } from "prop-types"
import { MenubarMixin } from "javascripts/components/menubar";

class UserLogin extends React.Component {
  static propTypes = {
    socket: object.isRequired
  }

  state = {
    userId: null
  }

  handleChange = (e) => {
    const newId = e.target.value || null;
    this.setState({ userId: newId });
  }

  authorizeId = (id) => {
    this.props.socket.emit("users:authorize", {
      id: id
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.authorizeId(this.state.userId);
  }

  render = () => {
    return (
      <form>
        <div className="input-group signin">
          <input
            id="btn-input"
            type="text"
            className="form-control"
            vaue={this.state.userId}
            onChange={this.handleChange}
            placeholder="Change user (input ID)" />
          <span className="input-group-btn">
            <input
              type="submit"
              className="btn btn-primary"
              onClick={this.handleSubmit}
              value="Assume ID" />
          </span>
        </div>
      </form>
    );
  }
}

class ResetGatherButton extends React.Component {
  static propTypes = {
    socket: object.isRequired,
    gather: object.isRequired
  }

  handleGatherReset = () => {
    this.props.socket.emit("gather:reset", {
      type: this.props.gather.type
    });
  }

  render = () => {
    return (
      <button
        className="btn btn-danger max-width"
        onClick={this.handleGatherReset}>
        Reset {this.props.gather.name}</button>
    );
  }
}

class AdminPanel extends MenubarMixin(React.Component) {

  static propTypes = {
    socket: object.isRequired,
    gatherPool: object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = super.getInitialState();
  }

  render = () => {
    const gatherPool = this.props.gatherPool;
    const resetButtons = [];
    for (let attr in gatherPool) {
      let gather = gatherPool[attr];
      resetButtons.push(
        <ResetGatherButton socket={this.props.socket}
          gather={gather} key={gather.type} />
      );
    }
    return (
      <li className={this.componentClass()}>
        <a href="#" onClick={this.toggleShow}>
          <i className="fa fa-rebel"></i>
        </a>
        <ul className="dropdown-menu">
          <li className="header">Admin</li>
          <ul className="news-menu">
            <h5>Swap Into a Different Account (Only works for admins)</h5>
            <UserLogin socket={this.props.socket} />
            <h5>Gather Options</h5>
            <div>
              {resetButtons}
            </div>
          </ul>
        </ul>
      </li>
    );
  }
}

export { AdminPanel, ResetGatherButton }
