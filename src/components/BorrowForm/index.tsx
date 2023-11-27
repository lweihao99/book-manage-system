import Content from "@/components/Content";
import { Button, Form, Input, Select, message } from "antd";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getUserList } from "@/apis/user";
import { getBookList } from "@/apis/book";
import { BorrowType } from "@/type";
import { borrowAdd, borrowUpdate } from "@/apis/borrow";

export default function BorrowForm({ title, editData }: { title: string }) {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [stock, setStock] = useState(0);

  // 初始化执行
  useEffect(() => {
    // 获取用户列表和书籍列表
    getUserList().then((res) => {
      setUserList(res.data);
    });
    getBookList().then((res) => {
      setBookList(res.data);
    });
  }, []);

  // 点击创建按钮
  const handleFinish = async (values: BorrowType) => {
    try {
      if (editData?.id) {
        // 通过编辑按钮传过来的
        await borrowUpdate(values);
        message.success("编辑成功");
      } else {
        // 创建按钮
        await borrowAdd(values);
        message.success("创建成功");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // 检查库存
  const handleBookStockChange = (value, options) => {
    setStock(options.stock);
  };

  return (
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        {/* book name */}
        <Form.Item
          label="Book name"
          name="book"
          rules={[{ required: true, message: "Please select book" }]}
        >
          <Select
            onChange={handleBookStockChange}
            placeholder="Please select book"
            options={bookList.map((item) => ({
              label: item.name,
              value: item._id,
              stock: item.stock,
            }))}
          ></Select>
        </Form.Item>

        {/* user lending */}
        <Form.Item
          label="Borrower"
          name="user"
          rules={[{ required: true, message: "Please select book" }]}
        >
          <Select
            placeholder="Please select"
            options={userList.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          ></Select>
        </Form.Item>

        {/* book stock */}
        <Form.Item label="Stock">{stock}</Form.Item>

        {/* create button */}
        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
            disabled={!(stock > 0)}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
