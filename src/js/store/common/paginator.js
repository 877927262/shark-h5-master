import {observable, useStrict, action} from "mobx";

useStrict(true);

class Paginator {
  @observable values = [];
  @observable pageNumber = 1;
  @observable totalPageNum = 1;
  @observable hasMore = false;

  @action
  updateData = (data) => {
    this.values = this.values.concat(data.values);
    this.pageNumber = data.paginator.pageNumber + 1;
    this.totalPageNum = data.paginator.totalPageNum;
    this.hasMore = (this.pageNumber <= this.totalPageNum);
  };

  @action
  resetValues = () => {
    this.hasMore = false;
    this.values = [];
    this.pageNumber = 1;
    this.totalPageNum = 1;
  };
}

export default Paginator;
