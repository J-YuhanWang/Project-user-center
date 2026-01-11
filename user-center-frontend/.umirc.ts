import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'Login',
          path: '/user/login',
          component: './User/Login',
        },
        {
          name: 'Register',
          path: '/user/register',
          component: './User/Register',
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: 'Home',
      path: '/home',
      component: './Home',
    },
    {
      path: '/admin',
      name:'Administration',
      icon:'crown',
      access:'canAdmin',
      routes: [
        {
          name: 'User manage',
          path: '/admin/user-manage',
          component: './Admin/UserManage',
        },
      ],
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  npmClient: 'yarn',
});

