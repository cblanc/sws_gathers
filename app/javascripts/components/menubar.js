var MenubarMixin = Base => class extends Base {

  getInitialState() {
    return {
      show: false
    }
  }

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  }

  componentClass = () => {
    let componentClass = ["dropdown", "messages-menu"];
    if (this.state.show) componentClass.push("open");
    return componentClass.join(" ");
  }
};

export { MenubarMixin }
