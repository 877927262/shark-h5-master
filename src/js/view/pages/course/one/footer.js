import React, {Component} from "react";
import {Link} from "react-router";
import {inject, observer} from "mobx-react";
import WeuiToast from "../../../WeuiToast";


import "../../../../../style/chat.scss";

@inject("Record") @observer
class Footer extends Component {
  constructor(props) {
    super(props);

    let {courseId, list, chat, isTeacher, feedbackId} = this.props;
    this.record = new this.props.Record(courseId, list, chat, isTeacher, feedbackId);

    // todo 移除state, 好孩子不要学
    this.state = {
      footerBtnState: [false, false]
    };

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleText = this.toggleText.bind(this);
  }

  componentDidMount() {
    this.record.initWeixinSDK(`${ location.pathname }${ location.search }`);
  }

  toggleAudio() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      footerBtnState: [true, false]
    })
  }

  toggleText() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      footerBtnState: [false, true]
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetFooter)
      // todo 移除setState, 好孩子不要学
      this.setState({
        footerBtnState: [false, false]
      })
  }

  componentWillUnmount() {
    this.record.handleCancel();
  }

  render() {
    const {isTeacher, courseId, feedbackId, chat} = this.props;
    const {handleTextChange, postText, text} = chat;
    const {footerBtnState} = this.state;
    const actionBarState = footerBtnState[0] ? "chat-audio-active" : footerBtnState[1] ? "chat-text-active" : ""

    const {active, content, state, handleClick, toast, handleCancel} = this.record;

    return (
      <div className={actionBarState + " bar bar-footer chat-footer"}>
        <div className="footer-row">
          <div className={(footerBtnState[0] ? "active " : "") + "row-equal chat-audio"} onClick={this.toggleAudio}>
            <i className="icon-gb icon-gb-microphone"/>语音
          </div>
          <div className={(footerBtnState[1] ? "active " : "") + "row-equal chat-text"} onClick={this.toggleText}>
            <i className="icon-gb icon-gb-keyboard"/>文字
          </div>
          {!isTeacher || (
            <Link to={`/course/${ courseId }/one/material/${ feedbackId }`} className="row-equal chat-material"><i
              className="icon-gb icon-gb-menu"/>素材</Link>)}
        </div>
        <div className="text-input-section">
          <div className="searchbar row">
            <div className="search-input col-80">
              <input type="text" value={text} onChange={handleTextChange} maxLength="700"/>
            </div>
            <a className="button button-fill button-primary col-20" onClick={postText}>发送</a>
          </div>
        </div>
        <div className={"audio-input-section " + active}>
          <div className="record-tip">{content.tip}</div>
          <div className={"record-btn " + state} onClick={handleClick}>
            <i className="icon-gb icon-gb-pause-l"/>
            <i className="icon-gb icon-gb-send-l"/>
          </div>
          <div className="record-status">{content.status}</div>
          <div className="record-overlay"></div>
          <div className="cancel-btn" onClick={handleCancel}>取消</div>
        </div>
        <WeuiToast show={toast.show} icon={toast.icon} iconSize={"large"}>{toast.text}</WeuiToast>
      </div>
    )
  }

}

export default Footer
