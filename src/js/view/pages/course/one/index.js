import React, {Component} from "react";
import {browserHistory} from "react-router";

import {httpGet} from "../../../../service";
import util from "../../../../store/util";
const baseUrl = `${util.baseUrl}api`;

class LeadOne extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const cid = this.props.params.courseId;

    httpGet(`${baseUrl}/clazz/${cid}/isTeacher`)
      .then((isTeacher) => {
        isTeacher
          ? browserHistory.replace(`/course/${cid}/one/student`)
          : location.replace(`/course/${cid}/one/chat`);
      });
  }

  componentWillUnmount() {
    // 退出笃师一对一，清空搜索数据
    delete sessionStorage.SHARK_ONE_KEY_WORD;
    delete sessionStorage.SHARK_ONE_SHOW_WAITING
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default LeadOne;
