'use strict';

import React, {Component} from "react";
import {observer, inject} from "mobx-react";

import "../../../../style/activity.scss";

@inject("User") @observer
class Activity extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.User;
  }

  componentDidMount() {
    this.user.fetchInfo(data=>this.user.setInfo(data));
  }

  render() {
    return (
      <div className="page-group">
        {this.props.children}
      </div>
    )
  }
}

export default Activity;
