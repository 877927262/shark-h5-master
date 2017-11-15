import React, { Component } from "react";
import { browserHistory } from "react-router";
import { observer, inject } from "mobx-react";

import WeUI from "react-weui";

const {
  Cells,
  Cell,
  CellBody,
  CellFooter,
  Dialog
} = WeUI;

@inject("TaskList") @observer
class TaskList extends Component {
  constructor(props) {
    super(props);

    this.taskList = this.props.TaskList;
  }

  componentDidMount() {
  }

  onTaskItemClick = (item) => {
    switch (item.postType) {
      case "CLAZZ_TASK":
        browserHistory.push(`/course/${ this.taskList.courseId }/task/${ item.target }?postId=${ item.id }`);
        return;
      default:
        location.href = item.target;
        return;
    }
  };

  render() {
    const { content, dialog, processCourseCanceling } = this.taskList;

    return (
      <div>
        <div className="task-list-wrap">
          {
            content.map(item => (
              <Cells className="task-item" key={item.id} id={item.target} onClick={() => this.onTaskItemClick(item)}>
                {item.stickied && <i className="icon-gb icon-gb-mark-top task-item-mark-top"/>}
                <Cell className="task-title">
                  <CellBody className="text-overflow-hidden">
                    {item.title}
                  </CellBody>
                  <CellFooter>
                  </CellFooter>
                </Cell>
                <Cell className="task-time">
                  <CellBody>
                    发布于: {item.date}
                  </CellBody>
                </Cell>
              </Cells>
            ))
          }
        </div>
        <Dialog title="是否真的要退出课程" show={dialog.show} buttons={(() => {
          return [
            {
              type: 'default',
              label: '取消',
              onClick: () => {
                dialog.dismissDialog();
              }
            },
            {
              type: 'primary',
              label: '确认',
              onClick: processCourseCanceling
            }
          ];
        })()}>
        </Dialog>
      </div>
    )
  }
}

export default TaskList;
