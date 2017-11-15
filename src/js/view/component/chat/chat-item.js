'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import _ from '../../util';

/**
 * 文字类型消息
 *
 * @param content
 */
const TextMessage = ({ content }) => (
  <div className="chat-text-msg chat-msg-item">
    <div dangerouslySetInnerHTML={{ __html: content }}/>
  </div>
);

/**
 * 图片类型消息
 *
 * @param url
 * @param onImgLoaded
 */
const ImageMessage = ({ url, onImgLoaded }) => (
  <div className="chat-img-msg chat-msg-item">
    <img className="w-full" src={url} onLoad={onImgLoaded}/>
  </div>
);

/**
 * 语音类型消息
 * 使用 CommonAudioStore 控制音频状态
 */
@inject("CommonAudioStore") @observer
class AudioMessage extends Component {
  constructor(props) {
    super(props);

    const { url, chatList, CommonAudioStore } = this.props;
    // 语音地址
    this.url = url;
    // audio node 节点
    this.audioNode = null;
    // 语音item
    this.audioStore = new CommonAudioStore();

    this.chatList = chatList;
    // 设置当前选中的audio
    if (this.chatList.selectedAudio === null) {
      this.chatList.selectedAudio = this;
    }
  }

  toggleAudioPlay = () => {
    const { isPlaying } = this.audioStore;

    // 如果正在播放则停止，否则开始播放
    if (isPlaying === true) {
      this.stopAudio();
    } else {
      // 全局唯一播放
      if (this.chatList.selectedAudio != null && this.chatList.selectedAudio !== this) {
        this.chatList.selectedAudio.stopAudio();
      }

      this.playAudio();
    }
  };

  // 播放音频
  playAudio = () => {
    this.audioNode.play();

    this.chatList.selectedAudio = this;

    this.audioStore.setIsPlaying(true);
  };

  // 停止音频
  stopAudio = () => {
    this.audioNode.pause();
    this.audioNode.currentTime = 0;

    this.audioStore.setCurrent(0);
    this.audioStore.setIsPlaying(false);
  };

  setAudioItemDuration = () => this.audioStore.setDuration(this.audioNode.duration);

  setAudioItemCurrent = () => this.audioStore.setCurrent(this.audioNode.currentTime);

  onLoadedMetaData = () => {
    this.setAudioItemDuration();
    if (this.chatList.selectedAudio === this) {
      // 仅在android下自动播放
      if (_.isIOS() === false) {
        this.playAudio();
      }
    }
  };

  componentWillUnmount() {
    this.audioNode.removeEventListener("ended", this.stopAudio);
    this.audioNode.removeEventListener("loadedmetadata", this.onLoadedMetaData);
    this.audioNode.removeEventListener("timeupdate", this.setAudioItemCurrent);
    this.audioNode.removeEventListener("canplaythrough", this.setAudioItemDuration);
  }

  render() {
    const { duration, isPlaying } = this.audioStore;

    return (
      <div className="chat-audio-msg chat-msg-item">
        <div className="audio-spiral" onClick={this.toggleAudioPlay}>
          <audio ref={node => this.audioNode = node} preload="metadata"
                 onEnded={this.stopAudio}
                 onLoadedMetadata={this.onLoadedMetaData}
                 onTimeUpdate={this.setAudioItemCurrent}
                 onCanPlayThrough={this.setAudioItemDuration}>
            <source src={this.url}/>
          </audio>
          <i className={`icon-gb ${isPlaying ? 'icon-gb-audio-playing' : 'icon-gb-audio-pause'}`}/>
          <span className="audio-time-duration">{duration}</span>
        </div>
      </div>
    );
  };
}

/**
 * 聊天item
 * 根据消息类型，构建消息条目
 *
 * @param item
 * @param onImgLoaded
 * @param chatList
 * @returns {XML}
 * @constructor
 */
const ChatItem = ({ item, onImgLoaded, chatList }) => {
  const { type, userInfo, url, content } = item;

  return (<div className={`chat-item ${userInfo.isSelf ? 'me' : ''}`}>
    <div className="chat-avatar">
      <img src={userInfo.headImgUrl}/>
    </div>
    <div className="chat-content">
      {
        ((type) => {
          switch (type) {
            case 'AUDIO':
              return <AudioMessage url={url} chatList={chatList}/>;
            case 'IMAGE':
              return <ImageMessage url={url} onImgLoaded={onImgLoaded}/>;
            case 'TEXT':
              return <TextMessage content={content}/>;
          }
        })(type)
      }
    </div>
  </div>);
};

export default ChatItem;
