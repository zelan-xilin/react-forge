import type { STATUS } from '@/assets/enum';

export interface MaterialDto {
  id: number;
  name: string;
  recipeUnit: string;
  status?: STATUS;
  description?: string | null;
}

/**
 * 名称 唯一校验接口返回参数
 */
export interface MaterialNameExistsDto {
  exists: boolean;
}

/**
 * 物料 page 请求参数
 */
export interface MaterialPageParams {
  page: number;
  pageSize: number;
  name?: string;
}
