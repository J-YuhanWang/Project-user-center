// Runtime Configuration

// Global initial state configuration, used for Layout user information and permission initialization
import { RequestConfig } from '@@/plugin-request/request';
import { currentUser as queryCurrentUser, outLogin } from '@/services/demo/user-api';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import { Avatar, Dropdown, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { defaultSettings } from '@ant-design/pro-layout/es/defaultSettings';
// If you have a logout interface
// import { outLogin } from '@/services/ant-design-pro/api';

const loginPath = '/user/login';
/*
 Pages that do not require login state
 */
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register', loginPath];

// See documentation for more info: https://umijs.org/docs/api/runtime-config#getinitialstate
// 1. Global initial state
export async function getInitialState(): Promise<{
  settings?: any;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // Define a function to fetch user info (Called after successful login on Login page)
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

  // If on login page, skip fetching user info, only expose method
  // If not on login page, attempt to fetch user info
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo, // Expose this method globally for use in Login page
    currentUser,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }): any => {

  console.log('Current global state:', initialState?.currentUser);
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',

    // avatarProps: undefined, // Disable default, as we customize it completely
    // rightContentRender: () => <AvatarDropdown menu={true} />,
    // Top right avatar and username
    rightContentRender: () => {

      const currentUser = initialState?.currentUser;

      // 1. If not logged in, or user is empty, display nothing
      if (!currentUser) {
        return null;
      }

      // 2. Define menu items for avatar dropdown (mainly logout)
      const items = [
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: async () => {
            // A. Call backend logout interface (Optional, if exists)
            await outLogin();

            // B. Clear global state (Critical!)
            await setInitialState((s) => ({ ...s, currentUser: undefined }));

            // C. Redirect to login page
            history.push('/user/login');
            message.success('Logged out successfully');
          },
        },
      ];

      // 3. 渲染头像和名字
      return (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {/* Avatar Component */}
              <Avatar
                size="small"
                src={currentUser.avatarUrl}
                icon={<UserOutlined />} // Show default icon if no image
                alt="avatar"
              />

              {/* Username Component */}
              <span style={{ marginLeft: 8, fontWeight: 500 }}>
                {currentUser.username || currentUser.userAccount || 'User'}
              </span>
            </div>
          </Dropdown>
        </div>
      );
    },
    // Watermark: Display current logged-in user's name
    waterMarkProps: {
      content: initialState?.currentUser?.userAccount,
    },

    //   Interception logic during page switching
    onPageChange: () => {
      console.log('Gatekeeper check:', initialState?.currentUser)
      const { location } = history;
      if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {
        return;
      }
      // If not logged in, redirect to login page
      if (!initialState?.currentUser) {
        history.push(loginPath);
      }

    }
  };
};

export const request: RequestConfig = {
  // baseURL:'/api',
  timeout: 1000000,
  withCredentials: true, // Allow cross-domain cookies

  // Response interceptor
  responseInterceptors: [
    (response) => {
      const { data } = response as unknown as { data: any };
      if (!data) {
        throw new Error('Network Exception');
      }
      // Business status code
      const { code } = data;
      // Success
      if (code === 0) {
        // Do not unwrap, return complete response directly
        return response;
      }
      // Not logged in
      if (code === 40100) {
        // message.error('Please log in first');
        if (!history.location.pathname.includes('/user/login')) {
          history.push(loginPath);
        }
        // Throw error to interrupt
        throw new Error('Please log in first');
      }

      // Other errors
      message.error(data.message || 'System Error');
      throw new Error(data.message || 'System Error');
    },
  ],

};