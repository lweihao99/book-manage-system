import qs from "qs"; // 一个用来将JS对象转化为URL查询字符串的库
import { BookQueryType, BookType } from "@/type";
import request from "@/utils/request";

// 获取书籍列表名
export async function getBookList(params?: BookQueryType) {
  //https://mock.apifox.cn/m1/2398938-0-default/api/books?name=xxx&author=xxx&category=xxx
  return request.get(`/api/books?${qs.stringify(params)}`); // 返回一个promise
}

// 发送，添加新创建的书籍
export async function bookAdd(params: BookType) {
  return request.post("/api/books", params); // 添加
}
