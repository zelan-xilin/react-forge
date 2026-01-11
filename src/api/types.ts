export const STATUS = {
  DISABLE: 0,
  ENABLE: 1,
} as const;
export type STATUS = (typeof STATUS)[keyof typeof STATUS];

export const IS_ADMIN = {
  NO: 0,
  YES: 1,
} as const;
export type IS_ADMIN = (typeof IS_ADMIN)[keyof typeof IS_ADMIN];

export const AREA_TYPE = {
  PRIVATE_ROOM: 'private_room',
  HALL_SEAT: 'hall_seat',
  BALCONY: 'balcony',
} as const;
export type AREA_TYPE = (typeof AREA_TYPE)[keyof typeof AREA_TYPE];
export const areaTypeOptions = [
  { label: 'VIP包间', value: AREA_TYPE.PRIVATE_ROOM },
  { label: '开放式大厅', value: AREA_TYPE.HALL_SEAT },
  { label: '景观阳台专区', value: AREA_TYPE.BALCONY },
];

export const ROOM_SIZE = {
  LARGE: 'large',
  MEDIUM: 'medium',
  SMALL: 'small',
} as const;
export type ROOM_SIZE = (typeof ROOM_SIZE)[keyof typeof ROOM_SIZE];
export const roomSizeOptions = [
  { label: '大型', value: ROOM_SIZE.LARGE },
  { label: '中型', value: ROOM_SIZE.MEDIUM },
  { label: '小型', value: ROOM_SIZE.SMALL },
];

export const TIME_TYPE = {
  DAY: 'day',
  NIGHT: 'night',
} as const;
export type TIME_TYPE = (typeof TIME_TYPE)[keyof typeof TIME_TYPE];
export const timeTypeOptions = [
  { label: '白天', value: TIME_TYPE.DAY },
  { label: '夜晚', value: TIME_TYPE.NIGHT },
];

export const OVERTIME_ROUNDING = {
  CEIL: 'ceil',
  EXACT: 'exact',
} as const;
export type OVERTIME_ROUNDING = (typeof OVERTIME_ROUNDING)[keyof typeof OVERTIME_ROUNDING];
export const overtimeRoundingOptions = [
  { label: '向上取整(按小时收费)', value: OVERTIME_ROUNDING.CEIL },
  { label: '精确计费(按分钟收费)', value: OVERTIME_ROUNDING.EXACT },
];

export type RequestDto<T> = Promise<{
  data: T;
  message: string;
}>;

export type RequestPageDto<T> = Promise<{
  data: {
    records: T;
    total: number;
  };
  message: string;
}>;
