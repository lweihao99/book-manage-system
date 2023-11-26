import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  message,
  Tag,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import styles from "./index.module.css";
import { BookType, BorrowQueryType, BorrowType } from "@/type";
import Content from "@/components/Content";
import { getBookList } from "@/apis/book";
import { getBorrowList, borrowDelete } from "@/apis/borrow";

const STATUS_OPTIONS = [
  {
    label: "Lend",
    value: "on",
  },
  {
    label: "Return",
    value: "off",
  },
];

// 列表名以及定位
const COLUMNS = [
  {
    title: "Name",
    dataIndex: "bookName",
    key: "bookName",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 80,
    render: (text: string) => {
      return text === "on" ? (
        <Tag color="red">Lending</Tag>
      ) : (
        <Tag color="green">Return</Tag>
      );
    },
  },
  {
    title: "Borrower",
    dataIndex: "borrowUser",
    key: "borrowUser",
    width: 80,
  },
  {
    title: "Borrow Date",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Return Date",
    dataIndex: "backAt",
    key: "backAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Borrow() {
  // 拿到form的实例，并绑定在表单上
  const [form] = Form.useForm();
  const router = useRouter();

  // 跟踪获取的数据
  const [data, setData] = useState([]);
  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<any[]>([]); // todo ts type

  // 跟踪每一页元素的情况,并且useState通过TablePaginationConfig指定了状态变量类型
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20, // 每页显示的元素
    showSizeChanger: true, //改变每页pageSize
    total: 0,
  });

  async function fetchData(search?: BorrowQueryType) {
    // 获取借阅列表页面数据
    const res = await getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    });

    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
      status: item.user.status,
    }));

    setData(newData);
    setPagination({ ...pagination, total: res.total });
  }

  // 数据请求接口，以及列表渲染
  useEffect(() => {
    fetchData();

    // 获取所有的书籍列表
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search点击之后
  const handleSearchFinish = async (values: BorrowQueryType) => {
    // 拿到搜索表单的值并进行请求
    const res = await getBorrowList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });

    const newData = res.data.map((item) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
      status: item.user.status,
    }));
    setData(newData);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  // submit之后，初始化输入框
  const handleSearchReset = () => {
    form.resetFields(); // initialValues
  };

  // 点击Edit之后，执行路由
  const handleBorrowEdit = (id: string) => {
    router.push(`/borrow/edit/${id}`);
  };

  // 控制改变页面渲染元素数量
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);

    const query = form.getFieldValue();

    // 页面发生变化后重新获取
    getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  // 删除操作控制
  const handleBorrowDelete = async (id: string) => {
    await borrowDelete(id); // 进行删除请求
    message.success("Delete Success");
    fetchData(form.getFieldValue()); //获取表单参数
  };

  // 修改/删除操作列表
  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      key: "action",
      render: (_: any, row: any) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                handleBorrowEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              type="link"
              onClick={() => {
                handleBorrowDelete(row._id);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  // 页面
  return (
    <Content
      title="Borrow List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/borrow/add");
          }}
        >
          Add Borrow
        </Button>
      }
    >
      {/* search 区域 */}
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
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={bookList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="Status">
              <Select allowClear options={STATUS_OPTIONS}></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="user" label="Borrower">
              <Select
                showSearch
                allowClear
                placeholder="Borrower"
                options={userList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
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
      {/* content 区域 */}
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
    </Content>
  );
}
