'use strict';

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from "../../util";
import { ubandLogoUrl } from "../../../images-url";

/**
 * 引入样式
 */
import "../../../../style/guide.scss";

const {
  Button,
  TabBar
} = WeUI;

@inject("Promotion") @observer
export default class Helppage extends Component {
  constructor(props) {
    super(props);

    this.promotion = this.props.Promotion;

    this.helpMainNode = null;
  }

  componentDidMount() {
    this.promotion.initWechatShare();
  }

  next = () => {
    this.promotion.incrementCurrentDialogIndex();
    window.setTimeout(() => this.helpMainNode.scrollTop = this.helpMainNode.scrollHeight, 0);
  };

  render() {
    const { currentPromotionUser, dialogList, currentDialogIndex } = this.promotion;

    const currentUserHeadImgUrl = _.get(currentPromotionUser, 'headImgUrl', '');

    return (
      <div className="promotion-page help-page w-full">
        <header className="page-header w-full bar bar-nav">
          <a className="icon icon-left pull-left p-l-none p-r-none"
             onClick={() => browserHistory.replace('/promotion/home')}/>
          <span className="title">玩 法 指 南</span>
        </header>
        <div className="content help-page-content" ref={(item) => this.helpMainNode = item}>
          <div className="help-page-main p-l-sm p-r-sm">
            {
              dialogList.map((dialogItem, idx) => {
                return (
                  dialogItem.isSelf
                    ? <section className={`user-section ${currentDialogIndex > idx ? 'show' : ''}`} key={idx}>
                      <div className="dialog">
                          <span className="user-dialog">
                            <span dangerouslySetInnerHTML={{ __html: dialogItem.content }}/>
                            <div className="triangle"/>
                          </span>
                        <img className="user-photo" src={currentUserHeadImgUrl}/>
                      </div>
                    </section>
                    : <section className={`uband-section ${currentDialogIndex > idx ? 'show' : ''}`} key={idx}>
                      <div className="dialog">
                        <img className="uband-photo" src={ubandLogoUrl}/>
                        <span className="uband-dialog">
                            <div className="triangle"/>
                            <span dangerouslySetInnerHTML={{ __html: dialogItem.content }}/>
                          </span>
                      </div>
                    </section>
                )
              })
            }
          </div>
        </div>
        {
          ( currentDialogIndex < dialogList.length &&
            <TabBar className="help-page-footer">
              <Button className="m-b-lg next-button" onClick={this.next}>
                下一步
              </Button>
            </TabBar>
          )
        }
      </div>
    )
  }
}
