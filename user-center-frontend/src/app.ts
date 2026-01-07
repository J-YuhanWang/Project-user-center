// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
import { RequestConfig } from '@@/plugin-request/request';


// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

export const request: RequestConfig = {
  // baseURL:'/api',
  timeout:10000,
  // withCredentials: true, // 允许跨域携带 Cookie

  // 响应拦截器 (保留之前建议的逻辑，这块很有用)
  // responseInterceptors: [
  //   (response) => {
  //     const { data } = response as any;
  //
  //     // 如果后端返回的 code 不是 0，说明业务逻辑错了（比如密码错误）
  //     if (data?.code === 0) {
  //       // 成功，什么都不用做，或者返回 response
  //     } else {
  //       // 失败，统一打印错误，不用在每个页面都写 message.error
  //       // 注意：有些特殊请求可能不需要全局报错，视情况而定
  //       console.error('业务错误：', data?.message);
  //     }
  //     return response;
  //   },
  // ],
};