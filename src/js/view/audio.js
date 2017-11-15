'use strict';

import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import "../../style/audio.scss";

const xtransform = (node, offset) => {
  node.style.transform = `translateX(${offset}px)`;
  node.style.webkitTransform = `translateX(${offset}px)`;
};

const getSuitableLength = (offset, length) => {
  if (offset <= 0) {
    return 0;
  } else if (offset >= length) {
    return length;
  } else {
    return offset;
  }
};

@observer
class AudioPlayer extends Component {

  constructor(props) {
    super(props);

    const { src, audioStore } = this.props;
    // 语音地址
    this.src = src;
    // 语音item
    this.audioStore = audioStore;
    // audio node 节点
    this.audioNode = null;
    //
    this.playHeadNode = null;
    this.playNode = null;
    this.timeLineNode = null;
  }
  // 播放音频
  playAudio = () => {
    this.audioNode.play();

    this.audioStore.setIsPlaying(true);
  };
  // 停止音频
  stopAudio = () => {
    this.audioNode.pause();

    this.audioStore.setIsPlaying(false);
  };
  // 设置音频duration 时间
  setAudioItemDuration = () => this.audioStore.setDuration(this.audioNode.duration);
  // 设置当前时间
  setAudioItemCurrent = () => this.audioStore.setCurrent(this.audioNode.currentTime);
  // 计算音频时间线长度
  calculateTimeLineWidth = () => this.timeLineNode.offsetWidth - this.playHeadNode.offsetWidth;
  // 自动更新音频和音频时间线的位置
  atomChangeAudio = (offset) => {
    const timelineWidth = this.calculateTimeLineWidth();
    xtransform(this.playHeadNode, getSuitableLength(offset, timelineWidth));

    this.audioNode.currentTime = this.audioNode.duration * (offset / timelineWidth);
    this.setAudioItemCurrent();
  };
  // 处理音频时间线点击事件
  onTimelineClick = (e) => {
    const timelineBoundLeft = this.timeLineNode.getBoundingClientRect().left,
      eBoundLeft = e.pageX;

    const newLeft = eBoundLeft - timelineBoundLeft;

    this.atomChangeAudio(newLeft);
  };
  // 处理音频时间更新
  onTimeUpdate = () => {
    const timelineWidth = this.calculateTimeLineWidth();
    const { currentTime, duration } = this.audioNode;

    const playPercent = timelineWidth * (currentTime / duration);

    xtransform(this.playHeadNode, playPercent);
    this.setAudioItemCurrent();

    if (currentTime === duration) {
      this.audioNode.currentTime = 0;
      this.setAudioItemCurrent();
      this.stopAudio();
    }
  };
  // 处理音频icon点击事件
  onAudioIconClick = () => {
    const { isPlaying } = this.audioStore;

    if (isPlaying === true) {
      this.stopAudio();
    } else {
      this.playAudio();
    }
  };
  // 处理音频play head拖拽事件
  onPlayHeadDrag = (e) => {
    const newLeft = e.touches[0].pageX - this.timeLineNode.getBoundingClientRect().left;

    this.atomChangeAudio(newLeft);
  };

  componentDidMount() {}

  componentWillUnmount() {
    this.audioNode.removeEventListener("loadedmetadata", this.setAudioItemDuration);
    this.audioNode.removeEventListener("timeupdate", this.setAudioItemCurrent);
    this.audioNode.removeEventListener("canplaythrough", this.setAudioItemDuration);
    this.timeLineNode.removeEventListener("click", this.onTimelineClick);
    this.playHeadNode.removeEventListener("touchmove", this.onPlayHeadDrag);
  }

  render() {
    const { duration, current, isPlaying } = this.audioStore;

    return (
      <div className="audio-wrap">
        <audio ref={item => this.audioNode = item} preload="metadata" controls
               onLoadedMetadata={this.setAudioItemDuration}
               onTimeUpdate={this.onTimeUpdate}
               onCanPlayThrough={this.setAudioItemDuration}>
          <source src={this.src}/>
        </audio>
        <div className="icon-bg">
          <i ref={node => this.playNode = node} className={`icon-gb icon-gb-${isPlaying ? "pause" : "play"}`}
             onClick={this.onAudioIconClick}/>
        </div>
        <div className="drag-wrapper">
          <div ref={node => this.timeLineNode = node} className="timeline" onClick={this.onTimelineClick}>
            <div ref={node => this.playHeadNode = node} className="playhead" onTouchMove={this.onPlayHeadDrag}/>
          </div>
        </div>
        <div className="time-num">
          <span ref="timeCurrent" className="num-current">{current}</span> /
          <span ref="timeDuration" className="num-duration">{duration}</span>
        </div>
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  audioStore: PropTypes.object
};

export default  AudioPlayer;
