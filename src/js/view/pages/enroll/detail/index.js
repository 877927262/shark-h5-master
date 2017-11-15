import React, { Component } from "react";
import { Link } from "react-router";
import { inject, observer, PropTypes } from "mobx-react";
import WeUI from "react-weui";
const { Dialog } = WeUI;

import "../../../../../style/enroll.scss";
import { clazzJoinTypeEnum } from "../../../enum";
import _  from '../../../util';
import  cutil from '../../../../common-util';

@inject("Modal", "EnrollDetail") @observer
class EnrollDetailPage extends Component {
  constructor(props) {
    super(props);

    this.cid = this.props.params.courseId;
    this.modal = new this.props.Modal("班级说明", "我知道了～");
    this.detail = new this.props.EnrollDetail(this.cid);
    this.formatMoney = this.formatMoney.bind(this);
  }

  componentDidMount() {
    this.detail.fetchDetail(this.detail.setDetail);
    this.detail.fetchIntroduction(this.detail.setIntrodution);
  }

  formatMoney(raw) {
    return ((Number(raw) | 0) / 100).toFixed(2)
  }

  render() {
    const { detail } = this.detail;
    const { clazzType, clazzJoinType } = detail;
    const safelyClazzName = _.get(clazzJoinTypeEnum, `${clazzJoinType}.name`, '友班课程');
    return (
      <div className="enroll-page page">
        <header className="bar bar-nav">
          <a className="icon icon-left pull-left" onClick={() => history.go(-1)}/>
          {/*<a className="icon icon-share pull-right"/>*/}
          <h1 className="title">课程报名</h1>
        </header>
        <div className="content">
          <div className="course-detail">

            <div className="course-introduction item-content">
              <div className="course-intro-wrapper">
                <div className="course-title">{detail.name}</div>
                <div className="flex-row clazz-description-container">
                  <div className="flex-all flex-row">
                    <span>{safelyClazzName}</span>
                    <i className="qa-button icon-gb icon-gb-help" onClick={this.modal.open}/>
                    <div className="flex-all flex-row">{detail.description}</div>
                  </div>
                  {
                    ((count) => {
                      if (count > 50) { /* 50 人以上再显示 */
                        return (<div className="font-blue">{detail.studentCount}人报名</div>);
                      }
                    })(detail.studentCount)
                  }

                </div>
                {
                  clazzType === 'LONG_TERM' || (
                    <div className="flex-row justify-between clazz-task-container">
                      <div className="font-grey">
                        时间: {cutil.format(new Date(detail.startDate), 'yyyy-MM-dd')}
                        ~ {cutil.format(new Date(detail.endDate), 'yyyy-MM-dd')}
                      </div>
                      <div className="font-blue">
                        {detail.taskCount}天训练
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div className="web-view item-content"
               dangerouslySetInnerHTML={{ __html: this.detail.introduction }}/>
        </div>
        <div className="enroll-detail">
          <footer className="bar bar-tab">
            {
              ((status) => {
                if (clazzType === 'LONG_TERM') {
                  return (
                    <div className="fix-end">
                      <div className="sm-txt">
                        <span className="cost-txt">多套餐可选</span>
                      </div>
                      <div>
                        <div onClick={() => window.location.href = `/enroll/pay/${ this.cid }`}
                             className="button button-fill enroll-button">报名预约
                        </div>
                      </div>
                    </div>
                  )
                }

                switch (status) {
                  case "WAITENTER":
                  case "PROCESSING":
                  case "CLOSE":
                    return (
                      <div className="flex-row justify-center end-bg">
                        <div className="button button-light end-button">
                          <Link to={`/course/${ this.cid }/detail`}>已加入（进入主页）</Link>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <div className="fix-end">
                        <div className="sm-txt">
                      <span
                        className="cost-txt">￥ {this.formatMoney(detail.priceList ? detail.priceList[0].totalFee : 0)}</span>
                          <span className="font-grey"> (原价 <span
                            className="font-red">￥ {this.formatMoney(detail.priceList ? detail.priceList[0].originFee : 0)}</span>)</span>
                        </div>
                        <div>
                          <div onClick={() => window.location.href = `/enroll/pay/${ this.cid }`}
                               className="button button-fill enroll-button">报名预约
                          </div>
                        </div>
                      </div>
                    )
                }
              })(detail.joinStatus)
            }
          </footer>
        </div>
        <Dialog
          buttons={this.modal.buttons}
          show={this.modal.state}
          title={`什么是${safelyClazzName}？`}
        >
          {
            ((clzType) => {
              switch (clzType) {
                case clazzJoinTypeEnum["PAY"].key:

                  return (
                    <div>
                      <div className="modal-text">
                        <div className="text-title">什么是付费班？</div>
                        <div>付费班就是仅仅支付学费的班级；</div>
                        <div>不强制打卡，打卡有一定的优惠券拿；</div>
                      </div>
                      <div className="modal-text">
                        <div className="text-title">付费班有什么不同？</div>
                        <div>相比笃金班，付费班课程的知识性更强，时间更灵活；</div>
                      </div>
                    </div>
                  );
                case clazzJoinTypeEnum["FREE"].key:

                  return (
                    <div>
                      <div className="modal-text">
                        <div className="text-title">什么是免费班？</div>
                        <div>免费班包括体验班、推广班、福利班；</div>
                        <div>免费班没有严格意义的笃师，课程时间也较短；</div>
                      </div>
                    </div>
                  );
                case clazzJoinTypeEnum["GAMBITION_COIN"].key:

                  return (
                    <div>
                      <div className="modal-text">
                        <div className="text-title">什么是笃金班？</div>
                        <div>笃金班就是你支付一笔笃金，完成任务就能赎回笃金；</div>
                        <div>比如30天的任务，完成了20天，就能赎回 2/3 的笃金；</div>
                      </div>
                      <div className="modal-text">
                        <div className="text-title">笃金班规则？</div>
                        <div>每日需要完成任务要求的作业；不达标会被黄牌警告；</div>
                        <div>每日抽查如果发现浑水摸鱼的情况，直接扣5天学分。</div>
                      </div>
                    </div>
                  );

                default:
                  return (
                    <div>
                      <div className="modal-text">
                        <div className="text-title">空空如也哦～</div>
                      </div>
                    </div>
                  );

              }
            })(clazzJoinType)
          }
        </Dialog>
      </div>
    );
  }
}

EnrollDetailPage.propTypes = {
  Modal: PropTypes.objectOrObservableObject,
  EnrollDetail: PropTypes.objectOrObservableObject,
  params: React.PropTypes.object
};

export default EnrollDetailPage;
