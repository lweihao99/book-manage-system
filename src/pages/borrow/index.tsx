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
  Modal,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import dayjs from "dayjs";

import styles from "./index.module.css";
import { BookType, BorrowQueryType, BorrowType, CategoryType } from "@/type";
import { BORROW_STATUS } from "@/constant/user";
import Content from "@/components/Content";
import { getBookList } from "@/apis/book";
import { getBorrowList, borrowDelete, borrowBack } from "@/apis/borrow";
import { getCategoryList } from "@/apis/category";

const Option = Select.Option;

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
    ellipsis: true,
    width: 300,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    width: 100,
    render: (text: string) => {
      return text === "on" ? (
        <Tag color="red">Borrow</Tag>
      ) : (
        <Tag color="green">Return</Tag>
      );
    },
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    width: 150,
  },
  {
    title: "Borrower",
    dataIndex: "borrowUser",
    key: "borrowUser",
    width: 150,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 150,
  },
  {
    title: "Borrow Date",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 200,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Return Date",
    dataIndex: "backAt",
    key: "backAt",
    width: 200,
    render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
  },
];

export default function Borrow() {
  // 拿到form的实例，并绑定在表单上
  const [form] = Form.useForm();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  // 跟踪每一页元素的情况
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20, // 每页显示的元素
    showSizeChanger: true, //改变每页pageSize
  });

  // 修改/删除操作列表
  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_: any, row: BorrowType) => {
        return (
          <Space>
            {row.status === BORROW_STATUS.ON ? (
              <Button
                type="link"
                disabled={!(row.status === "on")}
                onClick={() => {
                  handleBorrowBack(row._id as string);
                }}
              >
                RETURN
              </Button>
            ) : (
              <Button
                type="link"
                block
                onClick={() => {
                  router.push(`/borrow/edit/${row._id}`);
                }}
              >
                Edit
              </Button>
            )}

            <Button
              danger
              type="link"
              onClick={() => {
                handleDeleteModal(row._id as string);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const fetchData = useCallback(
    (search?: BorrowQueryType) => {
      // 获取借阅列表页面数据
      const { book, user, author, status } = search || {};
      const res = getBorrowList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        book,
        author,
        user,
        status,
      }).then((res) => {
        const data = res.data.map((item: BorrowType) => ({
          ...item,
          bookName: item.book.name,
          borrowUser: item.user?.nickName,
          status: item.user?.status,
        }));
        setData(data);
        setTotal(res.total);
      });
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  // 数据请求接口，以及列表渲染
  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
  }, []);

  // search点击之后
  const handleSearchFinish = async (values: BorrowQueryType) => {
    // 拿到搜索表单的值并进行请求
    const res = await getBorrowList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize!,
    });

    const newData = res.data.map(
      (item: {
        book: { name: any };
        user: { nickName: any; status: any };
      }) => ({
        ...item,
        bookName: item.book.name,
      })
    );
    setData(newData);
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  // submit之后，初始化输入框
  const handleSearchReset = () => {
    form.resetFields(); // initialValues
  };

  // 点击Edit之后，执行路由
  const handleBorrowBack = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await borrowBack(id);
        message.success("Returned");
        fetchData(form.getFieldsValue());
      },
    });
  };

  // 删除操作控制
  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await borrowDelete(id);
        fetchData(form.getFieldsValue());
        message.success("Delete success.");
      },
    });
  };

  // 控制改变页面渲染元素数量
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);

    const query = form.getFieldsValue();

    // 页面发生变化后重新获取
    getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  // 页面
  return (
    <Content
      title="Borrow List"
      // operation={
      //   <Button
      //     type="primary"
      //     onClick={() => {
      //       router.push("/borrow/add");
      //     }}
      //   >
      //     Add Borrow
      //   </Button>
      // }
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
              <Select
                allowClear
                showSearch
                placeholder="Select"
                optionFilterProp="label"
                options={STATUS_OPTIONS}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="Category">
              <Select placeholder="Please Select" allowClear>
                {categoryList.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
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
            total: total,
            showTotal: () => `there are ${pagination.total} results`,
          }}
        />
      </div>
    </Content>
  );
}
