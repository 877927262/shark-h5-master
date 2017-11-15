import React, { Component } from "react";
import {Link} from "react-router";
import { Button } from "react-weui";
import WeuiIcon from "../WeuiIcon";

import "../../../style/not-found.scss";

class NotFoundPage extends Component {
  render() {
    return (
        <div className="page page-current not-found-page">
          <WeuiIcon size="large" value="warn"/>
          <footer>
            <h3>出错了哟</h3>
            <p>非常抱歉，服务器开小差了<br/>请点击下方按钮返回至课程主页</p>
            <Button component={Link} to="/course/list" style={{color: 'white'}}>课程主页</Button>
          </footer>
        </div>
    )
  }
}

export default NotFoundPage;
