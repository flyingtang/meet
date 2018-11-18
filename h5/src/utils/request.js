import fetch from "isomorphic-fetch"

import cookie from 'react-cookies'
import {URLSearchParams} from "url"
import {Toast} from "antd-mobile"
const prefixUrl = "/api/v1"
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
 async function request(url, options={}) {
  try {
      url = prefixUrl+url
        console.log(url, "url")
        
        options = Object.assign({}, options, {headers:{ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "authorization": cookie.load("token")}}) 

        console.log(options, "opt")
        const response = await fetch(url, options);
        const status = response.status;
      
        const res = await response.json()
        if (status >= 200 && status < 300) {
          return res;
        }else{
          Toast.fail(res["message"]);
        }
  }catch(err) {
    Toast.fail("数据请求出错啦");
  }
}

export  async function find (url, filter) {

    url = `${url}?filter=${JSON.stringify(filter)}`
    console.log(url, "uuu")
    return await request(url, {method: "GET"})
}