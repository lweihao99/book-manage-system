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
  Image,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import styles from "./index.module.css";
import { getBookList } from "@/apis/book";
import { BookQueryType } from "@/type";

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Image",
    dataIndex: "cover",
    key: "cover",
    width: 120,
    render: (text: string) => {
      return <Image width={100} src={text} alt="" />;
    },
  },
  {
    title: "author",
    dataIndex: "author",
    key: "author",
    width: 120,
  },
  {
    title: "category",
    dataIndex: "category",
    key: "category",
    width: 80,
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description",
    ellipsis: true, // 多出的变为省略号
    width: 200,
    render: (text: string) => {
      return (
        <Tooltip title={text} placement="topLeft">
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "stock",
    dataIndex: "stock",
    key: "stock",
    width: 80,
  },
  {
    title: "Publication Date",
    dataIndex: "publishAt",
    key: "publishAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Home() {
  // 拿到form的实例，并绑定在表单上
  const [form] = Form.useForm();
  const router = useRouter();

  // 跟踪获取的数据
  const [data, setData] = useState([]);

  // 跟踪每一页元素的情况,并且useState通过TablePaginationConfig指定了状态变量类型
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20, // 每页显示的元素
    showSizeChanger: true, //改变每页pageSize
    total: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await getBookList({
        current: 1,
        pageSize: pagination.pageSize,
      });

      const { data } = res;
      setData(data);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search点击之后
  const handleSearchFinish = async (values: BookQueryType) => {
    // 拿到搜索表单的值并进行请求
    const res = await getBookList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    console.log(res.data);
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  // submit之后，初始化输入框
  const handleSearchReset = () => {
    form.resetFields(); // initialValues
  };

  // 点击Edit之后，执行路由
  const handleBookEdit = () => {
    router.push("/book/edit/id");
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);

    const query = form.getFieldValue();

    // 页面发生变化后重新获取
    getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
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
          dataSource={data}
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
