import request from '@/lib/request';
import type { RequestDto } from '../types';
import type { LoginDto, LoginParams } from './types';

/**
 * 登录接口
 */
export const loginApi = (data: LoginParams): RequestDto<LoginDto> => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
};
