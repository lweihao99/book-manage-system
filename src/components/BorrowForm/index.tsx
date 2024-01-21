import Content from "@/components/Content";
import { Button, Form, Input, Select, message } from "antd";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getUserList } from "@/apis/user";
import { getBookList } from "@/apis/book";
import { BookType, BorrowOptionType, BorrowType, UserType } from "@/type";
import { borrowAdd, borrowUpdate } from "@/apis/borrow";
import { useRouter } from "next/router";

const BorrowForm: React.FC<any> = ({ title, editData }) => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [stock, setStock] = useState(0);
  const router = useRouter();

  // 初始化执行
  useEffect(() => {
    // 获取用户列表和书籍列表
    getUserList().then((res) => {
      setUserList(res.data);
    });
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue(editData);
  }, [editData, form]);

  // 点击创建按钮
  const handleFinish = async (values: BorrowType) => {
    try {
      if (editData?.id) {
        // 通过编辑按钮传过来的
        await borrowUpdate(values);
        message.success("Edit success");
      } else {
        // 创建按钮
        await borrowAdd(values);
        message.success("Crete success");
      }
      router.push("/borrow");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // 检查库存
  const handleBookStockChange = (
    value: string,
    options: BorrowOptionType | BorrowOptionType[]
  ) => {
    setStock((options as BorrowOptionType).stock);
  };

  return (
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
        autoComplete="off"
      >
        {/* book name */}
        <Form.Item
          label="Book name"
          name="book"
          rules={[{ required: true, message: "Please select book" }]}
        >
          <Select
            onChange={handleBookStockChange}
            showSearch
            optionFilterProp="label"
            placeholder="Please select book"
            options={bookList.map((item: BookType) => ({
              label: item.name,
              value: item._id as string,
              stock: item.stock,
            }))}
          ></Select>
        </Form.Item>

        {/* user lending */}
        <Form.Item
          label="Borrower"
          name="user"
          rules={[{ required: true, message: "Please select user" }]}
        >
          <Select
            placeholder="Please select"
            options={userList.map((item: UserType) => ({
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
            disabled={!(stock > 0) && !editData?._id}
          >
            {editData?._id ? "Edit" : "Borrow"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default BorrowForm;
