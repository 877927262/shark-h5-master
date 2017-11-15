"use strict";

import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import { Toptips } from "react-weui";

import _ from "../util";
import config from "../../config";

import httpToast from "../../store/common/httpToast";
import topTip from "../../store/common/toptip";

import WeuiToast from "../WeuiToast";
import WeuiIcon from "../WeuiIcon";
import "../../../style/auth.scss"

const SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PENDING = "PENDING";

@inject("Auth", "SystemConfig") @observer
class Auth extends Component {
  constructor(props) {
    super(props);

    this.auth = new this.props.Auth();

    this.wechatLogin = this.wechatLogin.bind(this);

    this.systemConfig = new this.props.SystemConfig();
  }

  componentWillMount() {
    const {code, state} = this.props.location.query;
    const {setAuthState, checkExpire}  = this.auth;
    const token = localStorage.token;

    /*
     测试环境注释以下 if else 语句
     */
    if (config.isProduct) {
      if (token !== undefined && token !== null) {
        // token在大于5天，则重新授权
        if (checkExpire(token)) {
          this.wechatLogin(code, state);
        } else {
          setAuthState(SUCCESS);
        }
      } else {
        this.wechatLogin(code, state);
      }
    }

    if (_.isIOS()) {
      this.systemConfig.fetchAppInfo('IOS');
    } else {
      this.systemConfig.fetchAppInfo('ANDROID');
    }
  }

  // 微信登录
  wechatLogin(code, state) {
    const {getWechatLogin, setAuthState, getToken, setToken}  = this.auth;
    if (typeof state === "undefined") {
      getWechatLogin(location.pathname)
        .then((url) => location.replace(url))
    } else {
      if (typeof code === "undefined") {
        setAuthState(FAILURE);
      } else {
        getToken(code)
          .then(setToken)
          .then(() => location.replace(_.removeUrlParameter(`${ location.pathname}${ location.search }`, 'code')));
      }
    }
  }

  render() {
    /*
     测试环境请打开
     */
    if (!config.isProduct) {
      this.auth.setAuthState(SUCCESS);
    }

    const {state} = this.auth;
    const { appInfo } = this.systemConfig;
    const self = this;

    return (
      <div>
        <Toptips type={topTip.type} show={topTip.show}>{topTip.content}</Toptips>
        {
          (function (state) {
            switch (state) {

              case SUCCESS:
                return (
                  <div>
                    {self.props.children}
                    {
                      appInfo
                      ? (<footer className="bar bar-tab" id="app-advertisement">
                          <div className="fix-end">
                            <div className="sm-txt">
                              <span className="cost-txt">友班App, 更好的体验</span>
                            </div>
                            <div>
                              <div onClick={() => window.location.href = appInfo.url}
                                   className="button button-fill enroll-button">
                                点击下载
                              </div>
                            </div>
                          </div>
                        </footer>)
                        : null
                    }
                  </div>);

              case FAILURE:
                return (
                  <div className="auth-page">
                    <WeuiIcon size="large" value="warn" className="icon-pos"/>
                    <div className="text">
                      微信授权失败，请重试
                    </div>
                  </div>);

              case PENDING:
                return (
                  <div/>
                )
            }
          })(state)
        }
        <WeuiToast icon={httpToast.icon} iconSize={"large"} show={httpToast.show}>{httpToast.text}</WeuiToast>
      </div>
    )
  }
}

export default Auth;
