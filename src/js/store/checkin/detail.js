'use strict';

import { observable, useStrict, action, computed } from "mobx";
import { browserHistory } from "react-router";

import util from "../util";
import cutil from "../../common-util";
import { httpGet, httpPost, httpDel, httpPut } from "../../service";
import httpToast from '../common/httpToast';

useStrict(true);

const baseUrl = `${util.baseUrl}api/clazz`;
const MAX_FILE_SIZE = 20971520; // 1024 * 1024 * 20  即20MB;

class CheckinDetail {
  @observable
  data = {
    canCheckin: false,  // 课程是否能打卡
    checkinTime: "",    // 打卡日期，格式为'yyyy-MM-dd'
    clazz: null,        // 班级信息，对象
    hasCheckin: false,  // 是否已打卡
    userFiles: []       // 打卡文件列表
  };

  @observable
  checkInDate = ""; // 打卡日期 pattern: yyyy-MM-dd

  @observable
  cancelCheckinDialog = {
    show: false // 是否显示取消打卡dialog
  };

  @observable
  chooseFileButtonDisabled = false; // 是否disable上传文件按钮

  CHECKIN_STATE = {
    EDIT: "EDIT",
    CREATE: "CREATE"
  };

  constructor(courseId, checkinId, clickUploadButton) {
    this.courseId = courseId;

    this.checkinId = checkinId || "";
    this.actionType = checkinId ? this.CHECKIN_STATE.EDIT : this.CHECKIN_STATE.CREATE;

    // 构造上传文件选择配置
    this.FILE_UPLOAD_OPTIONS = this._constructFileUploadOptions(
      clickUploadButton,
      httpToast.showToast,
      this.enableChooseFileButton,
      this.disableChooseFileButton,
      this._fetchQiniuUploadToken,
      this._pushUploadFile
    );
  }

  /**
   * 展示操作成功toast
   */
  showSuccessToast = () => httpToast.showToast({ text: "操作成功", icon: "success" });

  /**
   * enable上传文件按钮
   * @param hideToast  是否隐藏全局toast窗口
   */
  enableChooseFileButton = (hideToast = true) => {
    hideToast && httpToast.hideToast();
    this._setChooseFileButtonDisabled(false);
  };

  /**
   * disable上传文件按钮
   *  -- 粘滞显示全局toast窗口
   */
  disableChooseFileButton = () => {
    httpToast.stickyToast({ text: 'Loading...', icon: 'loading' });
    this._setChooseFileButtonDisabled(true);
  };

  /**
   * 返回到课程主页，并定位到去打卡tab
   */
  backToCourseDetail = () => {
    const targetUrl = `/course/${ this.courseId }/detail?tabIndex=1`;

    browserHistory.replace(`/redirect?target=${ encodeURIComponent(targetUrl) }`);
  };

  /**
   * 获取打卡详情，并设置打卡内容
   */
  getCheckin = () => this._fetchCheckin()
    .then(this._setCheckin)
    .catch((error) => httpToast.showToast({ text: error.message, icon: "warn", cb: this.backToCourseDetail }));

  /**
   * 改变打卡文件状态 -- 即是否勾选文件
   * @param item
   */
  @action
  changeFileState = (item) => item.hasCheckined = !item.hasCheckined;

  /**
   * 打卡
   */
  addCheckin = () => httpPost(
    `${baseUrl}/${this.courseId}/checkin`,
    {
      fileIds: this.data.userFiles.filter(item => item.hasCheckined).map(item => item.id),
      date: this.checkInDate
    }
  );

  /**
   * 取消打卡
   */
  deleteCheckin = () => httpDel(`${baseUrl}/${this.courseId}/checkin/${this.checkinId}`);

  /**
   * 更新打卡
   */
  modifyCheckin = () => httpPut(
    `${baseUrl}/${this.courseId}/checkin/${this.checkinId}`,
    {
      fileIds: this.data.userFiles.filter(item => item.hasCheckined).map(item => item.id)
    }
  );

  /**
   * 判断是否能打卡或补打卡或修改打卡
   * @returns {*}
   */
  @computed
  get enableButton() {
    return util.get(this.data, "canCheckin", true) && this._hasModifyFiles();
  }

  /**
   * 隐藏取消打卡dialog
   */
  @action
  hideCancelCheckinDialog = () => this.cancelCheckinDialog.show = false;

  /**
   * 显示取消打卡dialog
   */
  @action
  showCancelCheckinDialog = () => this.cancelCheckinDialog.show = true;

  /**
   * 设置打卡日期，用于用户选择日期
   * @param timePickerValue
   */
  @action
  setCheckInDate = (timePickerValue) => {
    // this.courseBeganDate = new Date();
    //before set, must check time:
    const DATE_NOW = new Date();
    const canCheckinDeadline = DATE_NOW > this.courseEndDate ? this.courseEndDate : DATE_NOW;

    let userPickedDate = Date.parse(timePickerValue) ? new Date(timePickerValue) : DATE_NOW;
    if (userPickedDate > canCheckinDeadline) {
      userPickedDate = canCheckinDeadline;
      httpToast.showToast({ text: "日期不在课程时间内", icon: "warn" });
    }

    this.checkInDate = cutil.format(userPickedDate, "yyyy-MM-dd");
  };

