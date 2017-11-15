import {observable, useStrict, action, computed, autorun} from "mobx";

useStrict(true);

import util from "../util";
import {httpGet, httpPost} from "../../service";
import Toast from "../common/toast"

const baseUrl = `${util.baseUrl}api/clazz`;

class Scroll {
  @observable node = null;

  @action
  getNode = (node) => {
    this.node = node;
  };

  scrollToBottom = () => {
    this.node.scrollTop = this.node.scrollHeight;
  }
}

export let scroll = new Scroll();

const PLAY = "PLAY",
  PAUSE = "PAUSE";

class Chat {
  @observable list = [];
  @observable seletedAudio = null;
  @observable endDate = "";
  @observable text = "";
  @observable toast = new Toast();

  constructor(cid, fid) {
    this.cid = cid;
    this.fid = fid;
    this.pageSize = 6;
    this.hasMore = true;
  }

  tFetchChats = (endDate = "", pageSize = this.pageSize) => {
    return httpGet(`${baseUrl}/${this.cid}/feedback/${this.fid}?pageSize=${pageSize}&endDate=${endDate}`);
  };

  sFetchChats = (endDate = "", pageSize = this.pageSize) => {
    return httpGet(`${baseUrl}/${this.cid}/feedback?pageSize=${pageSize}&endDate=${endDate}`);
  };

  @action
  updateData = (data) => {
    if (!data[0]) {
      this.hasMore = false;
      return
    }
    this.endDate = data[0].date;
    const temp = data.map((item) => {
      if (item.type === "VOICE")
        item["audio"] = new AudioItem(this, item.id);
      return item
    });
    this._shiftArray(temp, this.list);
  };

  _shiftArray = (raw, result) => {
    if (raw.length > 0)
      for (let i = raw.length - 1; i >= 0; i--) {
        result.unshift(raw[i]);
      }
  };

  getChats = (isTeacher, resolve = () => {}) => {
    isTeacher
      ? this.tFetchChats(this.endDate)
      .then((data) => {
        this.updateData(data);
        resolve();
      })
      : this.sFetchChats(this.endDate)
      .then((data) => {
        this.updateData(data);
        resolve();
      });
  };

  @action
  handleTextChange = (e) => {
    this.text = e.target.value;
  };

  postReply = (replyType, content) => {
    let subUrl = this.fid ? `/${this.fid}` : ``;
    return httpPost(
      `${baseUrl}/${this.cid}/feedback${ subUrl }`,
      {
        replyType: replyType,
        content: content
      });
  };

  postText = () => {
    if (this.text == null || this.text === "") {
      return void this.toast._showToast({
        text: "内容不能为空",
        icon: "warn",
        back: false
      });
    }

    if (this.text.length > 1000) {
      return void this.toast._showToast({
        text: "内容过长，请分次发送",
        icon: "warn",
        back: false
      });
    }

    this.postReply("TEXT", this.text)
      .then(action(data => {
        this.text = "";
        this.list.push(data);
        setTimeout(scroll.scrollToBottom, 0);
      }))
  };
}

export class AudioItem {
  @observable nextState = PLAY;
  @observable node = null;

  constructor(chat, idx) {
    this.chat = chat;
    this.idx = idx;
    autorun(this._onlyOne);
  }

  @action
  playAudio = (audioNode) => {
    this.nextState = PAUSE;
    this.node = audioNode;
    this.chat.seletedAudio = this.idx;
    audioNode.play();
  };

  @action
  pauseAudio = (audioNode) => {
    this.nextState = PLAY;
    audioNode.pause();
    audioNode.currentTime = 0;
  };

  @computed
  get isSelected() {
    return this.chat.seletedAudio === this.idx;
  }

  _onlyOne = () => {
    if (this.node && !this.isSelected)
      this.pauseAudio(this.node)
  };

  controllAudio = (audioNode) => {
    this.nextState === PLAY ?
      this.playAudio(audioNode) : this.pauseAudio(audioNode);
  };
}

export default Chat;