import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, Link, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { PLANET_LINK, SYSTEM_LOGO } from '@/constants';
import { login } from '@/services/demo/user-api';
import { currentUser as queryCurrentUser } from '@/services/demo/user-api';


// 注意：这里以后要换成你真正的后端接口方法
// import { register } from '@/services/ant-design-pro/api';

const Login:React.FC = () =>{
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState} = useModel('@@initialState');

  // 表单提交处理函数
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 1.登录
      const user = await login({ ...values, type });

      if (user) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        // 2. 获取真正的用户信息
        // 不要直接使用 login 返回的 user，因为它可能包含 code, message 等包裹信息
        // 我们调用 app.tsx 里暴露出来的 fetchUserInfo 方法，确保获取的数据格式是统一的

        await new Promise((resolve) => setTimeout(resolve, 100));


        // 🌟 核心步骤 2: 亲自去查户口 (不依赖 app.tsx)
        let userInfo;
        try {
          // 直接调接口，拿到最原始的数据
          userInfo = await queryCurrentUser();
        } catch (error) {
          console.error('获取详细信息失败，可能是 Cookie 没跟上', error);
        }

        // 🌟 核心步骤 3: 只有查到了才更新状态并跳转
        if (userInfo) {
          // 打印一下，让自己放心
          console.log('准备写入全局状态的用户信息:', userInfo);

          await setInitialState((s) => ({
            ...s,
            currentUser: userInfo,
          }));
        }

        // 3. 状态更新完毕，跳转
        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect || '/');
        return;
      }
      // 如果 user 是 null
      message.error('登录失败，请检查账号和密码');
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