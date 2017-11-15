'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";

const {
  CellsTitle,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  ButtonArea,
  Button,
  Form,
  FormCell,
  TextArea,
  Label,
  Input,
  Select,
  CellsTips
} = WeUI;

@inject("WithDraw") @observer
class Withdraw extends Component {
  constructor(props) {
    super(props);

    this.withdraw = new this.props.WithDraw();
  }

  componentDidMount() {
    this.withdraw.fetchCoinSum();
  }

  onChangeCoins = event => this.withdraw.onChange(event.target.value, "coins");

  onChangeUsername = event => this.withdraw.onChange(event.target.value, "username");

  onChangeRemark = event => this.withdraw.onChange(event.target.value, "remark");

  render() {
    const { coinSum, isWithdrawing, withdrawCoin } = this.withdraw;

    return (
      <div className="page page-current me-page">
        <header className="bar bar-nav">
          <button className="button button-link button-nav pull-left" onClick={() => history.go(-1)}>
            <span className="icon icon-left"/>
          </button>
          <h1 className="title">提现</h1>
        </header>
        <div className="content">
          <CellsTitle>储值信息</CellsTitle>
          <Cells>
            <Cell className="withdraw-cell">
              <CellBody>可用优币</CellBody>
              <CellFooter><span className="coin-total">{coinSum}</span></CellFooter>
            </Cell>
          </Cells>

          <CellsTitle>提现信息</CellsTitle>
          <Form>
            <FormCell className="withdraw-cell">
              <CellHeader>
                <Label>提现数目<span className="input-required">*</span></Label>
              </CellHeader>
              <CellBody>
                <Input type="number" placeholder="只有超过100优币才能兑换" onChange={this.onChangeCoins}/>
              </CellBody>
            </FormCell>

            <FormCell className="withdraw-cell">
              <CellHeader>
                <Label>真实姓名<span className="input-required">*</span></Label>
              </CellHeader>
              <CellBody>
                <Input type="text" placeholder="微信提现必须真实姓名验证" onChange={this.onChangeUsername}/>
              </CellBody>
            </FormCell>

            <FormCell select selectPos="after" className="withdraw-cell">
              <CellHeader>
                <Label>提现渠道<span className="input-required">*</span></Label>
              </CellHeader>
              <CellBody>
                <Select defaultValue="1">
                  <option value="1">微信</option>
                </Select>
              </CellBody>
            </FormCell>
          </Form>

          <CellsTitle>备注</CellsTitle>
          <Form>
            <FormCell>
              <CellBody>
                <TextArea placeholder="请输入备注信息(200字内)" rows="3" maxlength="200" onChange={this.onChangeRemark}/>
              </CellBody>
            </FormCell>
          </Form>

          <ButtonArea>
            <Button disabled={isWithdrawing} onClick={withdrawCoin}>
              提交
            </Button>
            <CellsTips className="warning">只有超过100优币才能兑换</CellsTips>
          </ButtonArea>
        </div>
      </div>
    )
  }
}

export default Withdraw;
