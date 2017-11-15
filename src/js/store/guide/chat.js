'use strict';

import { observable, useStrict, action } from "mobx";
import { httpGet } from "../../service";
import WechatShare from '../common/wechatShare';
import util from "../util";

useStrict(true);

const baseUrl = `${util.baseUrl}api/guide`;

/**
 * 交互store -- 控制显示的对话信息
 */
class GuideChat {
  @observable
  chatList = [];        // 显示的对话列表
  @observable
  nextChat = null;      // 用户要发送的下一条消息

  constructor() {
    this._originChatList = [];  // 全部对话列表

    this.isWaiting = false;     // 是否在等待对方输入...
    this.nextOrder = 0;         // 下一组要显示消息的order

    // 设置分享信息
    this.wechatShare = new WechatShare(
      '看到这个页面，我开始方了',
      '欢迎来到友班，不仅是一个英文练习平台',
      `${ location.origin }/redirect?target=/guide/chats`,
      'http://qiniuprivate.gambition.cn/U8PAC7_shark-ig-assitant.png'
    )
  }

  // 获取全部消息列表，并设置到 this._originChatList 中
  fetchOriginChatList = () => httpGet(`${ baseUrl }/chats`).then(this._setOriginChatList);

  /**
   * 下一步操作
   * 1. 筛选要显示的消息列表
   * 2. 筛选用户要发送的下一条消息
   * 3. 更新 显示的对话列表 及 下一条消息
   * 4. 下一组要显示消息的order 自增
   */
  next = (scrollToBottom) => {
    if (this.nextChat != null) {
      // 将nextChat插入到现在的对话列表中
      this.appendChatList(this.nextChat);
    }

    const nextChatList = [];
    let nextChat = null;

    this._originChatList.forEach((item) => {
      const itemOrder = item.order;
      if (itemOrder === this.nextOrder) {
        // 排除当前的nextChat
        if (this.nextChat !== item) {
          nextChatList.push(item);
        }
      } else if (itemOrder > this.nextOrder) {
        // 获取下一个nextChat
        if (nextChat == null) {
          nextChat = item;
        }
      }
    });

    const appendPromiseList = nextChatList.map(
      (nextChat, idx) => new Promise(
        (resolve) => window.setTimeout(
          () => {
            this.appendChatList(nextChat);
            scrollToBottom();
            return resolve(nextChat);
          },
          idx * 750 + Math.random() * 750
        )
      )
    );

    // 先让nextItChat为空
    this._setNextChat(null);

    return Promise.all(appendPromiseList)
      .then(() => {
        this._setNextChat(nextChat);
        this.nextOrder++;
      });
  };

  @action
  appendChatList = (nextChat) => this.chatList = [...this.chatList, nextChat];

  toggleIsWaiting = () => this.isWaiting = !this.isWaiting;

  @action
  _setNextChat = (nextChat) => this.nextChat = nextChat;

  @action
  _setOriginChatList = (chatList) => this._originChatList = chatList;
}

export default GuideChat;
