import React, { Component } from "react";
import { observer, inject, PropTypes } from "mobx-react";

@inject("User", "MorningCall") @observer
class Game extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.User;
    this.mc = this.props.MorningCall;
  }

  componentDidMount() {
    this.user.fetchInfo(data => this.user.setInfo(data));
    this.mc.fetchActivityId();
  }

  render() {
    const { tempClazzId } = this.mc;

    return (
      tempClazzId == null
        ? <div/>
        : (<div className="game-page-group">{this.props.children}</div>)
    )
  }
}

export default Game;
