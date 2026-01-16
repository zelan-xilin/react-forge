import type { STATUS } from '@/assets/enum';

export interface RecipeItemDto {
  recipeId?: number;
  materialId: number;
  materialName: string | null;
  amount: number;
  recipeUnit: string | null;
}

/**
 * page list 接口返回数据
 */
export interface RecipeDto {
  id: number;
  name: string;
  status: STATUS;
  description?: string | null;
  createdBy: number;
  createdAt: string;
  updatedBy: number | null;
  updatedAt: string | null;
  creatorName?: string | null;
  updaterName?: string | null;
  children: RecipeItemDto[];
}

/**
 * page 请求参数
 */
export interface RecipePageParams {
  page: number;
  pageSize: number;
  name?: string;
}

export type RecipeAddOrUpdateParams = Omit<
  RecipeDto,
  'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'children'
> & {
  children: Omit<RecipeItemDto, 'recipeId' | 'materialName' | 'recipeUnit'>[];
};

/**
 * name 唯一校验接口返回参数
 */
export interface RecipeNameExistsDto {
  exists: boolean;
}
