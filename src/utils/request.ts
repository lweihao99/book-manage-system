import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Router from "next/router";
import { message as AntdMessage } from "antd";

interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

const CreateAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  // axios实例
  const instance = axios.create({
    timeout: 5000,
    ...config, //继承
  });

  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // 接口请求成功或失败触发
  instance.interceptors.response.use(
    function (response) {
      // 是否已经登录，是否成功
      const { status, data, message } = response as any;
      if (status === 200) {
        return data;
      } else if (status === 401) {
        //没权限或者没登陆
        return Router.push("/login");
      } else {
        // other error
        AntdMessage.error(message || "Server exception");
      }
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        return Router.push("/login");
      }
      AntdMessage.error(error?.response?.data?.message || "Server exception");
      return Promise.reject(error);
    }
  );

  return instance;
};

export default CreateAxiosInstance();
