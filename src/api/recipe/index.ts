import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  RecipeAddOrUpdateParams,
  RecipeDto,
  RecipeNameExistsDto,
  RecipePageParams,
} from './types';

/**
 * 配方新增接口
 */
export const recipeAddApi = (data: RecipeAddOrUpdateParams) => {
  return request({
    url: '/recipes',
    method: 'post',
    data,
  });
};

/**
 * 配方更新接口
 */
export const recipeUpdateApi = (
  data: RecipeAddOrUpdateParams & { id: number },
) => {
  return request({
    url: `/recipes/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 配方删除接口
 */
export const recipeDeleteApi = (recipeId: number) => {
  return request({
    url: `/recipes/${recipeId}`,
    method: 'delete',
  });
};

/**
 * 分页查询配方接口
 */
export const recipePageApi = (
  params: RecipePageParams,
): RequestPageDto<RecipeDto[]> => {
  return request({
    url: '/recipes/page',
    method: 'get',
    params,
  });
};

/**
 * 配方list接口
 */
export const recipeListApi = (): RequestDto<RecipeDto[]> => {
  return request({
    url: '/recipes/list',
    method: 'get',
  });
};

/**
 * 配方名称唯一性校验接口
 */
export const recipeNameExistsApi = (
  name: string,
  recipeId?: number,
): RequestDto<RecipeNameExistsDto> => {
  return request({
    url: '/recipes/exists',
    method: 'get',
    params: {
      name,
      recipeId,
    },
  });
};
