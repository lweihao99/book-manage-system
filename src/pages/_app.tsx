import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 优化加载界面
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="loading_wrap">
        <div className="loading"></div>
        <div className="loading_text">loading...</div>
      </div>
    );
  }

  // 判断路由是否是在login页面
  return router.pathname === "/login" ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
