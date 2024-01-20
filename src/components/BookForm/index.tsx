import React, { useEffect, useState } from "react";
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
import { bookAdd, bookUpdate } from "@/apis/book";
import { BookType, CategoryType } from "@/type";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import dayjs from "dayjs";
import Content from "../Content";
import { getCategoryList } from "@/apis/category";
const { TextArea } = Input;

export default function BookForm({
  title,
  data,
}: {
  title: string;
  data: BookType;
}) {
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm(); // 拿到form实例并绑定
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  useEffect(() => {
    if (data?._id) {
      data.publishAt = dayjs(data.publishAt).format("YYYY-MM-DD");
      data.category = data.category._id;
      form.setFieldsValue(data);
    }
  }, [data, form]);

  // 获取分类名
  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  // 获取所有表单数据
  const handleFinish = async (values: BookType) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf(); // 将日期改为时间戳
    }

    if (data?._id) {
      await bookUpdate(data?._id, values);
      message.success("Update Success");
    } else {
      await bookAdd(values);
      message.success("Create Success");
    }

    // await bookAdd(values);
    router.push("/book");
  };

  return (
    // 对于Content 来说，form是一个子节点children
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
      >
        {/* book name input */}
        <Form.Item
          label="Book name"
          name="name"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter name" />
        </Form.Item>

        {/* author name input */}
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter name" />
        </Form.Item>

        {/* category select */}
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "please select category" }]}
        >
          <Select
            placeholder="Please select"
            options={categoryList.map((item) => ({
              label: item.name,
              value: item._id,
            }))}
          ></Select>
        </Form.Item>

        {/* cover image url input */}
        <Form.Item label="Cover" name="cover">
          <Input.Group compact>
            <Input
              placeholder="Please enter image url"
              style={{ width: "calc(100% - 80px)" }}
              onChange={(e) => {
                // 变化的时候存储到form表单里
                form.setFieldsValue({ cover: e.target.value });
              }}
            />
            <Button
              type="primary"
              onClick={(e) => {
                setPreview(form.getFieldValue("cover"));
              }}
            >
              Preview
            </Button>
          </Input.Group>
        </Form.Item>

        {/* cover image preview */}
        {preview && (
          <Form.Item label=" " colon={false}>
            <Image src={preview} width={100} height={100} alt=""></Image>
          </Form.Item>
        )}

        {/* choose publish date */}
        <Form.Item label="Publishing date" name="publishAt">
          <DatePicker placeholder="Please select date" />
        </Form.Item>

        {/* Book stock */}
        <Form.Item label="Stock" name="stock">
          <InputNumber placeholder="Please enter number" />
        </Form.Item>

        {/* Book description area */}
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Please enter description" />
        </Form.Item>

        {/* create button */}
        <Form.Item label=" " colon={false}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            {data?._id ? "Update" : " Create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}
