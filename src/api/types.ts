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
