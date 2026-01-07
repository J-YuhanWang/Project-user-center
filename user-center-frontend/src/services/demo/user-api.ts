import { request } from '@umijs/max';

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<any>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  // 注意：这里 URL 写 '/user/current'，request 会自动拼上 /api
  return request<API.BaseResponse<API.CurrentUser>>('/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}
