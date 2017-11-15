/**
 * Created by johnbryant on 2017/4/22.
 */
import { observable, useStrict, action, computed } from "mobx";
import { browserHistory } from 'react-router';

useStrict(true);

import util from "../util";
import cutil from "../../common-util";
import { httpGet, httpPost } from "../../service";
import Toast from "../common/toast";

const baseUrl = `${util.baseUrl}api`;

class Passport {
  @observable
  userPassport = {
    sex: '',
    birthday: '',
    city: '',
    userEnglishLevel: '',
    userSelfIdentity: '',
    preferLearningMode: ''
  };
  @observable
  cityPickerShow = false;

  constructor(clazzId) {
    this.clazzId = clazzId;

    this.toast = new Toast();
  }

  @action
  updateUserPassport = (target) => {
    for (let key in this.userPassport) {
      if (target[key] != null) {
        this.userPassport[key] = target[key];
      }
    }

    // 处理性别
    if (this.userPassport.sex != null) {
      this.userPassport.sex = `${ this.userPassport.sex }`
    }
  };

  @action
  updateUserPassportByKey = (target, value) => {
    this.userPassport[target] = value;
  };

  @action
  showCityPicker = () => {
    this.cityPickerShow = true;
  };

  @action
  hideCityPicker = () => {
    this.cityPickerShow = false;
  };

  updateSexEventHandler = (event) => {
    this.updateUserPassportByKey('sex', event.target.value);
  };

  updateBirthdayEventHandler = (event) => {
    // 确保为合法日期
    const birthdayDate = Date.parse(event.target.value)
      ? new Date(event.target.value)
      : new Date();

    this.updateUserPassportByKey('birthday', cutil.format(birthdayDate, "yyyy-MM-dd"));
  };

  updateCityEventHandler = (text) => {
    this.updateUserPassportByKey('city', text);

    this.hideCityPicker();
  };

  updateEnglishLevelEventHandler = (event) => {
    this.updateUserPassportByKey('userEnglishLevel', event.target.value);
  };

  updateSelfIdentityEventHandler = (event) => {
    this.updateUserPassportByKey('userSelfIdentity', event.target.value);
  };

  updatePreferLearningModeEventHandler = (event) => {
    this.updateUserPassportByKey('preferLearningMode', event.target.value);
  };

  fetchUserPassport = () => {
    httpGet(`${baseUrl}/account/passport`)
      .then(this.updateUserPassport);
  };

  submitUserPassportEventHandler = () => {
    // 参数检查
    for (let key in this.userPassport) {
      if (this.userPassport[key] == null || this.userPassport[key] === '') {
        this.toast._showToast({ text: '不能有未填写字段', icon: "warn", back: false });

        return;
      }
    }

    this.toast._showToast({ text: "提交中...", icon: "loading", back: false });

    // 提交表单
    httpPost(`${baseUrl}/account/passport`, this.userPassport)
      .then(() => {
        this.toast._showToast({ text: "操作成功", icon: "success", back: false });

        if (this.clazzId) {
          window.setTimeout(() => browserHistory.replace(`/course/${ this.clazzId }/detail`), 1500);
        } else {
          window.setTimeout(() => browserHistory.replace('/course/list'), 1500);
        }
      })
      .catch((error) => {
        this.toast._showToast({ text: error.message, icon: "warn", back: false });
      })
  }
}

export default Passport;
