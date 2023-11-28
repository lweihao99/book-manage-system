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
  gender: USER_GENDER.MALE;
  role: USER_ROLE.USER;
  status: USER_STATUS.ON;
}
