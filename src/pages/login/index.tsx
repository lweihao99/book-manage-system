// import
import { Button, Form, Input, message } from "antd";
import styles from "./index.module.css";
import { userLogin } from "@/apis/user";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  // 请求登录
  const handleFinish = async (values: { name: string; password: string }) => {
    const res = await userLogin(values);

    if (res.data.status === "on") {
      message.success("登录成功");
      router.push("/book");
    }
  };

  // tsx
  return (
    <div className={styles.container}>
      {/* title */}
      <h2 className={styles.title}>Library Manage System</h2>

      <Form onFinish={handleFinish}>
        {/* account input */}
        <Form.Item
          label="账号"
          name="name"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Please enter username"></Input>
        </Form.Item>

        {/* password input */}
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Please enter password"></Input.Password>
        </Form.Item>

        {/* login button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
