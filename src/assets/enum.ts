export const STATUS = {
  DISABLE: 0,
  ENABLE: 1,
} as const;
export type STATUS = (typeof STATUS)[keyof typeof STATUS];
export const statusOptions = [
  { label: '启用', value: STATUS.ENABLE },
  { label: '禁用', value: STATUS.DISABLE },
];

export const IS_ADMIN = {
  NO: 0,
  YES: 1,
} as const;
export type IS_ADMIN = (typeof IS_ADMIN)[keyof typeof IS_ADMIN];
export const isAdminOptions = [
  { label: '否', value: IS_ADMIN.NO },
  { label: '是', value: IS_ADMIN.YES },
];

export const OVERTIME_ROUNDING = {
  CEIL: 'ceil',
  EXACT: 'exact',
} as const;
export type OVERTIME_ROUNDING =
  (typeof OVERTIME_ROUNDING)[keyof typeof OVERTIME_ROUNDING];
export const overtimeRoundingOptions = [
  { label: '向上取整(按小时收费)', value: OVERTIME_ROUNDING.CEIL },
  { label: '精确计费(按分钟收费)', value: OVERTIME_ROUNDING.EXACT },
];

export const CHARGE_TYPE = {
  AREA: 'area',
  PRODUCT: 'product',
} as const;
export type CHARGE_TYPE = (typeof CHARGE_TYPE)[keyof typeof CHARGE_TYPE];
export const chargeTypeOptions = [
  { label: '区域定价', value: CHARGE_TYPE.AREA },
  { label: '商品定价', value: CHARGE_TYPE.PRODUCT },
];

export const MUST_HAVE_DICT = {
  AREA_TYPE: 'area_type',
  ROOM_SIZE: 'room_size',
  RULE_APPLICATION_TYPE: 'rule_application_type',
} as const;
export type MUST_HAVE_DICT =
  (typeof MUST_HAVE_DICT)[keyof typeof MUST_HAVE_DICT];
export const mustHaveDictOptions = [
  {
    label: '区域类型',
    value: MUST_HAVE_DICT.AREA_TYPE,
    description: '子项如：包间、开放式大厅、景观阳台专区',
  },
  {
    label: '房间大小',
    value: MUST_HAVE_DICT.ROOM_SIZE,
    description: '子项如：小型、中型、大型',
  },
  {
    label: '收费规则应用类型',
    value: MUST_HAVE_DICT.RULE_APPLICATION_TYPE,
    description: '子项如：白天、夜晚、九折优惠',
  },
  {
    label: '配方单位',
    value: 'recipe_unit',
    description: '子项如：包、克、一勺',
  },
];
