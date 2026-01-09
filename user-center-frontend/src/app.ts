// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
import { RequestConfig } from '@@/plugin-request/request';
import { history } from '@umijs/max';
import { currentUser as queryCurrentUser } from '@/services/demo/user-api';
import { RunTimeLayoutConfig } from '@umijs/max';

const loginPath = '/user/login';

// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// 1. 全局初始化状态
export async function getInitialState(): Promise<{
  settings?: any;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {

  // 定义一个获取用户信息的函数（Login 页面登录成功后会调用它）
  const fetchUserInfo = async () => {
    try {
      // 这里的 queryCurrentUser 对应后端的 GET /user/current 接口
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      // 如果获取失败（比如没登录），跳转登录页
      // history.push('/user/login');
    }
    return undefined;
  };

  // 页面加载时执行的逻辑：
  // 如果不是登录页面，就尝试去获取用户信息
  if (window.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo, // 把这个方法暴露给全局，这样 Login 页面就能用了
      currentUser,
      settings: {},
    };
  }

  // 如果是登录页面，就不查用户信息了，只把方法暴露出去
  return {
    fetchUserInfo,
    settings: {},
  };
}
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',

  //   Interception logic during page switching
    onPageChange:()=>{
      const {location} = history;
      const whiteList = ['/user/register',loginPath];
      if(whiteList.includes(location.pathname)){
        return;
      }
      //如果没有登陆，重定向到login page
      if(!initialState?.currentUser){
        history.push(loginPath);
      }

    }
  };
};

export const request: RequestConfig = {
  // baseURL:'/api',
  timeout:10000,
  withCredentials: true, // 允许跨域携带 Cookie

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