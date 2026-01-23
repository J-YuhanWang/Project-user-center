// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
import { RequestConfig } from '@@/plugin-request/request';
import { currentUser as queryCurrentUser, outLogin } from '@/services/demo/user-api';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import { Avatar, Dropdown, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { defaultSettings } from '@ant-design/pro-layout/es/defaultSettings';
// 如果你有退出接口
// import { outLogin } from '@/services/ant-design-pro/api';

const loginPath = '/user/login';
/*
无需登录态的页面
 */
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register', loginPath];

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
      const response = await queryCurrentUser();
      console.log('await queryCurrentUser():', response);
      if (response.code === 0 && response.data) {
        return response.data;
      }
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };

  // 如果是登录页面，就不查用户信息了，只把方法暴露出去
  // 如果不是登录页面，就尝试去获取用户信息
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo, // 把这个方法暴露给全局，这样 Login 页面就能用了
    currentUser,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }): any => {

  console.log('当前全局状态：', initialState?.currentUser);
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',

    // avatarProps: undefined, // 禁用默认的，因为我们要完全自定义
    // rightContentRender: () => <AvatarDropdown menu={true} />,
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
            await outLogin();

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
                src={currentUser.avatarUrl}
                icon={<UserOutlined />} // 如果没图片，显示这个默认图标
                alt="avatar"
              />

              {/* 用户名组件 */}
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
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
    onPageChange: () => {
      console.log('门卫检查:', initialState?.currentUser)
      const { location } = history;
      if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {
        return;
      }
      //如果没有登陆，重定向到login page
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }

    }
  };
};

export const request: RequestConfig = {
  // baseURL:'/api',
  timeout: 1000000,
  withCredentials: true, // 允许跨域携带 Cookie

  // 响应拦截器 (保留之前建议的逻辑，这块很有用)
  responseInterceptors: [
    (response) => {
      const { data } = response as unknown as { data: any };
      if (!data) {
        throw new Error('网络异常');
      }
      // 业务状态码
      const { code } = data;
      // 成功
      if (code === 0) {
        // 不再解包，直接返回完整响应
        return response;
      }
      // 未登录
      if (code === 40100) {
        // message.error('请先登录');
        if (!history.location.pathname.includes('/user/login')) {
          history.push(loginPath);
        }
        // 抛出错误，中断后续流程
        throw new Error('请先登录');
      }

      // 其他错误
      message.error(data.message || '系统错误');
      throw new Error(data.message || '系统错误');
    },
  ],

};