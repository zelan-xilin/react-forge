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

export const ORDER_STATUS = {
  OPEN: 'open',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;
export type ORDER_STATUS = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export const orderStatusOptions = [
  { label: '消费中', value: ORDER_STATUS.OPEN },
  { label: '已结账', value: ORDER_STATUS.PAID },
  { label: '已作废', value: ORDER_STATUS.CANCELLED },
];

export const MUST_HAVE_DICT = {
  AREA_TYPE: 'area_type',
  ROOM_SIZE: 'room_size',
  RULE_APPLICATION_TYPE: 'rule_application_type',
  RECIPE_UNIT: 'recipe_unit',
  PAYMENT_METHOD: 'payment_method',
  PAYMENT_PRICE_MODIFY_REASON: 'payment_price_modify_reason',
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
    value: MUST_HAVE_DICT.RECIPE_UNIT,
    description: '子项如：包、克、一勺',
  },
  {
    label: '支付方式',
    value: MUST_HAVE_DICT.PAYMENT_METHOD,
    description: '子项如：现金、微信、支付宝、会员卡',
  },
  {
    label: '支付价格修改原因',
    value: MUST_HAVE_DICT.PAYMENT_PRICE_MODIFY_REASON,
    description: '子项如：优惠、加价、其他',
  },
];
