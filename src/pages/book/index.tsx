import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./index.module.css";

const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Image",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "author",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "category",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "stock",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Publication Date",
    dataIndex: "date",
    key: "date",
  },
];

export default function Home() {
  // 拿到form的实例，并绑定在表单上
  const [form] = Form.useForm();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // 每页显示的元素
    showSizeChanger: true, //改变每页pageSize
    total: 0,
  });
  const [total, setTotal] = useState(0);

  const handleSearchFinish = (values) => {
    console.log(values);
  };

  const handleSearchReset = () => {
    console.log(form);
    form.resetFields(); // initialValues
  };

  const handleBookEdit = () => {
    router.push("/book/edit/id");
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setPagination(pagination);
  };

  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      key: "action",
      render: (_: any, row: any) => {
        return (
          <Space>
            <Button type="link" onClick={handleBookEdit}>
              Edit
            </Button>
            <Button danger type="link">
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "",
          author: "",
          category: null,
        }}
      >
        {/* 将行分成24网格，并且每一个列站5个位置 */}
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="Book name">
              <Input placeholder="Please enter a book name" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="author" label="Author">
              <Input placeholder="Please enter a name" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="Category">
              <Select
                showSearch
                allowClear
                placeholder="category"
                options={[
                  { value: "jack", label: "Jack" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" },
                  { value: "disabled", label: "Disabled", disabled: true },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showTotal: () => `there are ${pagination.total} result`,
          }}
        />
      </div>
    </>
  );
}
