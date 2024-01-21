// interface 接口 是用来定义对象的解构，约束，和规范的一种方式
export interface BookQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
  all?: boolean;
}

// 定义表单类型
export interface BookType {
  _id?: string; // mongo数据库的id
  name: string;
  author: string;
  description: string;
  createdAt: string;
  publishAt: number; // 出版日期
  bookNo: string; // 图书编号
  cover: string; // 封面
  stock: number; // 库存
  category: string; // 分类
}

export interface BookFormType {
  title: string;
  data?: BookType | undefined;
}
