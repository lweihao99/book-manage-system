import React, { ReactNode } from "react";
import styles from "./index.module.css";

/**
 * @description 作为页面的高阶组件，用来添加重复的标题和按钮
 * @param operation 会将每个页面的按钮作为参数接收过来
 * @returns
 */
export default function Content({
  children,
  title,
  operation,
}: {
  children: ReactNode;
  title: string;
  operation: ReactNode;
}) {
  return (
    <>
      <div className={styles.title}>
        {title}
        <span className={styles.btn}>{operation}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </>
  );
}
