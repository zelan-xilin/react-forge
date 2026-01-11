import type { AREA_TYPE, OVERTIME_ROUNDING, ROOM_SIZE, STATUS, TIME_TYPE } from '../types';

/**
 * 区域收费规则 list 接口返回数据
 */
export interface AreaPricingRuleDto {
  id: number;
  areaType: AREA_TYPE;
  roomSize: ROOM_SIZE | '';
  timeType: TIME_TYPE;
  startTimeFrom: string;
  baseDurationMinutes: number;
  basePrice: number;
  overtimePricePerHour: number;
  overtimeRounding: OVERTIME_ROUNDING;
  overtimeGraceMinutes: number;
  giftTeaAmount: number;
  status: STATUS;
  description?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

/**
 * 区域收费规则新增/编辑请求参数
 */
export interface AreaPricingRuleAddOrUpdateParams {
  id?: number;
  areaType: AREA_TYPE;
  roomSize?: ROOM_SIZE | '';
  timeType: TIME_TYPE;
  startTimeFrom: string;
  baseDurationMinutes: number;
  basePrice: number;
  overtimePricePerHour: number;
  overtimeRounding: OVERTIME_ROUNDING;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status: STATUS;
  description?: string;
}

/**
 * 区域资源 list 接口返回数据
 */
export interface AreaResourceDto {
  id: number;
  name: string;
  areaType: AREA_TYPE;
  roomSize: ROOM_SIZE | '';
  capacity: number;
  status: STATUS;
  description?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

/**
 * 区域资源名称唯一性校验接口返回数据
 */
export interface AreaResourceNameExistsDto {
  exists: boolean;
}

/**
 * 区域资源新增/编辑请求参数
 */
export interface AreaResourceAddOrUpdateParams {
  id?: number;
  name: string;
  areaType: AREA_TYPE;
  roomSize?: ROOM_SIZE | '';
  capacity?: number;
  status: STATUS;
  description?: string;
}
