export type RequestDto<T> = Promise<{
  data: T;
  message: string;
}>;
