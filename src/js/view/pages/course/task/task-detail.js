'use strict';

import React, { Component } from "react";
import { browserHistory } from 'react-router';
import { observer, inject } from "mobx-react";
import AudioPlayer from "../../../audio";

import WeUI from "react-weui";
import { taskIntroductionEnum, getEnumByKey } from "../../../enum";

const {
  Article,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Popup,
  PopupHeader,
  Button,
  ButtonArea,
  TextArea
} = WeUI;

@inject("TaskDetail", "CommonAudioStore") @observer
class TaskDetail extends Component {
  constructor(props) {
    super(props);

    const { courseId, taskId } = this.props.params;
    const { postId } = this.props.location.query;

    if (courseId) {
      localStorage.courseId = courseId;
      this.courseId = courseId;
    } else {
      this.courseId = localStorage.courseId;
    }

    this.detail = new this.props.TaskDetail(courseId, taskId, postId);
  }

  componentDidMount() {
    this.detail.getAll();
  }

  componentDidUpdate() {
    const { replaceAllNativeAudioTag, replaceAllNativeVideoTag } = this.detail;
    replaceAllNativeAudioTag();
    replaceAllNativeVideoTag();
  }

  render() {
    const { CommonAudioStore } = this.props;
    const { courseId, taskId } = this.props.params;

    const { content: content, comment: commentList } = this.detail;
    const { introductions: introList, materials: materialList, title, articalInfo } = content;

    const {
      materialsPopUp, refreshMaterialsPopUpContent, materialItem, removeMaterialsPopUpContent,
      commentPopUp, commentContent, uploadReply, updateCommentContent
    } = this.detail;
    return (
      <div className="page page-current course-page">
        <header className="bar bar-nav">
          <span className="icon icon-left pull-left"
                onClick={() => browserHistory.replace(`/course/${ courseId }/detail?tabIndex=0#${ taskId }`)}/>
          <h1 className="title page-title text-overflow-hidden">Uband</h1>
        </header>
        <div className="content task-article-content">
          <h1 className="article-title">{title}</h1>
          <h2 className="article-info">{articalInfo}</h2>
          <Article className="task-article">
            <section>
              {
                introList
                  ? (introList.map((item, idx) => (
                    <section key={idx}>
                      <div className="article-type">{getEnumByKey(item.type, taskIntroductionEnum).name}</div>
                      <p dangerouslySetInnerHTML={{ __html: item.content }} className="limit-img"/>
                    </section>
                  )))
                  : null
              }
            </section>
          </Article>
          {
            (() => {
              if (materialList && materialList.length > 0) {
                return <div>
                  <div className="material-top">素材列表</div>
                  <div className="material-list">

                    <Cells className="material-cells">
                      {
                        (materialList.map((item, idx) => (
                          <Cell key={item.id} access onClick={e => {
                            refreshMaterialsPopUpContent(item.title, item.type, item.url);
                            materialsPopUp._showPopUp();
                          }}>
                            <CellHeader>
                              <div className="">
                                {
                                  (() => {
                                    switch (item.type) {
                                      case "AUDIO":
                                        return (
                                          <i className="icon-gb icon-gb-voice material-cell-icon"/>
                                        );
                                      case "IMAGE":
                                        return (
                                          <i className="icon-gb icon-gb-image material-cell-icon"/>
                                        );
                                      case "VIDEO":
                                        return (
                                          <i className="icon-gb icon-gb-video material-cell-icon"/>
                                        );
                                      case "FILE":
                                        return (
                                          <i className="icon-gb icon-gb-file material-cell-icon"/>
                                        );
                                      default:
                                        return (
                                          <i className="icon-gb icon-gb-content-empty comment-empty-img"/>
                                        );
                                    }
                                  })()
                                }
                              </div>
                            </CellHeader>
                            <CellBody>
                              {item.title}
                            </CellBody>
                            <CellFooter>

                            </CellFooter>
                          </Cell>
                        )))
                      }
                    </Cells>
                    <Popup
                      show={materialsPopUp.show}
                      onRequestClose={e => {
                        removeMaterialsPopUpContent();
                      }}>
                      <PopupHeader
                        left="返回"
                        leftOnClick={e => {
                          removeMaterialsPopUpContent();
                        }}/>

                      <Article>
                        <h1 className="text-center">{materialItem.materialTitle}</h1>

                        <section>
                          <section>
                            {
                              (() => {
                                switch (materialItem.materialType) {
                                  case "AUDIO":
                                    return (
                                      <AudioPlayer src={materialItem.materialUrl} audioStore={new CommonAudioStore()}
                                                   className="w-full"/>
                                    );
                                  case "IMAGE":
                                    return (
                                      <img className="w-full" src={materialItem.materialUrl}/>
                                    );
                                  case "VIDEO":
                                    return (
                                      <video className="w-full" preload="none" controls="controls">
                                        <source src={materialItem.materialUrl} type="video/mp4"/>
                                      </video>
                                    );
                                  case "FILE":
                                  default:
                                    return (
                                      <div/>
                                    );
                                }
                              })()
                            }
                          </section>
                          <section className="text-center">
                            <a href={materialItem.materialUrl} target="_blank"><u>下载文件</u></a>
                          </section>
                        </section>
                        <Button onClick={e => {
                          removeMaterialsPopUpContent();
                        }}>关闭</Button>
                      </Article>
                    </Popup>
                  </div>
                </div>
              }
            })()
          }

          <div className="comment-top">精选留言</div>
          <div className="comment-list">
            <div className="comment-edit">
              <i className="icon-gb icon-gb-comment-edit comment-edit-img"/>
              <div className="comment-edit-btn" onClick={e => {
                commentPopUp._showPopUp();
              }}>
                写留言
              </div>
            </div>
            {
              (commentList && commentList.length > 0)
                ? commentList.map(item => (
                  <div key={item.id}>
                    <div className="comment-item">
                      <div className="comment-avatar">
                        <img src={item.userInfo.headImgUrl}/>
                      </div>
                      <div className="comment-content-wrap">
                        <div className="comment-user">
                          {item.userInfo.name}
                        </div>
                        <div className="comment-content">
                          {item.content}
                        </div>
                        <div className="comment-time">
                          {item.replayDate.slice(0, 10)}
                        </div>
                      </div>
                    </div>
                    {
                      item.replies.map(item => (
                        <div className="comment-replies" key={item.id}>
                          <div className="reply-title">
                            {item.userInfo.name}&nbsp;回复&nbsp;{item.toUserInfo.name}
                          </div>
                          <div className="reply-content">
                            {item.content}
                          </div>
                          <div className="reply-time">
                            {item.replayDate.slice(0, 10)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ))
                : <div className="comment-empty"><i className="icon-gb icon-gb-content-empty comment-empty-img"/><p
                  className="text-center comment-empty-text">空空如也，快来写下你的回复吧</p></div>
            }
          </div>
          <Popup
            show={commentPopUp.show}
            onRequestClose={e => {
              commentPopUp._hidePopUp();
            }}>
            <PopupHeader
              left="返回"
              leftOnClick={e => {
                commentPopUp._hidePopUp();
              }}/>

            <Article>
              <TextArea placeholder="请输入您的回复" rows="3" maxlength="200" value={commentContent}
                        onChange={updateCommentContent}/>

              <ButtonArea>
                <Button onClick={e => {
                  commentPopUp._hidePopUp();
                  uploadReply();
                }}>回复</Button>
              </ButtonArea>
            </Article>
          </Popup>
        </div>
      </div>
    )
  }
}

export default TaskDetail;
