import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { SYSTEM_LOGO } from '@/constants';
import { register } from '@/services/demo/user-api';


// Note: Replace with your actual backend interface in the future
// import { register } from '@/services/ant-design-pro/api';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');


  // Form Submission - Register
  const handleSubmit = async (values: API.RegisterParams) => {
    const { userPassword, checkPassword } = values;
    if (userPassword !== checkPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      // Register
      const res = await register(values);

      if (res.code === 0 && res.data > 0) {
        const defaultLoginSuccessMessage = 'Registration successful!';
        message.success(defaultLoginSuccessMessage);

        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        history.push(redirect ? `/user/login?redirect=${redirect}` : '/user/login');
        return;
      }

      // throw new Error(res.description);

    } catch (error) {
      const defaultLoginFailureMessage = 'Registration failed, please try again!';
      message.error(defaultLoginFailureMessage);
    }
  };

  const pageStyle = {
    backgroundColor: 'white',
    height: '100vh',
  };

  const formContainerStyle = {
    margin: '100px auto',
    width: '400px',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
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
              <ProFormText.Password
                name="checkPassword" // Maps to backend UserLoginRequest: checkPassword
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