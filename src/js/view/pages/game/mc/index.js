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
import {observer, inject} from "mobx-react";

import "../../../../../style/game/mc.scss";
import WechatShare from "../../../../store/common/wechatShare";
import IMAGE_URL_MAP from "../../../BigImageUrl";

@inject("User", "MorningCall") @observer
class GameMcIndexPage extends Component {

  constructor(props) {
    super(props);
    this.mc = this.props.MorningCall;
    this.wechatShare = new WechatShare(
      '我们准备用一年的时间带你认识50位新朋友',
      `#`,
      `http://mp.weixin.qq.com/s/uVe2Nj43P98BI-gcpjNYqQ`,
      IMAGE_URL_MAP["WECHAT_TUTOR_A"]
    );
  }

  componentDidMount() {
    this.mc.fetchUserStatus();
  }

  render() {
    const {info} = this.props.User;
    const {userStatus} = this.mc;

    return <div className="game-mc-page">
      <div className="mc-up-area">
        <div className="mc-head">
          <img
            src={info.headImgUrl}
            className="mc-head-icon"/>
        </div>

        <div className="mc-bg-area align-center">
        <div className="mc-logo">
          <img src="http://qiniuprivate.gambition.cn/Ugaq8G_mc-logo2.png" alt="" className="mc-logo-img"/>
        </div>
        <div className="mc-desc">
          <p className="mc-slogan">一周,认识一位优质朋友</p>

          <ul>
            <li>1. 填写匿名信息参与活动配对</li>
            <li>2. 匿名交流共同完成每日任务</li>
            <li>3. 一周之后选择是否继续联系</li>
          </ul>

          <div className="mc-join">
            {
              ((status)=> {
                if (status == 'PENDING') {
                  return <button className="button button-fill mc-button mc-button-success"
                                 onClick={e=>alert('耐心等待匹配通知哦！')}>报名成功，等待匹配</button>
                } else if (status == 'PROCESSING') {
                  return <Link to="/game/mc/room"><button className="button button-fill mc-button mc-button-success">已结对，进入房间</button>
                    </Link>;
                } else {
                  return <Link to="/game/mc/join">
                    <button className="button button-fill mc-button">猛戳加入</button>
                  </Link>;
                }
              })(userStatus.joinStatus)
            }
          </div>

          <p className="text-center"><Link to="/game/mc/share">我要去告诉朋友> </Link></p>
        </div>
        </div>
        <div className="divide-full m-t-md"></div>

      </div>

      <div className="mc-statistics m-t">
        <p className="text-center text-xs">统计信息</p>
        <div className="divide-sm"></div>

        <div className="mc-st-gender p-t align-center">
          <div className="mc-st-gender mc-st-man">
            <img src={IMAGE_URL_MAP["MC_MAN"]} alt="" className="mc-gender-icon"/>
            <p className="m-xxs text-xs">{userStatus.statistics.male} 男生</p>
          </div>
          <div className="mc-st-gender mc-st-women">
            <img src={IMAGE_URL_MAP["MC_WOMEN"]} alt="" className="mc-gender-icon"/>
            <p className="m-xxs text-xs">{userStatus.statistics.female} 女生</p>
          </div>
        </div>
        <div className="p-t">
          <img src={IMAGE_URL_MAP["MC_ARROW"]} alt="" className="mc-arrow align-center p-t-xs"/>
        </div>
        <div>
          <img src={IMAGE_URL_MAP["MC_MAN_WOMEN"]} alt="" className="mc-wm align-center p-t"/>
          <p className="m-xxs text-xs text-center p-t-xs">总 {userStatus.statistics.total} 人</p>
        </div>
      </div>
      <div className="divide-full m-t"></div>
      <p className="m-xxs text-xxs text-center p-xs">本活动最终解释权归友班所有.</p>
    </div>
  }
}

export default GameMcIndexPage;
