export interface UserQueryType {
  name?: string;
  level?: number;
  current?: number;
  pageSize?: number;
}

export interface UserType {
  name: string;
  status: "on" | "off";
  nickName: string;
  _id?: string;
}
