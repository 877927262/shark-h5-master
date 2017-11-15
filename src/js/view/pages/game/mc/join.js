"use strict";

/**
 * 游戏加入页面
 * Morning Call
 * ---
 * 游戏规则：
 *  填写信息，加入游戏
 *
 */
import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";
import "../../../../../style/game/mc.scss";

const { CellsTitle, TextArea, Select, CellBody, Form, FormCell } = WeUI;


@inject("User", 'MorningCall') @observer
class GameMcJoinPage extends Component {
  constructor(props) {
    super(props);
    this.mc = this.props.MorningCall;
  }

  componentDidMount() {
    this.mc.fetchUserStatus()
      .then(() => {
        const { toast, userStatus } = this.mc;
        const joinStatus = userStatus.joinStatus;
        if (joinStatus !== 'NOT_JOIN') {
          toast.showToast({ text: '您已报名', icon: 'warn', cb: () => browserHistory.replace('/game/mc/index') });
        }
      });
  }

  render() {
    const { info } = this.props.User;
    const {
      userApply, updateUserGender, updateUserTargetGender, updateUserselfDesc,
      submitApplyEventHandler
    } = this.mc;
    return <div className="game-mc-page">
      <div className="mc-join-area">
        <div className="mc-head">
          <img
            src={info.headImgUrl}
            className="mc-head-icon"/>
        </div>
        <div className="mc-logo">
          <img src="http://qiniuprivate.gambition.cn/Ugaq8G_mc-logo2.png" alt="" className="mc-logo-img"/>
        </div>

        <div className="mc-desc">
          <p className="mc-slogan">一周,认识一位优质朋友</p>
          <ul>
            <li className="text-gray">请填写您的匿名的信息报名</li>
          </ul>
          <CellsTitle>你是</CellsTitle>
          <Form>
            <FormCell select>
              <CellBody>
                <Select value={userApply.userGender} onChange={updateUserGender}>
                  <option value="1">男孩纸</option>
                  <option value="2">女孩纸</option>
                </Select>
              </CellBody>
            </FormCell>
          </Form>
          <CellsTitle>你想找</CellsTitle>
          <Form>
            <FormCell select>
              <CellBody>
                <Select value={userApply.targetGender} onChange={updateUserTargetGender}>
                  <option value="1">男孩纸</option>
                  <option value="2">女孩纸</option>
                  <option value="0">无所谓</option>
                </Select>
              </CellBody>
            </FormCell>
          </Form>
          <CellsTitle>一句话介绍自己</CellsTitle>
          <Form>
            <FormCell>
              <CellBody>
              <TextArea value={userApply.selfDesc}
                        onChange={updateUserselfDesc}
                        placeholder="如：我是一个粉刷匠..."
                        rows="2"
                        maxlength="100"/>
              </CellBody>
            </FormCell>
          </Form>
          <div className="mc-join">
            <button className="button button-fill mc-button" onClick={submitApplyEventHandler}>确定参加</button>
            <Link to="/game/mc/index">
              <div className="text-center text-xs m-t-xs text-gray">返回</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="divide-full m-t-md"/>

      <p className="m-xxs text-xxs text-center p-xs">本活动最终解释权归友班所有.</p>
    </div>
  }
}

export default GameMcJoinPage;