  /**
   * 获取打卡详情信息
   *
   * TODO: 1.以后加个API，通过时间和当前课程，获取打卡文件，2.以及后台限制打卡次数
   * @returns {*}
   */
  _fetchCheckin = () => {
    if (this.actionType === this.CHECKIN_STATE.EDIT) {
      return httpGet(`${baseUrl}/${this.courseId}/checkin/${this.checkinId}`);
    } else if (this.actionType === this.CHECKIN_STATE.CREATE) {
      const urlQueryStr = this.checkInDate
        ? `?date=${ this.checkInDate }`
        : '';

      return httpGet(`${baseUrl}/${this.courseId}/checkin${ urlQueryStr }`);
    }

    return Promise.reject(new Error("获取文件异常，请联系管理员"));
  };

  /**
   * 将上传好的文件推入打卡文件列表头部
   *
   * @param item
   * @private
   */
  @action
  _pushUploadFile = (item) => {
    this.data.userFiles.unshift(item);
  };

  /**
   * 检查用户是否勾选文件
   *
   * @returns {boolean}
   * @private
   */
  _hasModifyFiles = () => {
    return util.get(this.data, "userFiles", []).filter(item => item.hasCheckined).length !== 0;
  };

  /**
   * 获取七牛云文件上传token
   *
   * @param fileName
   * @param mimeType
   * @returns {*}
   * @private
   */
  _fetchQiniuUploadToken = (fileName, mimeType) => {
    const body = {
      fileName: fileName,
      attachType: "CHECKIN_REPOSITORY"
    };

    const fileType = mimeType.split('/')[0];
    switch (fileType) {
      case "image" :
      case "video" :
      case "audio" :
        body.fileType = fileType;
        break;
      default : //other types (like 'application'), will be in here
        //因为这里你直接 return 掉，中断了后续的回调操作，所以不会有模拟的点击方法，这个时候也就不会有后续的上传操作了
        return Promise.reject(new Error("不支持该文件格式！"));
    }

    return httpPost(`${util.baseUrl}api/qiniu`, body);
  };

  /**
   * 设置选择文件按钮状态
   *
   * @param chooseFileButtonDisabled
   * @private
   */
  @action
  _setChooseFileButtonDisabled = (chooseFileButtonDisabled) => {
    this.chooseFileButtonDisabled = chooseFileButtonDisabled === true;
  };

  /**
   * 设置打卡详情信息
   *
   * @param data
   * @private
   */
  @action
  _setCheckin = (data) => {
    if (this.actionType === this.CHECKIN_STATE.CREATE && data.canCheckin !== true) {
      httpToast.showToast({ text: "当前无法打卡", icon: "warn", cb: this.backToCourseDetail });
      return;
    }

    this.data = { ...data };
    this.checkInDate = util.get(data, "checkinTime", "").slice(0, 10);
    const endDate = util.get(data, "clazz.endDate");
    this.courseEndDate = endDate ? new Date(endDate) : new Date();
  };

  /**
   * 构建文件上传配置信息
   *
   * @param uploadFile                上传文件触发事件，用于获取七牛云token后触发上传按钮的点击事件
   * @param showToast                 展示toast函数
   * @param enableChooseFileButton    enable上传按钮函数
   * @param disableChooseFileButton   disable上传按钮函数
   * @param fetchQiniuUploadToken     获取七牛云token函数
   * @param appendUploadFile          上传完的文件的后续处理函数
   * @returns {{}}
   * @private
   */
  _constructFileUploadOptions = (uploadFile, showToast, enableChooseFileButton, disableChooseFileButton, fetchQiniuUploadToken, appendUploadFile) => {
    const paramAddToField = {
      token: 'unknown_token',
      key: 'unknown_key'
    };

    return {
      baseUrl: '//upload.qiniu.com',
      dataType: 'json',
      wrapperDisplay: 'inline-block',
      multiple: false,
      accept: 'image/*, audio/*, video/*',
      chooseAndUpload: false,
      paramAddToField: paramAddToField,
      fileFieldName: 'file',
      withCredentials: false,
      chooseFile: (files) => {
        if (typeof files === 'string') {
          showToast({ text: "当前浏览器不支持文件上传", icon: "warn", back: false });
          return;
        }
        if (files.length === 0) {
          return;
        }
        const fileName = files[0].name;

        fetchQiniuUploadToken(fileName, files[0].type)
          .then((data) => {

            paramAddToField.token = data.upToken;
            paramAddToField.key = data.key;

            uploadFile();
          })
          .catch((error) => {
            showToast({ text: error.message, icon: "warn", back: false });
          });
      },
      beforeUpload: (files, mill) => {
        disableChooseFileButton();

        const preventUpload = () => {
          enableChooseFileButton();
          return false;
        };

        if (typeof files === 'string') {
          //目前先ban掉 ie这种浏览器的上传请求
          showToast({ text: "当前浏览器不支持文件上传", icon: "warn", back: false });
          preventUpload();
        }
        if (files[0] && files[0].size < MAX_FILE_SIZE) {
          files[0].mill = mill;
          return true;
        }
        if (files[0] && files[0].size >= MAX_FILE_SIZE) {
          showToast({ text: "文件过大！", icon: "warn", back: false });
          preventUpload();
        }
        preventUpload();
      },
      uploadSuccess: (resp) => {
        appendUploadFile(resp.data);// 上传成功之后，直接将七牛返回的结果，append到数组的最前端，更新data

        showToast({ text: "上传文件成功！", icon: "success", back: false });
        enableChooseFileButton();
      },
      uploadError: (err) => {
        showToast({ text: err.message, icon: "warn", back: false });
        enableChooseFileButton();
      },
      uploadFail: (resp) => {
        showToast({ text: "上传失败！", icon: "warn", back: false });
        enableChooseFileButton();
      }
    };
  };
}

export default CheckinDetail;
