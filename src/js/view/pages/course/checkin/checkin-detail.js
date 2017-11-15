'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import _ from "../../../util";
import { fileTypeEnum } from "../../../enum";
import cutil from "../../../../common-util";

import WeUI from "react-weui";
import FileUpload from "react-fileupload";
import EmptyTip from "../../../EmptyTip";

const {
  CellsTitle,
  CellHeader,
  CellBody,
  CellFooter,
  Form,
  FormCell,
  Input,
  Label,
  Checkbox,
  Button,
  ButtonArea,
  Dialog
} = WeUI;

@inject("CheckinDetail", "CheckinList") @observer
class CheckinDetail extends Component {
  constructor(props) {
    super(props);

    const { checkinId, courseId } = this.props.params;

    this.checkinId = checkinId;
    this.courseId = courseId;

    this.detail = new this.props.CheckinDetail(this.courseId, this.checkinId, () => this.refs['uploadBtn'].click());
    this.checkinList = this.props.CheckinList;
  }

  componentDidMount() {
    this.detail.getCheckin();
  }

  // 打卡操作的公共部分
  _commonCheckin = (action) => {
    const { disableChooseFileButton, enableChooseFileButton, backToCourseDetail, showSuccessToast } = this.detail;

    disableChooseFileButton();
    action()
      .then(() => {
        enableChooseFileButton();
        this.checkinList.getCheckins();
        showSuccessToast();

        window.setTimeout(backToCourseDetail, 1200);
      })
      .catch((error) => {
        enableChooseFileButton(false);
      });
  };
  // 修改打卡
  modifyCheckin = () => this._commonCheckin(this.detail.modifyCheckin);
  // 打卡 或 补打卡
  addCheckin = () => this._commonCheckin(this.detail.addCheckin);
  // 取消打卡
  deleteCheckin = () => this._commonCheckin(this.detail.deleteCheckin);

  render() {
    const nowDateStr = cutil.format(new Date(), "yyyy-MM-dd");
    const {
      data, cancelCheckinDialog, checkInDate, FILE_UPLOAD_OPTIONS, actionType, CHECKIN_STATE, chooseFileButtonDisabled,
      enableButton, hideCancelCheckinDialog, showCancelCheckinDialog, backToCourseDetail,
      changeFileState, getCheckin, setCheckInDate
    } = this.detail;

    const userFiles = _.get(data, "userFiles", []);

    return (
      <div className="page page-current course-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={backToCourseDetail}>
            <span className="icon-gb icon-gb-close m-l-sm"/>
          </button>
          <h1 className="title">学习任务</h1>
        </header>
        <div className="content">
          <CellsTitle>课程信息</CellsTitle>
          <Form>
            <FormCell className="checkin-detail-cell">
              <CellHeader>
                <Label>课程</Label>
              </CellHeader>
              <CellBody>
                <div className="checkin-class">{_.get(data, "clazz.name")}</div>
              </CellBody>
            </FormCell>
            <FormCell className="checkin-detail-cell">
              <CellHeader>
                <Label>日期</Label>
              </CellHeader>
              <CellBody>
                {
                  ((actionType) => {
                    switch (actionType) {
                      case CHECKIN_STATE.EDIT:
                        return (
                          <div className="checkin-date">{_.get(data, "checkinTime").slice(0, 10)}</div>
                        );
                      case CHECKIN_STATE.CREATE:
                        return (
                          <Input type="date" defaultValue={checkInDate || nowDateStr} onChange={(e) => {
                            setCheckInDate(e.target.value);
                            getCheckin();
                          }}/>
                        );
                      default:
                        return null;
                    }
                  })(actionType)
                }
              </CellBody>
            </FormCell>
          </Form>

          <CellsTitle className="checkin-detail-cell-title">
            <div>选择打卡文件</div>
            {
              ((actionType) => {
                switch (actionType) {
                  case CHECKIN_STATE.CREATE:
                    return (
                      <div className="checkin-detail-file-upload">
                        <FileUpload options={FILE_UPLOAD_OPTIONS}>
                          <i ref="uploadBtn"/>
                          <Button ref="chooseBtn" disabled={chooseFileButtonDisabled} size="small">上传</Button>
                        </FileUpload>
                      </div>
                    );
                  default:
                    return null;
                }
              })(actionType)
            }
          </CellsTitle>

          {
            userFiles.length
              ? <Form checkbox>
              {
                userFiles.map((item) => {
                  const fileTypeName = _.get(fileTypeEnum, `${item.fileType}.name`, '');
                  return (
                    <FormCell checkbox className="checkin-detail-cell" key={item.id}>
                      <CellHeader>
                        <i className={"icon-gb icon-gb-" + item.fileType}/>
                      </CellHeader>
                      <CellBody>
                        <div className="checkin-file-title">
                          {_.get(item, "fileName", `微信${fileTypeName}`)}
                        </div>
                        <div
                          className="checkin-file-time">{cutil.format(new Date(item.upTime), "yyyy-MM-dd hh:mm:ss")}</div>
                      </CellBody>
                      <CellFooter>
                        <Checkbox checked={item.hasCheckined} onChange={(e) => {
                          changeFileState(item)
                        }}/>
                      </CellFooter>
                    </FormCell>
                  );
                })
              }
            </Form>
              : <EmptyTip tip="请先上传文件再打卡，回复“打卡”获取轻教程。"/>
          }
          {
            ((actionType) => {
              switch (actionType) {
                case CHECKIN_STATE.EDIT:
                  return (
                    <ButtonArea>
                      <Button disabled={!enableButton || chooseFileButtonDisabled} onClick={this.modifyCheckin}>
                        修改打卡
                      </Button>
                      <Button type="default" onClick={ showCancelCheckinDialog }>取消打卡</Button>
                    </ButtonArea>
                  );
                case CHECKIN_STATE.CREATE:
                  return (
                    <ButtonArea className="checkin-detail-btn">
                      {
                        (checkInDate === nowDateStr)
                          ? (<Button disabled={!enableButton || chooseFileButtonDisabled} onClick={this.addCheckin}>
                          打卡
                        </Button>)
                          : (<div>
                          <Button disabled={!enableButton || chooseFileButtonDisabled} onClick={this.addCheckin}>
                            补打卡
                          </Button>
                          <div className="text-center checkin-detail-text">
                            补打卡有次数限制，请谨慎使用
                          </div>
                        </div>)
                      }
                    </ButtonArea>
                  );
                default:
                  return null;
              }
            })(actionType)
          }
        </div>
        <Dialog title="确认取消打卡" show={cancelCheckinDialog.show} buttons={[
          {
            type: 'default',
            label: '取消',
            onClick: hideCancelCheckinDialog
          },
          {
            type: 'primary',
            label: '确认',
            onClick: this.deleteCheckin
          }
        ]}>
          取消后不可恢复！
        </Dialog>
      </div>
    )
  }
}

export default CheckinDetail;
