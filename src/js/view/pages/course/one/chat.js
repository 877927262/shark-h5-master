import React, {Component} from "react";
import {Link, browserHistory} from "react-router";
import PullToRefresh from "./ptr"
import {observer, inject} from "mobx-react";

import util from "../../../../store/util";
import cutil from "../../../../common-util";
const baseUrl = `${util.baseUrl}api`;

import _ from "../../../util";
import {httpGet} from "../../../../service";

import Footer from "./footer";
import {scroll} from "../../../../store/one/chat";
import "../../../../../style/chat.scss";
import WeuiToast from "../../../WeuiToast";

@inject("Chat") @observer
class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.courseId = this.props.params.courseId;
    this.feedbackId = this.props.params.feedbackId;
    this.chat = new this.props.Chat(this.courseId, this.props.params.feedbackId);

    // todo 移除state, 好孩子不要学
    this.state = {
      backUrl: "",
      isTeacher: false,
      resetFooter: true
    };

    this.resetFooter = this.resetFooter.bind(this);
  }

  resetFooter() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      resetFooter: true
    })
  }

  componentWillMount() {
    let cid = this.courseId,
      self = this;

    httpGet(`${baseUrl}/clazz/${cid}/isTeacher`)
      .then((isTeacher) => {
        // todo 移除setState, 好孩子不要学
        isTeacher
          ? self.setState({backUrl: `/course/${cid}/one/student`})
          : self.setState({backUrl: `/course/${cid}/detail`});

        // todo 移除setState, 好孩子不要学
        self.setState({isTeacher: isTeacher});

        self.chat.getChats(isTeacher, () => {
          scroll.scrollToBottom();
        });
      });
  }

  render() {
    const {list, getChats, toast} = this.chat;
    return (
      <div className="page page-current" id="chat-page">
        <header className="bar bar-nav chat-nav">
          <h1 className="title">笃师一对一</h1>
          <div onClick={() => {browserHistory.replace(this.state.backUrl)}}
                className="button button-link button-nav pull-left chat-page-back">
            <span className="icon icon-left"/>
          </div>
        </header>
        <Footer isTeacher={this.state.isTeacher} courseId={this.courseId} feedbackId={this.feedbackId}
                chat={this.chat} reset={this.state.resetFooter} list={list}/>
        <div className="content" ref="content" onClick={this.resetFooter}>
          <PullToRefresh
            onRefresh={resolve => {
              getChats(this.state.isTeacher, resolve);
            }}
          >
            <div className="chat-list" ref="list">
              {
                list.map((item, idx) => {
                    const userInfo = _.get(item, "userInfo", {});
                    return (
                      <div className={(userInfo.isSelf ? "me " : "") + "chat-item"} key={idx}>
                        <div className="chat-avatar">
                          <img src={userInfo.headImgUrl}/>
                        </div>
                        <div className="chat-content">
                          <div className="chat-user">
                            <span className="chat-user-name">{userInfo.name}</span>
                            {userInfo.isTeacher && <span className="chat-user-title">笃师</span>}
                          </div>
                          {
                            (() => {
                              switch (item.type) {
                                case "TEXT":
                                  return (
                                    <div className="chat-text-msg">
                                      <p>{item.content}</p>
                                    </div>
                                  );
                                case "VOICE":
                                  let {audio} = item;
                                  return (
                                    <div className="chat-audio-msg">
                                      <div className="audio-bar"
                                           onClick={() => audio.controllAudio(this.refs["audio" + idx])}>
                                        <audio src={item.url} onEnded={() => audio.pauseAudio(this.refs["audio" + idx])}
                                               ref={"audio" + idx}/>
                                        <i className={"icon-gb icon-gb-" + audio.nextState.toLowerCase()}/>
                                      </div>
                                    </div>
                                  );
                                case "MATERIAL":
                                  return (
                                    <Link className="chat-material-msg"
                                          to={`/course/${ this.courseId }/one/detail/${ item.materialId }`}>
                                      <div className="material-title">{item.title}</div>
                                      <div className="material-line"></div>
                                      <div className="material-author">作者: {item.author}<i className="icon icon-right"/>
                                      </div>
                                    </Link>
                                  );
                              }
                            })()
                          }
                          <footer className="chat-item-footer"><span>{Date.parse(item.date) ? cutil.format(new Date(item.date), "MM-dd hh:mm") : ''}</span></footer>
                        </div>
                      </div>
                    )
                  }
                )
              }
            </div>
          </PullToRefresh>
        </div>
        <WeuiToast icon={toast.icon} iconSize="large" show={toast.show}>{ toast.text }</WeuiToast>
      </div>
    )
  }
}

export default ChatPage;
