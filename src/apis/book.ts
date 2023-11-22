import qs from "qs"; // 一个用来将JS对象转化为URL查询字符串的库
import axios from "axios";
import { BookQueryType } from "@/type/book";

export async function getBookList(params?: BookQueryType) {
  //https://mock.apifox.cn/m1/2398938-0-default/api/books?name=xxx&author=xxx&category=xxx
  const res = await axios(`/api/books?${qs.stringify(params)}`);
  return res.data;
}
