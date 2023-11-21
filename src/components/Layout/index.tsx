import React, { ReactNode } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout as AntdLayout,
  Menu,
  theme,
  Dropdown,
  Space,
} from "antd";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import { useRouter } from "next/router";

const { Header, Content, Sider } = AntdLayout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const ITEMS = [
  {
    key: `book`,
    // icon: React.createElement(icon),
    label: `Library manage`,

    children: [
      { label: `book category`, key: `/book` },
      { label: `book add`, key: `/book/add` }, // key 改成路由，这样在点击之后就会跳转到指定路由
    ],
  },
  {
    key: `category`,
    // icon: React.createElement(icon),
    label: `Category management`,

    children: [
      { label: `Category list`, key: `/category` },
      { label: `Category adding`, key: `/category/add` }, // key 改成路由，这样在点击之后就会跳转到指定路由
    ],
  },
  {
    key: `borrow`,
    // icon: React.createElement(icon),
    label: `Book lending`,

    children: [
      { label: `Lending list`, key: `/borrow` },
      { label: `add Lending `, key: `/borrow/add` }, // key 改成路由，这样在点击之后就会跳转到指定路由
    ],
  },
  {
    key: `user`,
    // icon: React.createElement(icon),
    label: `User management`,

    children: [
      { label: `User list`, key: `/user` },
      { label: `User adding`, key: `/user/add` }, // key 改成路由，这样在点击之后就会跳转到指定路由
    ],
  },
];

// menu items
const USER_ITEMS: MenuProps["items"] = [
  {
    key: "1",
    label: "User Center",
  },
  {
    key: "2",
    label: "Log Out",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // 定义这是Menu的一个方法
  const HandleMenuClick: MenuProps["onClick"] = ({
    item,
    key,
    keyPath,
    domEvent,
  }) => {
    router.push(key);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} `}>
        <AntdLayout>
          <Header className={styles.header}>
            <Image
              src="/logo.svg"
              width={30}
              height={30}
              alt="logo"
              className={styles.logo}
            ></Image>
            Book Manage System
            <span className={styles.user}>
              <Dropdown menu={{ items: USER_ITEMS }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    User
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </span>
          </Header>
          <AntdLayout className={styles.sectionInner}>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
                items={ITEMS}
                onClick={HandleMenuClick}
              />
            </Sider>
            <AntdLayout className={styles.sectionContent}>
              <Content className={styles.content}>{children}</Content>
            </AntdLayout>
          </AntdLayout>
        </AntdLayout>
      </main>
    </>
  );
}