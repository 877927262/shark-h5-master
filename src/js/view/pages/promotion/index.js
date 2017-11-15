'use strict';

import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import _ from '../../util';

import Agreement from './agreement';

import "../../../../style/promotion.scss";

@inject("Promotion") @observer
class Promotion extends Component {
  constructor(props) {
    super(props);

    this.promoption = this.props.Promotion;
  }

  componentDidMount() {
    this.promoption.getCurrentPromotionUser();
  }

  componentWillUnmount() {
    // 退出页面时，清空数据
    this.promoption.resetAll();
  }

  /**
   * 根据 isJoined 判断要显示的子页面
   * 如果用户与尚未加入推广计划，则默认展示协议界面
   * @param isJoined
   * @returns {*}
   */
  getChild = (isJoined) => {
    /**
     * isJoined==null，是为了在即将渲染一个页面前，先渲染一个空页面，目的是避免页面闪现
     * isJoined是bool值，isJoined===true时，显示home页面，isJoined===false时，显示agreement页面。
     */
    if (isJoined == null) {
      return null;
    } else if (isJoined === true) {
      return this.props.children;
    } else {
      return <Agreement/>
    }
  };

  render() {
    const { currentPromotionUser } = this.promoption;

    return (
      <div className="page-group">
        {
          this.getChild(_.get(currentPromotionUser, 'isJoined', null))
        }
      </div>
    )
  }
}

export default Promotion;
