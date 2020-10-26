import React from "react";
import { array } from "prop-types";
class Events extends React.Component {
  static propTypes = {
    events: array.isRequired
  }

  getTime(timeString) {
    return (new Date(timeString)).toTimeString().match(/^[\d:]*/)[0];
  }

  render = () => {
    let events;
    if (this.props.events.length) {
      events = this.props.events.map(event => {
        return `${this.getTime(event.createdAt)} ${event.description}`;
      }).join("\n");
      return (
        <pre className="events-panel">
          {events}
        </pre>
      );
    } else {
      return (
        <pre className="events-panel">
          Listening for new events...
        </pre>
      );
    }
  }
}

export { Events }
