import qs from "qs"; // 一个用来将JS对象转化为URL查询字符串的库
import { UserQueryType, UserType } from "@/type";
import request from "@/utils/request";

// 获取书籍列表名
export async function getUserList(params?: UserQueryType) {
  //https://mock.apifox.cn/m1/2398938-0-default/api/borrows?name=xxx&author=xxx&category=xxx
  return request.get(`/api/users?${qs.stringify(params)}`); // 返回一个promise
}

// 获取用户详情
export async function getUserDetail(id: string) {
  return request.get(`/api/users/${id}`);
}

// 发送，添加新创建的书籍
export async function userAdd(params: UserType) {
  return request.post("/api/users", params); // 添加
}

// 删除数据
export async function userDelete(id: string) {
  return request.delete(`/api/users/${id}`);
}

// 更新/上传数据
export async function userUpdate(params: UserType) {
  return request.put(`/api/users`, params);
}

// 登录请求
export async function userLogin(params: Pick<UserType, "name" | "password">) {
  return request.post("/api/login", params);
}

// 登出
export async function userLogout() {
  return request.get("/api/logout");
}
