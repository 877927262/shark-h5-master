import React, { Component } from "react";
import { Button } from "react-weui";

import "../../../style/subscribe-guide.scss";
import IMAGE_URL_MAP from "../BigImageUrl";

class NotFoundPage extends Component {
  render() {
    return (
        <div className="page page-current subscribe-guide-page">
          <header>
            <p className="unfollow">亲，还没有关注 Uband友班 公众号</p>

            <img src={IMAGE_URL_MAP["QRCODE_FOR_SUBSCRIBE"]} alt="Uband公众号" className="uband-qrcode"/>
            <p className="follow-guide">长按识别二维码，获取更多优质内容</p>
          </header>
          <footer className="fixed-bottom">
            <p>或在微信中搜索 Uband友班 找到我们</p>
            <i>Uband友班欢迎您的加入</i>
          </footer>
        </div>
    )
  }
}

export default NotFoundPage;
