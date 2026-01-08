import request from '@/lib/request';
import type { RequestDto } from '../types';
import type { LoginDto, LoginParams } from './types';

/**
 * 登录接口
 */
export const loginApi = (params: LoginParams): RequestDto<LoginDto> => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  });
};
