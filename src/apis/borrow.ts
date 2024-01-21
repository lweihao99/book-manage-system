import qs from "qs"; // 一个用来将JS对象转化为URL查询字符串的库
import { BorrowQueryType, BorrowType } from "@/type";
import request from "@/utils/request";

// 获取书籍列表名
export async function getBorrowList(params?: BorrowQueryType) {
  //https://mock.apifox.cn/m1/2398938-0-default/api/borrows?name=xxx&author=xxx&category=xxx
  return request.get(`/api/borrows?${qs.stringify(params)}`); // 返回一个promise
}

// 发送，添加新创建的书籍
export async function borrowAdd(params: BorrowType) {
  return request.post("/api/borrows", params); // 添加
}

export async function borrowDelete(id: string) {
  return request.delete(`/api/borrows/${id}`);
}

// 获取详情
export async function getBorrowDetails(id: string) {
  return request.get(`/api/borrows/${id}`);
}

export async function borrowUpdate(params: BorrowType) {
  return request.put(`/api/borrows/`, params);
}

export const borrowBack = (id: string) => {
  return request.put(`/api/borrows/back/${id}`);
};
