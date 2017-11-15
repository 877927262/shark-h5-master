'use strict';

import { observable, useStrict, action } from "mobx";
import React from "react";
import ReactDOM from "react-dom";

import util from "../util";
import { httpGet, httpPost } from "../../service";
import PopUp from "../common/popUp";
import uniqueToast from "../common/httpToast";
import cutil from "../../common-util";
import WechatShare from "../common/wechatShare";
import CommonAudioStore from '../common/audio';

import AudioPlayer from "../../view/audio";

useStrict(true);

const baseUrl = `${util.baseUrl}api/clazz`;

class TaskDetail {
  @observable content = {};
  @observable comment = [];
  @observable commentContent = "";
  @observable materialItem = { materialTitle: "", materialType: "", materialUrl: "" };

  constructor(cid, tid, postId) {
    this.cid = cid;
    this.tid = tid;
    this.postId = postId;
    this.materialsPopUp = new PopUp();
    this.commentPopUp = new PopUp();
    this.bindToastWithAction();
    this.audioTagUpdated = false;
    this.videoTagUpdated = false;
    this.wechatShare = null;
    this.searchStr = postId ? `?postId=${ postId }` : '';
  }

  @action
  setContent = (data) => {
    const originContent = { ...data };
    originContent.introductions.forEach((introductionItem) => {
      //正则去掉html中的class和style
      introductionItem.content = util.clearNodeClazzAndStyle(introductionItem.content);
    });
    originContent.articalInfo = this.compositeArticalInfo(originContent);


    const { clazz, title, author } = originContent;
    const clazzName = util.get(clazz, 'name') || 'Uband友班',
      clazzBanner = util.get(clazz, 'banner') || 'http://qiniuprivate.gambition.cn/vHaiYP_uband_logo.png';

    this.wechatShare = new WechatShare(
      clazzName,
      `${ title } By ${ author }`,
      `${ location.origin }/course/${ this.cid }/task/${ this.tid }/public${ this.searchStr }`,
      clazzBanner
    );

    this.content = originContent;
  };

  @action
  setComment = (data) => {
    this.comment = [];
    data.forEach(item => this.comment.push(item))
  };

  @action
  updateCommentContent = event => {
    this.commentContent = event.target.value;
  };

  @action
  clearCommentContent = () => {
    this.commentContent = "";
  };

  getAll = () => {
    if (this.cid == null) {
      httpGet(`${baseUrl}/task/${this.tid}${ this.searchStr }`).then(this.setContent);
      httpGet(`${baseUrl}/task/${this.tid}/replies`).then(this.setComment);
    } else {
      httpGet(`${baseUrl}/${this.cid}/task/${this.tid}${ this.searchStr }`).then(this.setContent);
      httpGet(`${baseUrl}/${this.cid}/task/${this.tid}/replies`).then(this.setComment);
    }
  };

  bindToastWithAction = () => {
    this.uploadReply = () => this.addReply()
      .then(() => {
        this.clearCommentContent();
        httpGet(`${baseUrl}/task/${this.tid}/replies`).then(this.setComment);
        uniqueToast.showToast({ text: "操作成功", icon: "success" });
      });
  };

  addReply = () => {
    return httpPost(`${baseUrl}/${this.cid}/task/${this.tid}/reply`, { content: this.commentContent });
  };

  @action
  refreshMaterialsPopUpContent = (title, type, url) => {
    this.materialItem.materialTitle = title || "";
    this.materialItem.materialType = type || "";
    this.materialItem.materialUrl = url || "";
  };

  @action
  removeMaterialsPopUpContent = () => {
    this.materialsPopUp._hidePopUp();
    this.materialItem.materialTitle = "";
    this.materialItem.materialType = "";
    this.materialItem.materialUrl = "";
  };

  replaceAllNativeAudioTag = () => {
    if (this.audioTagUpdated === false) {
      let audios = document.getElementsByTagName("audio");
      let length = audios.length;
      if (length) {
        // 遍历audio并替换
        for (let idx = 0; idx < length; ++idx) {
          let audio = audios.item(idx);
          let parent = audio.parentNode,
            audioSrc = audio.querySelector("source").getAttribute("src");

          // temporary render target
          let temp = document.createElement("div");
          // render
          ReactDOM.render(<AudioPlayer src={audioSrc.toString()} audioStore={new CommonAudioStore()}/>, temp);

          parent.replaceChild(temp, audio);
        }
        this.audioTagUpdated = true;
      }
    }
  };

  replaceAllNativeVideoTag = () => {
    if (this.videoTagUpdated === false) {
      let videos = document.getElementsByTagName("video");
      let length = videos.length;
      if (length) {
        // 遍历video并替换
        for (let idx = 0; idx < length; ++idx) {
          let video = videos.item(idx);
          video.setAttribute("preload", "none");
        }
        this.videoTagUpdated = true;
      }
    }
  };

  compositeArticalInfo = (originData) => {
    let createdAtStr = util.get(originData, "targetDate", "");
    let createdAtDate = createdAtStr ? new Date(createdAtStr) : new Date();//default date is NOW time
    let strTime = cutil.format(createdAtDate, "yyyy-MM-dd");
    let strAuthor = util.get(originData, "author", "");//default author is empty string
    return `${strTime}\xa0\xa0${strAuthor}`;//\xa0  is a NO-BREAK SPACE char.
  }

}

export default TaskDetail;


