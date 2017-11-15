/**
 * 游戏房间页面
 * Morning Call
 * ---
 * 游戏规则：
 *  填写信息，加入游戏
 *
 */
import React, { Component } from "react";
import { observer, inject, PropTypes } from "mobx-react";
import WeUI from "react-weui";
import "../../../../../style/game/mc.scss";

const { Dialog } = WeUI;

@inject("User", "MorningCall") @observer
class GameMcRoomPage extends Component {
  constructor(props) {
    super(props);
    this.mc = this.props.MorningCall;
  }

  componentDidMount() {
    this.mc.fetchUserRoomInfo();
  }

  render() {
    const { info } = this.props.User;
    const { userRoomInfo, quitUserRoom, dialog } = this.mc;

    return <div className="game-mc-page">
      <div className="mc-room-head align-center">
        <p className="mc-room-number text-center">U树洞房间</p>
        <img src={userRoomInfo.userInfo.headImgUrl} className="mc-head-icon mc-user-head float-left"/>
        <img src={userRoomInfo.partnerInfo.headImgUrl} className="mc-head-icon mc-user-head float-right"/>
      </div>
      <div className="mc-room-status align-center m-t">
        <div className="text-center text-xs p-t">
          {userRoomInfo.statusDesc}
        </div>
      </div>
      <div>
        <ul>
          <li>

          </li>
        </ul>
      </div>
      <div className="mc-room-btn">
        <button className="button button-fill mc-button" onClick={e => dialog.showDialog()}>终止</button>

      </div>

      <div className="divide-full m-t-md"></div>
      <p className="m-xxs text-xxs text-center p-xs">本活动最终解释权归友班所有.</p>

      <Dialog type="ios" title="确认终止？" show={dialog.show} buttons={[
        {
          type: 'default',
          label: '取消',
          onClick: (e) => dialog.dismissDialog()
        },
        {
          type: 'primary',
          label: '确认',
          onClick: (e) => quitUserRoom()
        }
      ]}>
        终止后，你们将失去联系
      </Dialog>
    </div>
  }
}

export default GameMcRoomPage;
