import type { STATUS } from '@/assets/enum';

export interface AreaDto {
  id: number;
  name: string;
  areaType: string;
  roomSize?: string | null;
  status?: STATUS;
  description?: string | null;
}

/**
 * 名称 唯一校验接口返回参数
 */
export interface AreaNameExistsDto {
  exists: boolean;
}

/**
 * 字典 page 请求参数
 */
export interface AreaPageParams {
  page: number;
  pageSize: number;
  name?: string;
}
