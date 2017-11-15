'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import WeUI from "react-weui";

const {
  Button,
  CellBody,
  CellsTitle,
  Dialog,
  Form,
  FormCell,
  Select,
  TextArea
} = WeUI;

@inject("ClazzExit") @observer
class ClazzExit extends Component {
  constructor(props) {
    super(props);

    this.clazzExit = new this.props.ClazzExit();
  }

  updateSelectedClazz = (event) => this.clazzExit.setSelectedClazzId(event.target.value);

  updateExitReason = (event) => this.clazzExit.setExitReason(event.target.value);

  componentDidMount() {
    this.clazzExit.fetchProcessingClazzList();
  }

  render() {
    const {
      clazzList, selectedClazzId, exitReason, isDialogshow, dialogButtons, isFormValid,
      showDialog
    } = this.clazzExit;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">退班申请</h1>
        </header>
        <div className="content">
          <CellsTitle>退班班级</CellsTitle>
          <Form>
            <FormCell select>
              <CellBody>
                <Select value={selectedClazzId} onChange={this.updateSelectedClazz}>
                  {
                    clazzList.map((clazzItem) => <option value={clazzItem.id}
                                                         key={clazzItem.id}>{clazzItem.name}</option>)
                  }
                </Select>
              </CellBody>
            </FormCell>
          </Form>
          <CellsTitle>原因</CellsTitle>
          <Form>
            <FormCell>
              <CellBody>
                <TextArea placeholder="请详细填写，以便我们改进课程哦！" rows="3" maxlength="200"
                          value={exitReason} onChange={this.updateExitReason}/>
              </CellBody>
            </FormCell>
          </Form>
        </div>
        <footer className="bar bar-tab">
          <Button id="clazz-exit-confirm-button" onClick={showDialog} disabled={!isFormValid}>
            提交申请
          </Button>
        </footer>
        <Dialog title="确认退班" buttons={dialogButtons} show={isDialogshow}>退班需要后台审核，一般需1~3个工作日</Dialog>
      </div>
    )
  }
}

export default ClazzExit;
