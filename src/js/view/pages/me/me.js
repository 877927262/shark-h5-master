'use strict';

import React, {Component} from "react";
import {observer, inject} from "mobx-react";

import "../../../../style/me.scss";

@inject("User") @observer
class Me extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.User;
  }

  componentDidMount() {
    this.user.fetchInfo(this.user.setInfo);
  }


  render() {
    return (
      <div className="page-group">
        {this.props.children}
      </div>
    )
  }
}

export default Me;
