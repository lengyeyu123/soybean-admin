import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import CustomAxiosInstance from './instance';
import type { StatusConfig } from './instance';

type ResponseSuccess = [null, any];
type ResponseFail = [any, null];

/**
 * 封装各个请求方法及结果处理的类
 * @author Soybean(曹理斌) 2021-03-15
 * @class Request
 */
class Request {
  instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  static successHandler(response: AxiosResponse) {
    const result: ResponseSuccess = [null, response];
    return result;
  }

  static failHandler(error: any) {
    const result: ResponseFail = [error, null];
    return result;
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config).then(Request.successHandler).catch(Request.failHandler);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config).then(Request.successHandler).catch(Request.failHandler);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config).then(Request.successHandler).catch(Request.failHandler);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config).then(Request.successHandler).catch(Request.failHandler);
  }
}

export function createRequest(axiosConfig: AxiosRequestConfig, statusConfig?: StatusConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig, statusConfig);
  const request = new Request(customInstance.instance);
  return request;
}

/**
 * 对请求的结果数据进行格式化的处理
 * @param handleFunc - 处理函数
 * @param errors - 接收多个请求的错误
 * @param datas - 接收多个请求的数据
 */
export function handleResponse<T>(handleFunc: Function, errors: any[], datas: any[]) {
  let handleData = null;
  if (errors.every(error => !error)) {
    handleData = handleFunc(...datas);
  }
  const resError = errors.find(error => Boolean(error));
  return [resError, handleData] as [any, T];
}