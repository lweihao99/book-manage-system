export interface CategoryQueryType {
  name?: string;
  level?: number;
  current?: number;
  pageSize?: number;
  all?: boolean; // 假如有这个参数就将所有的数据都返回
}

export interface CategoryType {
  name: string;
  level: number;
  _id?: string;
  parentLevel: string;
  parent: CategoryType;
  children: CategoryType[];
}
