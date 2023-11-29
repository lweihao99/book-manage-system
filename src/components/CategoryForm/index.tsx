import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { CategoryType } from "@/type";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import Content from "../Content";
import { LEVEL_OPTION } from "@/pages/category";
import { categoryAdd, categoryUpdate, getCategoryList } from "@/apis/category";

export default function CategoryForm({
  title,
  data,
}: {
  title: string;
  data: CategoryType;
}) {
  const [level, setLevel] = useState(1);
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const [form] = Form.useForm(); // 拿到form实例并绑定
  const router = useRouter();

  // 获取所有表单数据
  const handleFinish = async (values: CategoryType) => {
    if (data?._id) {
      await categoryUpdate(data?._id, values);
      message.success("Update Success");
    } else {
      await categoryAdd(values);
      message.success("Create Success");
    }
    // await categoryAdd(values);
    router.push("/category");
  };

  useEffect(() => {
    if (data?._id) {
      form.setFieldValue({ ...data });
    }
  }, [data, form]);

  // 初始化获取一级分类数据
  useEffect(() => {
    async function fetchData() {
      const res = await getCategoryList({ all: true, level: 1 });
      setLevelOneList(res.data);
    }
    fetchData();
  }, []);

  // 监控levelOneList， 发生变化就重新执行回调函数，避免不必要的渲染
  const levelOneOption = useMemo(() => {
    return levelOneList.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [levelOneList]);

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
        {/* name */}
        <Form.Item
          label="Category"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Please enter name" />
        </Form.Item>

        {/* level select parent/child category*/}
        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: "Please select level" }]}
        >
          <Select
            onChange={(value) => {
              setLevel(value);
            }}
            placeholder="Please Select"
            options={LEVEL_OPTION}
            disabled={!!(data?.level == 2)}
          ></Select>
        </Form.Item>

        {/* parent category */}
        {(level === 2 || data?.level === 2) && (
          <Form.Item
            label="Parent category"
            name="parent"
            rules={[{ required: true, message: "Please select level" }]}
          >
            <Select
              placeholder="Please Select"
              options={levelOneOption}
            ></Select>
          </Form.Item>
        )}

        {/* category create button */}
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
