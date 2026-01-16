import type { STATUS } from '@/assets/enum';

export interface DictItemDTO {
  id: number;
  parentId: number;
  label: string;
  value: string;
  sort?: number;
  status: STATUS;
  description?: string | null;
}

/**
 * 字典 page list 接口返回数据
 */
export interface DictDto {
  id: number;
  label: string;
  value: string;
  status: STATUS;
  description?: string | null;
  children?: DictItemDTO[];
}

/**
 * 字典 page 请求参数
 */
export interface DictPageParams {
  page: number;
  pageSize: number;
  label?: string;
}

/**
 * label、value 唯一校验接口返回参数
 */
export interface DictNameExistsDto {
  labelExists: boolean;
  valueExists: boolean;
}
