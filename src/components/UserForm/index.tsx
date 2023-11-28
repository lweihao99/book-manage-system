import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Radio } from "antd";
import { CategoryType, UserType } from "@/type";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import Content from "../Content";
import { getCategoryList } from "@/apis/category";
import { userAdd, userUpdate } from "@/apis/user";
import { USER_GENDER, USER_ROLE, USER_STATUS } from "@/constant/user";

export default function UserForm({
  title,
  editData = {
    gender: USER_GENDER.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON,
  },
}: {
  title: string;
  editData?: Partial<UserType>; // 部分
}) {
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm(); // 拿到form实例并绑定
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  // 手动给表单set值
  useEffect(() => {
    if (editData._id) {
      form.setFieldValue(editData);
    }
  }, [editData, form]);

  // 获取所有表单数据
  const handleFinish = async (values: UserType) => {
    if (editData?._id) {
      await userUpdate(values);
    } else {
      await userAdd(values);
    }
    message.success("Create Success");
    router.push("/user");
  };

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  return (
    // 对于Content 来说，form是一个子节点children
    <Content title={title}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        initialValues={editData}
        onFinish={handleFinish}
      >
        {/* account input */}
        <Form.Item
          label="Account"
          name="name"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter account" />
        </Form.Item>

        {/* name input */}
        <Form.Item
          label="Name"
          name="nickName"
          rules={[{ required: true, message: "please enter name" }]}
        >
          <Input placeholder="Please enter username" />
        </Form.Item>

        {/* gender select */}
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        {/* password input */}
        <Form.Item label="Password" name="password">
          <Input.Group compact>
            <Input.Password placeholder="Please enter password" />
          </Input.Group>
        </Form.Item>

        {/* status select */}
        <Form.Item label="Status" name="status">
          <Radio.Group>
            <Radio value="on">Active</Radio>
            <Radio value="off">Disable</Radio>
          </Radio.Group>
        </Form.Item>

        {/* role select */}
        <Form.Item label="Role" name="role">
          <Radio.Group>
            <Radio value="user">User</Radio>
            <Radio value="admin">Admin</Radio>
          </Radio.Group>
        </Form.Item>

        {/* create button */}
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
