import {httpGet, httpPost} from "../../service";

import util from "../util";
import Paginator from "../common/paginator";

const baseUrl = `${util.baseUrl}api/clazz`;

class Materials {

  constructor(cid, fid) {
    this.cid = cid;
    this.fid = fid;
    this.all = new Paginator();
  }

  postMaterial = (mid) =>
    httpPost(`${baseUrl}/${this.cid}/feedback/${this.fid}`, {
      replyType: "MATERIAL",
      materialId: mid
    }).then(() => history.back());


  fetchMaterials = (cb, pageNumber = 1, pageSize = 13) =>
    httpGet(`${baseUrl}/${this.cid}/feedback/materials?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .then(cb);

  getMaterials = () => {
    let {updateData, pageNumber} = this.all;
    this.fetchMaterials(updateData, pageNumber);
  };

  hasMore = () => this.all.hasMore;
}


export default Materials;


