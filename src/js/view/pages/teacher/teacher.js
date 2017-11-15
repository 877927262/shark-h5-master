/**
 * Created by violinsolo on 20/07/2017.
 */
'use strict';

import React, { Component } from "react";
import { observer } from "mobx-react";

import "../../../../style/teacher.scss";

@observer
class Teacher extends Component {
  constructor(props) {
    super(props);
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

export default Teacher;
