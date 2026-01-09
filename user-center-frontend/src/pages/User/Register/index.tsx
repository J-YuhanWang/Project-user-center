import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { SYSTEM_LOGO } from '@/constants';
import { register } from '@/services/demo/user-api';


// 注意：这里以后要换成你真正的后端接口方法
// import { register } from '@/services/ant-design-pro/api';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');


  // 表单提交-注册
  const handleSubmit = async (values: API.RegisterParams) => {
    const { userAccount, userPassword, checkPassword } = values;
    if (userPassword !== checkPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      // 注册
      const id = await register({userAccount, userPassword, checkPassword});

      if (id > 0) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);

        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect ? `/user/login?redirect=${redirect}`: '/user/login');
        return;
      }

      throw new Error(`Register failed: id= ${id}`);

    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
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
              submitText: 'REGISTER',
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
                label: 'Register your account',
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
              <ProFormText.Password
                name="checkPassword" // 对应后端 UserLoginRequest 里的 checkPassword
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'Please check your password'}
                rules={[
                  {
                    required: true,
                    message: 'Check password is required.',
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

        </LoginForm>
      </div>
    </div>
  );
};

export default Register;