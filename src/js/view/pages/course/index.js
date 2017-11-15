'use strict';

import React, {Component} from "react";

import "../../../../style/course.scss";

class Course extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page-group">
        {this.props.children}
      </div>
    )
  }
}

export default Course;
