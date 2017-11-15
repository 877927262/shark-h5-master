import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import {Link, browserHistory} from "react-router";
import InfiniteScroll from "react-infinite-scroller";

import {clazzFeedbackStatusEnum, getEnumByKey} from "../../../enum"

import "../../../../../style/chat.scss";

@inject("Students") @observer
class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.courseId = this.props.params.courseId;
    this.students = new this.props.Students(this.courseId);

    // todo 移除state, 好孩子不要学
    this.state = {
      activeClassName: ""
    };

    this.inActive = this.inActive.bind(this);
    this.outActive = this.outActive.bind(this);
  }

  componentDidMount() {
    this.students.getStudents();
  }

  inActive() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      activeClassName: "searchbar-active"
    });
  }

  outActive() {
    // todo 移除setState, 好孩子不要学
    this.setState({
      activeClassName: ""
    });
  }

  render() {
    const {showWaiting, toggleWait, setKeyword, getStudents, cancelSearch, hasMore, keyWord} = this.students;

    const students = this.students.showingStudents;
    return (
      <div className="page page-current" id="student-page">
        <header className="bar bar-nav student-nav">
          <button className="button button-link button-nav pull-right show-option" onClick={toggleWait}>
            {showWaiting ? "查看全部" : "只看未回复"}
          </button>
          <h1 className="title">一对一学员</h1>
          <Link to={`/course/${ this.courseId }/detail`}
                className="button button-link button-nav pull-left chat-page-back">
            <span className="icon icon-left"/>
          </Link>
        </header>
        <div className="content student-list">
          <div className="search-input-section">
            <div className={"searchbar " + this.state.activeClassName}>
              <a className="searchbar-cancel" onClick={cancelSearch}>取消</a>
              <div className="search-input">
                <label className="icon icon-search" htmlFor="search"/>
                <input type="text" value={keyWord} onChange={setKeyword}
                       onBlur={this.outActive} onFocus={this.inActive}/>
              </div>
            </div>
          </div>
          <div className="list-block" style={{height: "100%", overflow: "auto"}}>
            <InfiniteScroll
              loadMore={getStudents}
              loader={
                (<div className="infinite-scroll-preloader">
                  <div className="preloader"></div>
                </div>)}
              hasMore={hasMore()}
              threshold={20}
              useWindow={false}
            >
              <ul>
                {
                  students.map((student, idx) => {
                    const {user, status, id} = student;
                    return (
                      <li key={idx}>
                        <div onClick={() => location.replace(`/course/${ this.courseId }/one/chat/${ id }`)}
                              className="item-link item-content">
                          <div className="item-media">
                            <img src={user.headImgUrl}/>
                          </div>
                          <div className="item-inner">
                            <div className="item-title">{user.studentNumber} | {user.name}</div>
                            <div className={"item-after " + status.toLowerCase()}>
                              {getEnumByKey(status, clazzFeedbackStatusEnum).name}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    )
  }
}

export default StudentPage;
