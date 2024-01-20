import { BookType } from "./book";
import { UserType } from "./user";

// interface 接口 是用来定义对象的解构，约束，和规范的一种方式
export interface BorrowQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
  all?: boolean;
  status?: BORROW_STATUS;
}

// 定义表单类型
export interface BorrowType {
  book: BookType;
  borrowAt: number;
  backAt: number;
  user: UserType;
  status: BORROW_STATUS;
}
