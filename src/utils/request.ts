import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Router from "next/router";
import { message as AntdMessage } from "antd";

// 定义接口，并扩展了axios库中的AxiosInstance的接口，对Axios实例进行了定制.
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

// 进行请求的定制，并进行指定拦截
const CreateAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  // axios实例
  const instance = axios.create({
    timeout: 5000,
    ...config, //继承
  });

  // 请求拦截器
  instance.interceptors.request.use(
    function (config) {
      const userStorage = sessionStorage.getItem("user");
      const token = userStorage ? JSON.parse(userStorage).token : "";
      config.headers["Authorization"] = "Bearer " + token; // 给标头添加token信息
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // 接口请求成功或失败触发，响应拦截器
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
