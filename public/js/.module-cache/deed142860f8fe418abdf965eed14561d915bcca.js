var gathererCounter = React.createClass({displayName: "gathererCounter",
  render: function () {
    return React.createElement("div", {class: "panel panel-primary"}, 
            React.createElement("div", {class: "panel-heading"}, 
              React.createElement("div", {class: "row"}, 
                React.createElement("div", {class: "col-xs-3"}, 
                  React.createElement("i", {class: "fa fa-users fa-5x"})
                ), 
                React.createElement("div", {class: "col-xs-9 text-right"}, 
                  React.createElement("div", {class: "huge", id: "gather-counter"}, "#"), 
                  React.createElement("div", null, "Gatherers Online")
                )
              )
            )
          )
  }
})