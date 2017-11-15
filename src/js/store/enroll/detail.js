import {observable, useStrict, action} from "mobx";

useStrict(true);

import util from "../util";
const baseUrl = `${util.baseUrl}api`;
import WechatShare from "../common/wechatShare";

import {httpGet} from "../../service";

class EnrollDetail {
  @observable detail = {};
  @observable introduction = "";

  constructor(cid) {
    this.cid = cid;
    this.cUrl = `${baseUrl}/clazz/${this.cid}`;
  }

  @action
  setDetail = (dObj) => {
    this.detail = {...dObj};

    const { name, author, banner, description } = dObj;

    this.wechatShare = new WechatShare(
      name,
      `${ description } By ${ author }`,
      `${ location.origin }/redirect?target=enroll/${ this.cid }`,
      banner
    );
  };

  @action
  setIntrodution = (data) => {
    this.introduction = util.clearNodeClazzAndStyle(data.introduction);
  };

  fetchDetail = (scb) =>
    httpGet(this.cUrl).then(scb);

  fetchIntroduction = (scb) =>
    httpGet(`${this.cUrl}/introduction`).then(scb);
}

export default EnrollDetail;
