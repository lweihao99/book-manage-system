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
  Input,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import styles from "./index.module.css";
import { BookType, BorrowQueryType, BorrowType } from "@/type";
import Content from "@/components/Content";
import { getBookList } from "@/apis/book";
import { getUserList, userDelete, userUpdate } from "@/apis/user";

const STATUS = { ON: "on", OFF: "off" };

const STATUS_OPTIONS = [
  {
    label: "Normal",
    value: STATUS.ON,
  },
  {
    label: "Disable",
    value: STATUS.OFF,
  },
];

// 列表名以及定位
const COLUMNS = [
  {
    title: "Account",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Username",
    dataIndex: "nickName",
    key: "nickName",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) => {
      return text === STATUS.ON ? (
        <Tag color="green">NORMAL</Tag>
      ) : (
        <Tag color="red">DISABLE</Tag>
      );
    },
  },
  {
    title: "Borrow Date",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function User() {
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
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    });

    const { data } = res;
    setData(data);
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
    const res = await getUserList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });

    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  // submit之后，初始化输入框
  const handleSearchReset = () => {
    form.resetFields(); // initialValues
  };

  // 点击Edit之后，执行路由
  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`);
  };

  // 控制改变页面渲染元素数量
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);

    const query = form.getFieldsValue();

    // 页面发生变化后重新获取
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  // 删除操作控制
  const handleUserDelete = async (id: string) => {
    await userDelete(id); // 进行删除请求
    message.success("Delete Success");
    fetchData(form.getFieldsValue()); //获取表单参数
  };

  // 状态控制
  const handleStatusChange = async (row: any) => {
    const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON;

    await userUpdate({
      ...row,
      status,
    });

    message.success("Update Success");

    fetchData(form.getFieldsValue());
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
                handleUserEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger={row.status === STATUS.ON ? true : false}
              onClick={() => {
                handleStatusChange(row);
              }}
            >
              {row.status === STATUS.ON ? "DISABLE" : "ACTIVE"}
            </Button>
            <Button
              danger
              type="link"
              onClick={() => {
                handleUserDelete(row._id);
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
      title="User List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/user/add");
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
          status: null,
        }}
      >
        {/* 将行分成24网格，并且每一个列站5个位置 */}
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="User">
              <Input placeholder="Please enter a name" allowClear></Input>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="Status">
              <Select allowClear options={STATUS_OPTIONS}></Select>
            </Form.Item>
          </Col>
          {/* searchbar buttons */}
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
