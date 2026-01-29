import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { PLANET_LINK, SYSTEM_LOGO } from '@/constants';
import { currentUser as queryCurrentUser, login } from '@/services/demo/user-api';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');

  // Form submission handler
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 1. Login
      const res = await login({ ...values, type });

      if (res.code === 0 && res.data) {
        const defaultLoginSuccessMessage = 'Login successful!';
        message.success(defaultLoginSuccessMessage);

        // 2. Get real user info
        // 🌟 Core Step 2: Fetch user details personally (don't rely on app.tsx)
        // Update manually to prevent race conditions
        try {
          const userRes = await queryCurrentUser();
          if (userRes.code === 0 && userRes.data) {
            await setInitialState((s) => ({
              ...s,
              currentUser: userRes.data,
            }));
            // 3. Jump only after successfully procuring user info
            const urlParams = new URL(window.location.href).searchParams;
            const redirect = urlParams.get('redirect');
            // Force refresh with window.location.href to ensure Cookie and state sync
            window.location.href = redirect || '/';
            return;
          } else {
            message.error('Failed to fetch user info');
          }
        } catch (e) {
          console.error(e);
          message.error('Exception fetching user info');
        }
        // If fetching user info fails, do not redirect, stay on login page for retry
        return;
      }
      // If code !== 0
      message.error(res.message || 'Login failed, please check account and password');
    } catch (error) {
      const defaultLoginFailureMessage = 'Login failed, please try again!';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <div style={{ margin: '100px auto', width: '400px' }}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="User Center"
          subTitle="The most relaxing craic center"
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: 'LOGIN',
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: 'Login to your account',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount" // Maps to backend UserLoginRequest: userAccount
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'Enter account name'}
                rules={[
                  {
                    required: true,
                    message: 'User account is required.',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword" // Maps to backend UserLoginRequest: userPassword
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'Enter password'}
                rules={[
                  {
                    required: true,
                    message: 'Password is required.',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: 'Passwords must be at least 8 characters long.',
                  },
                ]}
              />
            </>
          )}

          <div style={{ marginBottom: 24 }}>
            <Link to="/user/register">Create new account</Link>
            <a style={{ float: 'right' }}
              href={PLANET_LINK}
              target="_blank" rel="noreferrer">
              Forgot your password?
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;