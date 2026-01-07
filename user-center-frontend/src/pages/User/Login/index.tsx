import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useModel, history } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { SYSTEM_LOGO } from '@/constants';
import { PLANET_LINK } from '@/constants'
import { login } from '@/services/demo/user-api';


// 注意：这里以后要换成你真正的后端接口方法
// import { login } from '@/services/ant-design-pro/api';

export default () => {
  const [type, setType] = useState<string>('account');

// 2. 获取全局状态控制权（用来替代 fetchUserInfo）
  const { setInitialState } = useModel('@@initialState');

  // 表单提交处理函数
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      //login
      // 1. 打印看看用户输入了什么，方便调试
      console.log('用户提交的数据:', values);

      // TODO: 这里将来要写连接后端的代码，类似：
      const user = await login({ ...values, type });
      if(user){
        const defaultLoginSuccessMessage = '登录成功！(模拟)';
        message.success(defaultLoginSuccessMessage);
        await setInitialState((s)=>({
          ...s,
          currentUser:user,
        }));

        //跳转逻辑
        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect || '/');

        return;
      }

      // 如果 user 是 null（登录失败）
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
          logo={<img alt="logo" src={SYSTEM_LOGO}/>}
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
                    type:'string',
                    message: 'Passwords must be at least 8 characters long.',
                  },
                ]}
              />
            </>
          )}

          <div style={{ marginBottom: 24 }}>
            <a style={{ float: 'right', marginBottom: '10px' }}
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