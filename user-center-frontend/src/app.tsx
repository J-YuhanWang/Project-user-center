// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
import { RequestConfig } from '@@/plugin-request/request';
import { currentUser as queryCurrentUser } from '@/services/demo/user-api';
import { RunTimeLayoutConfig } from '@umijs/max';
import { Avatar, Dropdown, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
// 如果你有退出接口
// import { outLogin } from '@/services/ant-design-pro/api';

const loginPath = '/user/login';
/*
无需登录态的页面
 */
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register',loginPath];

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
      //TODO:interceptor?
      return await queryCurrentUser();
      // console.log('fetchUserInfo---:'+user.userAccount);
    } catch (error) {
      // 如果获取失败（比如没登录），
    }
    return undefined;
  };

  // 页面加载时执行的逻辑：
  // 如果是登录页面，就不查用户信息了，只把方法暴露出去
  if (NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
    return {
      fetchUserInfo,
      settings: {},
    };
  }
  // 如果不是登录页面，就尝试去获取用户信息
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo, // 把这个方法暴露给全局，这样 Login 页面就能用了
    currentUser,
    settings: {},
  };
}
export const layout: RunTimeLayoutConfig = ({ initialState,setInitialState }):any => {

  console.log('当前全局状态：', initialState?.currentUser);
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',

    //右上角头像和用户名
    rightContentRender: () => {
      const currentUser = initialState?.currentUser;

      // 1. 如果没登录，或者 user 是空的，啥都不显示
      if (!currentUser) {
        return null;
      }

      // 2. 定义点击头像弹出的菜单项（这里主要是退出登录）
      const items = [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: async () => {
            // A. 调用后端退出接口 (可选，如果有的话)
            // await outLogin();

            // B. 清空全局状态（关键！）
            await setInitialState((s) => ({ ...s, currentUser: undefined }));

            // C. 跳转回登录页
            history.push('/user/login');
            message.success('已安全退出');
          },
        },
      ];

      // 3. 渲染头像和名字
      return (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {/* 头像组件 */}
              <Avatar
                size="small"
                // ⚠️ 注意：检查你的数据库字段是 avatarUrl 还是 avatar
                src={currentUser.avatarUrl}
                icon={<UserOutlined />} // 如果没图片，显示这个默认图标
                alt="avatar"
              />

              {/* 用户名组件 */}
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
                {/* ⚠️ 注意：检查你的数据库字段是 username 还是 userAccount */}
                {currentUser.username || currentUser.userAccount || '用户'}
              </span>
            </div>
          </Dropdown>
        </div>
      );
    },
    // 水印内容：显示当前登录用户的名字
    waterMarkProps: {
      content: initialState?.currentUser?.userAccount,
    },

  //   Interception logic during page switching
    onPageChange:()=>{
      const {location} = history;
      if(NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)){
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
  responseInterceptors: [
    (response) => {
      // 1. 获取响应数据
      // Umi-request 有时候会直接返回 data，有时候在 response.data 里，做个兼容
      const data = response.data;

      // 2. 如果根本没有 data (比如网络断了，或者后端挂了返回 502)
      if (!data) {
        console.error('❌ 请求失败，没有返回数据');
        return response;
      }

      // 3. 检查业务状态码 (code)
      // 只有当 data 是个对象，且有 code 属性时，才判断
      if (data && typeof data === 'object' && 'code' in data) {
        if (data.code !== 0) {
          // 只有当 code 不为 0 时，才认为是错误
          // 防止打印 undefined，如果 message 为空，显示 '未知错误'
          console.error(`❌ 业务错误 [${data.code}]:`, (data as any).message || '未知错误');

          // (可选) 你可以在这里统一抛出错误，这样前端 catch 就能捕获到
          // throw new Error(data.message);
        }
      }

      return response;
    },
  ],

};