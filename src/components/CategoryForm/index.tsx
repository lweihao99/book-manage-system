import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Image,
  message,
} from "antd";
import { bookAdd } from "@/apis/book";
import { BookType } from "@/type";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import dayjs from "dayjs";
import Content from "../Content";
import { LEVEL_OPTION } from "@/pages/category";

const { TextArea } = Input;

export default function CategoryForm() {
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm(); // 拿到form实例并绑定
  const router = useRouter();

  // 获取所有表单数据
  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf(); // 将日期改为时间戳
    }
    await bookAdd(values);
    message.success("Create Success");
    router.push("/book");
  };

  return (
    // 对于Content 来说，form是一个子节点children
    <Content title="Book Add">
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Book name"
          name="name"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter name" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter name" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "please select category" }]}
        >
          <Select placeholder="Please select">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Level" name="level">
          <Select options={LEVEL_OPTION}></Select>
        </Form.Item>
        {preview && (
          <Form.Item label=" " colon={false}>
            <Image src={preview} width={100} height={100} alt=""></Image>
          </Form.Item>
        )}
        <Form.Item label="Publishing date" name="publishAt">
          <DatePicker placeholder="Please select date" />
        </Form.Item>
        <Form.Item label="Stock" name="stock">
          <InputNumber placeholder="Please enter number" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Please enter description" />
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
