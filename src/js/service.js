'use strict';

import request from "superagent";

import util from "./config";
import httpToast from "./store/common/httpToast";
import { browserHistory } from "react-router";

const HTTP_OK_STATUS = 200,
  HTTP_REGISTER_STATUS = 406,
  HTTP_LOGIN_STATUS = 555;

/**
 * 底层xhr函数，返回可加error-handle和url参数的函数
 * @param {Function} errHandler
 * @return {Function} errXhrWrapper
 */
const baseXhr = (errHandler) => ({ url, method = "GET", body = null }) =>
  new Promise((resolve, reject) =>
    request(method, url)
      .set("X-Auth-Token", util.token)
      .send(body)
      .end((err, res) => {
        const statusCode = res.statusCode,
          messageCode = res.body.code;

        if (statusCode === HTTP_OK_STATUS) {
          if (messageCode === HTTP_OK_STATUS) {
            let data = res.body.data,
              message = { message: res.body.message };
            if (typeof data === "number" || data instanceof Array
              || typeof data === "string" || typeof data === "boolean") {
              resolve(data);
            } else {
              resolve({...data, ...message});
            }
          } else {
            reject(res.body.message);
          }
        } else {
          if (statusCode === HTTP_LOGIN_STATUS && messageCode === HTTP_LOGIN_STATUS) {
            const loginTriedCount = Number(sessionStorage.loginTriedCount || 0);
            if (util.isProduct && loginTriedCount <= 5) {
              // 清空token
              util.clearToken();
              delete localStorage.token;

              sessionStorage.loginTriedCount = loginTriedCount + 1;

              return void browserHistory.go('/');
            }
            reject('登录异常，请联系客服人员');
          } else if (statusCode === HTTP_REGISTER_STATUS && messageCode === HTTP_REGISTER_STATUS) {
            return void browserHistory.replace('/subscribe');
          } else {
            reject(res.body.message);
          }
        }
      }))
    .catch(errHandler);

/**
 * error-handler是直接更改位于root的toast的状态
 * @param {String} msg
 * @return void
 */
const errHandler = (msg) => {
  httpToast.showToast({ text: msg });
  throw new Error(msg);
};

/**
 * 具体方法的抽象函数，已经有了默认的错误处理函数
 * @type {Function}
 */
const errorXhr = baseXhr(errHandler);

/**
 * get函数
 * @param {String} url
 * @return {Promise}
 */
export const httpGet = (url) => errorXhr({ url });

/**
 * post函数
 * @param {String} url
 * @param {Object} body
 * @return {Promise}
 */
export const httpPost = (url, body) => errorXhr({ url, method: "POST", body });

/**
 * put函数
 * @param {String} url
 * @param {Object} body
 * @return {Promise}
 */
export const httpPut = (url, body) => errorXhr({ url, method: "PUT", body });

/**
 * delete函数
 * @param {String} url
 * @return {Promise}
 */
export const httpDel = (url) => errorXhr({ url, method: "DELETE" });
