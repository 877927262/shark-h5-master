'use strict';

import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";
import InfiniteScroll from "react-infinite-scroller";
import EmptyTip from '../../../EmptyTip';

const {
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter
} = WeUI;

@inject("RankList") @observer
class RankList extends Component {
  constructor(props) {
    super(props);

    this.rankList = this.props.RankList;
  }

  componentDidMount() {
    const { courseBanner, courseName } = this.props;

    this.rankList.initWechatShare(courseName, courseBanner)
  }

  render() {
    const { getRankList, favourRankItem, rankListPaginator, isCurrentUserFirst } = this.rankList;
    const { values, hasMore } = rankListPaginator;

    return (
      <div className="rank-infinite-scroll">
        <InfiniteScroll
          threshold={20}
          useWindow={false}
          initialLoad={false}
          loadMore={getRankList}
          hasMore={hasMore}
          loader={
            <div className="infinite-scroll-preloader">
              <div className="preloader"/>
            </div>
          }>
          <Cells className="m-t-none">
            {
              values.length === 0
                ? <EmptyTip tip="还没有排行榜信息"/>
                : values.map((item, index) => (
                <Cell className={`rank-item ${ isCurrentUserFirst === true && index === 0 ? 'current-user-rank-item' : ''}`} key={item.id}>
                  <CellHeader className="rank-item-header">
                    {item.rank}
                  </CellHeader>
                  <CellBody className="rank-item-body">
                    <img src={item.userInfo.headImgUrl} className="rank-item-avatar" alt="用户头像"/>
                    <span className="rank-item-name text-overflow-hidden">{item.userInfo.name}</span>
                  </CellBody>
                  <CellFooter className="rank-item-footer">
                    <div className="rank-item-score">{item.grade >= 1000 ? '999+' : item.grade}</div>
                    <div className="rank-item-favor">
                      <span className="rank-item-praise text-center">{item.favourInfo.sum}</span>
                      <i className={`icon-gb ${item.favourInfo.isFavour ? 'icon-gb-heart-full' : 'icon-gb-heart-empty'}`}
                         onClick={() => favourRankItem(item, index)}/>
                    </div>
                  </CellFooter>
                </Cell>
              ))
            }
          </Cells>
        </InfiniteScroll>
      </div>
    )
  }
}

export default RankList;
