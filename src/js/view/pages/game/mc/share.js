/**
 * 游戏页面
 * Morning Call
 *
 * ---
 * 游戏规则：
 *  1. 进入页面后，判断是否已经参加活动
 *  2. 如果是在活动报名期间，就可以报名
 *  3. 如果已经参加了，点击按钮进入房间
 */
import React, {Component} from "react";
import {Link} from "react-router";
import "../../../../../style/game/mc.scss";
import WeUI from "react-weui";
import WechatShare from "../../../../store/common/wechatShare";
const {Button} = WeUI;

class GameMcSharePage extends Component {
  constructor(props) {
    super(props);
    this.wechatShare = new WechatShare(
      '我们准备用一年的时间带你认识50位新朋友',
      `#`,
      `http://mp.weixin.qq.com/s/uVe2Nj43P98BI-gcpjNYqQ`,
      'http://qiniuprivate.gambition.cn/bV9B4c_wechat_tutor_a.png'
    );
  }

  componentDidMount() {
  }

  render() {
    return <div className="game-mc-page">
      <div className="share-img-section align-center p-t-md p-b-xs">
        <img className="share-img" src="http://qiniuprivate.gambition.cn/cbXKeq_uband%E6%B4%BB%E5%8A%A8%E5%AE%A3%E4%BC%A0%E5%9B%BE-%E7%BB%99%E5%90%8C%E6%B5%8E%E5%B0%8F%E5%8A%A9%E6%89%8B.png" alt=""/>
        <div className="share-desc p-t-xs text-xs">
          <div className="text-green"><strong>还不快把活动告诉朋友？</strong></div>
          <div>1.长按图片发送给朋友、室友.</div>
          <div>2.保存图片发送朋友圈.</div>
        </div>
        <Link to="/game/mc/index"><Button className="m-t-xs" type="default">返回</Button></Link>
      </div>

    </div>

  }

}

export default GameMcSharePage;