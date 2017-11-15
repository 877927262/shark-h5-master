'use strict';

import React, { Component } from "react";

class Enroll extends Component {
  constructor(props) {
    super(props);
    this.user = this.props.User;
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="page-group">
        {this.props.children}
      </div>
    )
  }
}


export default Enroll;
