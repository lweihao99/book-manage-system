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
  Tag,
  Modal,
  message,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import styles from "./index.module.css";
import { categoryDelete, getCategoryList } from "@/apis/category";
import { CategoryQueryType } from "@/type";
import Content from "@/components/Content";

const LEVEL = {
  ONE: 1,
  TWO: 2,
};

// 分类等级
export const LEVEL_OPTION = [
  { label: "primary", value: LEVEL.ONE },
  { label: "secondary", value: LEVEL.TWO },
];

// 列表名
const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    width: 120,
    render: (text: string) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`Level ${text}`}</Tag>;
    },
  },
  {
    title: "Parent Category",
    dataIndex: "parent",
    key: "parent",
    width: 120,
    render: (text: { name: string }) => {
      return text?.name ?? "--"; // 如果存在就显示
    },
  },
  {
    title: "Publication Date",
    dataIndex: "publishAt",
    key: "publishAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Category() {
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

  // 请求函数获取页面数据
  async function fetchData(values?: any) {
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });

    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  }

  // 第一次请求
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search点击之后
  const handleSearchFinish = async (values: CategoryQueryType) => {
    console.log(values);
    // 拿到搜索表单的值并进行请求
    const res = await getCategoryList({
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
  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);

    const query = form.getFieldValue();

    // 页面发生变化后重新获取
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  // 控制列表删除
  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure delete this category?",
      okText: "Yes",
      cancelText: "Cancel",
      async onOk() {
        await categoryDelete(id); // 删除接口
        message.success("Delete success");
        fetchData(form.getFieldValue()); // 获取搜索栏表单数据
      },
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
            <Button
              type="link"
              onClick={() => {
                handleCategoryEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              type="link"
              onClick={() => {
                handleCategoryDelete(row._id);
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
      title="Category"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/category/add");
          }}
        >
          Add Category
        </Button>
      }
    >
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
            <Form.Item name="name" label="Category name">
              <Input placeholder="Please enter a book name" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="level" label="Level">
              <Select
                showSearch
                allowClear
                placeholder="category"
                options={LEVEL_OPTION}
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
    </Content>
  );
}
