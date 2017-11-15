import React, {Component} from "react";
import {inject, observer} from "mobx-react"
import InfiniteScroll from "react-infinite-scroller";

@inject("Materials") @observer
class MaterialPage extends Component {
  constructor(props) {
    super(props);
    const {courseId, feedbackId} = this.props.params;
    this.list = new this.props.Materials(courseId, feedbackId);
  }

  componentDidMount() {
    this.list.getMaterials();
  }

  render() {
    const {getMaterials, hasMore, all, postMaterial} = this.list;
    return (
      <div className="page page-current" id="material-page">
        <header className="bar bar-nav">
          <a className="button button-link button-nav pull-left" href="#chat-page">
            <span className="icon icon-left" onClick={()=>history.back()}/>
          </a>
          <h1 className="title">笃师一对一</h1>
        </header>
        <div className="content material-list infinite-scroll">
          <div className="list-block">
            <div className="list-group">
              <InfiniteScroll
                loadMore={getMaterials}
                loader={
                  (<div className="infinite-scroll-preloader">
                    <div className="preloader"></div>
                  </div>)}
                hasMore={hasMore()}
                threshold={20}
                useWindow={false}
              >
                <ul>
                  <li className="list-title">
                    <div className="item-content">
                      <div className="item-inner">
                        <div className="item-title">请选择素材发送</div>
                      </div>
                    </div>
                  </li>
                  {
                    all.values.map((item, idx)=>(
                      <li key={idx} onClick={()=>postMaterial(item.id)} >
                        <div className="item-content">
                          <div className="item-inner">
                            <div className="item-title">{item.title}</div>
                            <div className="item-after">{item.author}</div>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default MaterialPage;
