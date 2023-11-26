import qs from "qs"; // 一个用来将JS对象转化为URL查询字符串的库
import { UserQueryType, UserType } from "@/type";
import request from "@/utils/request";

// 获取书籍列表名
export async function getUserList(params?: UserQueryType) {
  //https://mock.apifox.cn/m1/2398938-0-default/api/borrows?name=xxx&author=xxx&category=xxx
  return request.get(`/api/users?${qs.stringify(params)}`); // 返回一个promise
}

// 发送，添加新创建的书籍
export async function userAdd(params: UserType) {
  return request.post("/api/users", params); // 添加
}

// 删除数据
export async function userDelete(id: number) {
  return request.delete(`/api/users/${id}`);
}

// 更新数据
export async function userUpdate(params: UserType) {
  return request.put(`/api/users/`, params);
}
