'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

import _ from "../../util";

import ChatItem from "../../component/chat/chat-item";

const {
  TabBar
} = WeUI;

/**
 * 引入样式
 */
import "../../../../style/guide.scss";

/**
 * 关注后推送页面，用户和学员交互，推广课程
 */
@inject("GuideChat") @observer
export default class InteractiveGuidePage extends Component {
  constructor(props) {
    super(props);

    this.guideChat = new this.props.GuideChat();
    // 对话列表node
    this.chatListNode = null;
    // 记录页面初始title
    this.DOCUMENT_TITLE = document.title;
    // 正在播放的音频
    this.selectedAudio = null;
  }

  componentDidMount() {
    const { fetchOriginChatList, next } = this.guideChat;

    fetchOriginChatList().then(() => next(this.scrollToBottom));
  }

  componentWillUnmount() {
    // 设置回最开始的title
    _.setDocumentTitle(this.DOCUMENT_TITLE);
  }

  /**
   * 获取下一组对话
   */
  getNextChat = () => {
    const { next, toggleIsWaiting, isWaiting } = this.guideChat;

    // 当已设置isWaiting为true时，不触发
    if (isWaiting === false) {
      toggleIsWaiting();

      // 设置 document title
      _.setDocumentTitle("对方正在输入中...");

      next(this.scrollToBottom)
        .then(() => {
          _.setDocumentTitle(this.DOCUMENT_TITLE);
          toggleIsWaiting();
        });
    }
  };

  scrollToBottom = () => {
    // 列表滚动
    this.chatListNode.scrollTop = this.chatListNode.scrollHeight;
  };

  render() {
    const { chatList, nextChat } = this.guideChat;

    return (<div className="page page-current guide-page">
      <div className="content" ref={item => this.chatListNode = item}>
        <div className="chat-list m-t-sm m-b-xxl p-b-sm">
          {
            chatList.map((chatItem) => <ChatItem key={chatItem.id}
                                                 item={chatItem}
                                                 onImgLoaded={this.scrollToBottom}
                                                 chatList={this}/>)
          }
        </div>
      </div>

      {
        nextChat && <TabBar className="chat-list">
          <div className="chat-item me w-full">
            <div className="chat-content" onClick={this.getNextChat}>
              <div className="chat-text-msg chat-msg-item">
                <div dangerouslySetInnerHTML={{ __html: nextChat.content }}/>
              </div>
            </div>
          </div>
        </TabBar>
      }
    </div>)
  }
}
