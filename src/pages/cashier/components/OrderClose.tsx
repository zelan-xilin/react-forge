import type { AreaDto } from '@/api/area/types';
import {
  addOrderPaymentApi,
  setOrderAreaApi,
  updateOrderApi,
} from '@/api/cashier';
import type { OrderDto } from '@/api/cashier/types';
import { ORDER_STATUS, STATUS } from '@/assets/enum';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDict } from '@/hooks/useDict';
import type { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  paymentDifferenceReason: z.string().max(200, '备注不能超过200字').optional(),
  payments: z
    .array(
      z.object({
        paymentMethod: z.string().min(1, '请选择支付方式'),
        paymentAmount: z.number().min(0, '支付金额不能小于0'),
      }),
    )
    .min(1, '请至少添加一种支付方式')
    .superRefine((children, ctx) => {
      const seen = new Map<string, number>();

      children.forEach((row, index) => {
        const id = row.paymentMethod;
        if (!id) return;

        const firstIndex = seen.get(id);
        if (firstIndex === undefined) {
          seen.set(id, index);
          return;
        }

        ctx.addIssue({
          code: 'custom',
          message: '支付方式不能重复',
          path: [index, 'paymentMethod'],
        });

        ctx.addIssue({
          code: 'custom',
          message: '支付方式不能重复',
          path: [firstIndex, 'paymentMethod'],
        });
      });
    }),
});
type FormSchema = z.infer<typeof formSchema>;

export interface OrderCloseProps {
  open: boolean;
  onClose: (req?: boolean) => void;
  area: AreaDto;
  total: number;
  order: OrderDto | undefined;
}
const OrderClose = (props: OrderCloseProps) => {
  const { open, onClose, area, total, order } = props;
  const user = useSelector((state: RootState) => state.user);
  const { dict } = useDict();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentDifferenceReason: '',
      payments: [],
    },
  });
  const {
    fields: paymentFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'payments',
  });
  const payments = useWatch({
    control: form.control,
    name: 'payments',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      paymentDifferenceReason: '',
      payments: [
        {
          paymentMethod: dict.payment_method?.[0]?.value || '',
          paymentAmount: Number(total.toFixed(1)),
        },
      ],
    });
  }, [open, total, form, dict.payment_method]);
  const onSubmit = async (formData: FormSchema) => {
    if (!order) {
      return;
    }

    const actualAmount = formData.payments.reduce((sum, p) => {
      return sum + (p.paymentAmount || 0);
    }, 0);
    await updateOrderApi({
      orderNo: order.orderNo,
      orderStatus: ORDER_STATUS.PAID,
      closedAt: new Date().toISOString(),
      expectedAmount: Number(total.toFixed(1)),
      actualAmount: Number(actualAmount.toFixed(1)),
      paymentDifferenceReason: formData.paymentDifferenceReason,
      updatedBy: user.id!,
      updatedByName: user.username!,
    });

    setOrderAreaApi({
      orderNo: order.orderNo,
      areaId: area.id,
      areaName: area.name,
      areaType:
        dict.area_type?.find(d => d.value === area.areaType)?.label || '',
      roomSize:
        dict.room_size?.find(d => d.value === area.roomSize)?.label || '',
    });

    formData.payments.forEach(p => {
      if (!p.paymentAmount || !p.paymentMethod) {
        return;
      }

      addOrderPaymentApi({
        orderNo: order.orderNo,
        paymentMethod: p.paymentMethod,
        paymentMethodName:
          dict.payment_method?.find(d => d.value === p.paymentMethod)?.label ||
          '',
        paymentAmount: p.paymentAmount,
      });
    });

    toast.success('订单结账成功');
    onClose(true);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{area?.name}&nbsp;·&nbsp;结账</AlertDialogTitle>
          <AlertDialogDescription>
            请确认以下信息无误后提交，结账后将无法修改订单内容。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[calc(100vh-400px)]">
          <FieldLabel className="tracking-widest pl-3 mb-1">
            理论收费:&nbsp;{total.toFixed(1)} 元
          </FieldLabel>
          <FieldLabel className="tracking-widest pl-3 mb-1">
            当前已填写金额:&nbsp;
            {payments
              ?.reduce((sum, p) => sum + (p.paymentAmount || 0), 0)
              .toFixed(1)}{' '}
            元
          </FieldLabel>

          <form
            id="form-payment"
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-1 pb-1"
          >
            <FieldGroup>
              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_120px_32px] items-center gap-2">
                  <FieldLabel className="tracking-widest pl-3">
                    支付方式
                  </FieldLabel>
                  <FieldLabel className="tracking-widest pl-3">金额</FieldLabel>
                </div>

                {paymentFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_120px_32px] items-center gap-2"
                  >
                    <Controller
                      name={`payments.${index}.paymentMethod`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Select
                            value={field.value}
                            onValueChange={val =>
                              val === 'empty' ? null : field.onChange(val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="请选择支付方式" />
                            </SelectTrigger>
                            <SelectContent>
                              {dict.payment_method?.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                  disabled={option.status !== STATUS.ENABLE}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                              {!dict.payment_method?.length && (
                                <SelectItem value="empty">
                                  暂无可用选项，请前往字典管理添加
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />

                    <Controller
                      name={`payments.${index}.paymentAmount`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <InputGroup>
                            <InputGroupAddon>¥</InputGroupAddon>
                            <InputGroupInput
                              {...field}
                              onChange={e => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(Number(value));
                              }}
                            />
                          </InputGroup>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />

                    <Button
                      type="button"
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    append({
                      paymentMethod: '',
                      paymentAmount: 0,
                    })
                  }
                >
                  新增支付方式
                </Button>
              </div>

              <Controller
                name="paymentDifferenceReason"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-description"
                      className="tracking-widest"
                    >
                      实际收取金额与理论收费差异原因
                    </FieldLabel>

                    <div className='flex gap-x-2 gap-y-0.5 items-center flex-wrap'>
                      <span className='text-xs'>快捷原因选择:&nbsp;</span>
                      {dict.payment_price_modify_reason?.map(it => (
                        <Button
                          key={it.value}
                          size="sm"
                          variant="secondary"
                          type="button"
                          onClick={() => field.onChange(it.label)}
                        >
                          {it.label}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      {...field}
                      id="form-dict-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入差异原因"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>取消</AlertDialogCancel>
          <AlertDialogAction form="form-payment" type="submit">
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderClose;
