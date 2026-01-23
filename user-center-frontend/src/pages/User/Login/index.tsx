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

  // 表单提交处理函数
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 1.登录
      const res = await login({ ...values, type });

      if (res.code === 0 && res.data) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);

        // 2. 获取真正的用户信息
        // 🌟 核心步骤 2: 亲自去查户口 (不依赖 app.tsx)
        // 手动更新，防止竞态
        try {
          const userRes = await queryCurrentUser();
          if (userRes.code === 0 && userRes.data) {
            await setInitialState((s) => ({
              ...s,
              currentUser: userRes.data,
            }));
            // 3. 只有成功获取用户信息后才跳转
            const urlParams = new URL(window.location.href).searchParams;
            const redirect = urlParams.get('redirect');
            // 使用 window.location.href 强制刷新，确保 Cookie 和状态完全同步
            window.location.href = redirect || '/';
            return;
          } else {
            message.error('获取用户信息失败');
          }
        } catch (e) {
          console.error(e);
          message.error('获取用户信息异常');
        }
        // 如果获取用户信息失败，不跳转，留在登录页让用户重试
        return;
      }
      // 如果 code !== 0
      message.error(res.message || '登录失败，请检查账号和密码');
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
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
                name="userAccount" // 对应后端 UserLoginRequest 里的 userAccount
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
                name="userPassword" // 对应后端 UserLoginRequest 里的 userPassword
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