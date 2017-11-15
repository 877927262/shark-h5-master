import React, { Component } from "react";
import { browserHistory } from "react-router";

class RedirectPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { target } = this.props.location.query;

    setTimeout(() => {
      if (target) {
        if (target.startsWith("/enroll/pay/")) {
          // 如果到支付页面则替换
          window.location.href = target;
        } else {
          browserHistory.replace(target);
        }
      } else {
        browserHistory.replace('/');
      }
    }, 0);
  }

  render() {
    return (
      <div className="page page-current">
        页面跳转中。。。。
      </div>
    )
  }
}

export default RedirectPage;
