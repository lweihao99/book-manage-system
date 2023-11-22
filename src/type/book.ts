// interface 接口 是用来定义对象的解构，约束，和规范的一种方式
export interface BookQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
}
