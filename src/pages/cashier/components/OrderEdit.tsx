import type { AreaDto } from '@/api/area/types';
import {
  addOrderProductApi,
  createOrderApi,
  deleteOrderItemApi,
  setOrderAreaApi,
  setOrderReservedApi,
  updateOrderApi,
} from '@/api/cashier';
import type { OrderDto, OrderProductDto } from '@/api/cashier/types';
import { productPricingListApi } from '@/api/pricing/product';
import type { ProductPricingDto } from '@/api/pricing/product-types';
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
import { ButtonGroup } from '@/components/ui/button-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, MinusIcon, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as z from 'zod';

const formSchema = z.object({
  remark: z.string().max(200, '备注不能超过200字').optional(),
  username: z.string().optional(),
  contact: z.string().optional(),
  arriveAt: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().min(0, '数量不能小于0'),
      }),
    )
    .superRefine((children, ctx) => {
      const seen = new Map<number, number>();

      children.forEach((row, index) => {
        const id = row.productId;
        if (!id) return;

        const firstIndex = seen.get(id);
        if (firstIndex === undefined) {
          seen.set(id, index);
          return;
        }

        ctx.addIssue({
          code: 'custom',
          message: '商品不能重复',
          path: [index, 'productId'],
        });

        ctx.addIssue({
          code: 'custom',
          message: '商品不能重复',
          path: [firstIndex, 'productId'],
        });
      });
    }),
});
type FormSchema = z.infer<typeof formSchema>;

interface OrderProductItemProps {
  productPricing: ProductPricingDto[];
  productPricingMap: Map<number, ProductPricingDto>;
  index: number;
  remove: (index: number) => void;
  form: ReturnType<typeof useForm<FormSchema>>;
}
const OrderProductItem = (props: OrderProductItemProps) => {
  const { productPricingMap, productPricing, index, remove, form } = props;

  const productId = useWatch({
    control: form.control,
    name: `products.${index}.productId`,
  });
  const quantity =
    useWatch({
      control: form.control,
      name: `products.${index}.quantity`,
    }) ?? 0;

  const price = productPricingMap.get(productId)?.price ?? 0;
  const total = price * quantity;

  return (
    <div className="grid grid-cols-[1fr_120px_50px_32px] items-center gap-2">
      <Controller
        name={`products.${index}.productId`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select
              value={String(field.value)}
              onValueChange={val =>
                val === 'empty' ? null : field.onChange(Number(val))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择商品" />
              </SelectTrigger>
              <SelectContent>
                {productPricing.map(option => (
                  <SelectItem
                    key={option.id}
                    value={String(option.productId)}
                    disabled={option.status !== STATUS.ENABLE}
                  >
                    {option.productName}
                  </SelectItem>
                ))}
                {!productPricing.length && (
                  <SelectItem value="empty">
                    暂无可用选项，请前往收费规则添加
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name={`products.${index}.quantity`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <ButtonGroup aria-label="数量调整">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  field.onChange(Math.max((field.value || 0) - 1, 0));
                }}
              >
                <MinusIcon />
              </Button>
              <Input
                {...field}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(Number(value));
                }}
                placeholder="数量"
              />
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  field.onChange(Math.max((field.value || 0) + 1, 0));
                }}
              >
                <PlusIcon />
              </Button>
            </ButtonGroup>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div>¥&nbsp;{total}</div>

      <Button
        type="button"
        size="icon-sm"
        variant="destructive"
        onClick={() => remove(index)}
      >
        ✕
      </Button>
    </div>
  );
};

interface OrderEditProps {
  open: boolean;
  type: 'edit' | 'reserved';
  area: AreaDto;
  idleAreas: AreaDto[];
  order: OrderDto | undefined;
  onClose: (req?: boolean) => void;
}
const OrderEdit = (props: OrderEditProps) => {
  const { open, type, area, idleAreas, order, onClose } = props;
  const user = useSelector((state: RootState) => state.user);

  const [productPricing, setProductPricing] = useState<ProductPricingDto[]>([]);
  const productPricingMap = useMemo(() => {
    const map = new Map<number, ProductPricingDto>();
    productPricing.forEach(item => {
      map.set(item.productId, item);
    });
    return map;
  }, [productPricing]);
  useEffect(() => {
    if (!open) {
      return;
    }

    productPricingListApi().then(res => {
      setProductPricing(res.data);
    });
  }, [open]);

  const [afterArea, setAfterArea] = useState<AreaDto | null>(null);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      contact: '',
      arriveAt: '02:00:00',
      remark: '',
      products: [],
    },
  });
  const {
    fields: productFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'products',
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    Promise.resolve().then(() => setAfterArea(null));

    const products = order?.products || [];
    if (products.length === 0) {
      products.push({
        productId: 0,
        quantity: 1,
      } as OrderProductDto);
    }
    form.reset({
      remark: order?.remark || '',
      username: order?.reserved?.username ?? '',
      contact: order?.reserved?.contact ?? '',
      arriveAt: order?.reserved?.arriveAt ?? '02:00:00',
      products,
    });
  }, [open, order, form]);

  const onSubmit = async (formData: FormSchema) => {
    const validProducts = formData.products.filter(
      item => item.productId && item.quantity,
    );

    /**
     * 创建、更新订单
     */
    const addRes = order
      ? { data: order }
      : await createOrderApi({
        orderStatus:
          type === 'reserved'
            ? ORDER_STATUS.RESERVED
            : ORDER_STATUS.IN_PROGRESS,
        openedAt: type === 'reserved' ? undefined : new Date().toISOString(),
        remark: formData.remark,
        createdBy: user.id!,
        createdByName: user.username!,
      });
    if (order) {
      await updateOrderApi({
        orderNo: order.orderNo,
        orderStatus: order.orderStatus,
        openedAt: order.openedAt,
        remark: formData.remark,
        updatedBy: user.id!,
        updatedByName: user.username!,
      });
    }

    /**
     * 设置订单区域、商品信息
     */
    await Promise.all([
      setOrderAreaApi({
        orderNo: addRes.data.orderNo,
        areaId: afterArea?.id || area.id,
        areaName: afterArea?.name || area.name,
        areaType: afterArea?.areaType || area.areaType,
        roomSize: afterArea?.roomSize || area.roomSize,
      }),
      ...(order?.products?.length
        ? [
          deleteOrderItemApi({
            type: 'product',
            ids: order.products.map(p => p.id).filter(id => id),
          }),
        ]
        : []),
      ...validProducts.map(vp =>
        addOrderProductApi({
          orderNo: addRes.data.orderNo,
          productId: vp.productId,
          productName: productPricingMap.get(vp.productId)?.productName || '',
          quantity: vp.quantity,
          unitPrice: productPricingMap.get(vp.productId)?.price || 0,
        }),
      ),
      ...(type === 'reserved'
        ? [
          setOrderReservedApi({
            orderNo: addRes.data.orderNo,
            username: formData.username || null,
            contact: formData.contact || null,
            arriveAt: formData.arriveAt || null,
          }),
        ]
        : []),
    ]);

    onClose(true);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-4'>
            {area.name}&nbsp;·&nbsp;{type === 'reserved' ? '预定' : '点单'}

            <ArrowRight className='size-4' />

            <DropdownMenu>
              <DropdownMenuTrigger>
                {afterArea?.name || '更换区域'}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>更换区域</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {idleAreas.length === 0 && (
                  <DropdownMenuItem>暂无可用区域</DropdownMenuItem>
                )}
                {idleAreas.map(idleArea => (
                  <DropdownMenuItem
                    key={idleArea.id}
                    onClick={async () => setAfterArea(area.id === idleArea.id ? null : idleArea)}
                  >
                    {idleArea.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {!order &&
              type === 'edit' &&
              '为该区域创建订单，确定后将自动进入“消费中”状态，并立即开始计时收费。'}
            {!order &&
              type === 'reserved' &&
              '为该区域填写预定人信息以及预备商品。'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[calc(100vh-400px)]">
          <form id="form-order" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {type === 'reserved' && (
                <div className="rounded-lg border bg-card p-4 gap-2 grid grid-cols-2">
                  <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="form-order-username"
                          className="tracking-widest"
                        >
                          预定人
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-order-username"
                          aria-invalid={fieldState.invalid}
                          placeholder="请输入预定人姓名"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="contact"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="form-order-contact"
                          className="tracking-widest"
                        >
                          联系方式
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-order-contact"
                          aria-invalid={fieldState.invalid}
                          placeholder="请输入联系方式"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="arriveAt"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="form-order-arriveAt"
                          className="tracking-widest"
                        >
                          到达时间
                        </FieldLabel>
                        <Input
                          {...field}
                          type="time"
                          id="form-order-arriveAt"
                          aria-invalid={fieldState.invalid}
                          placeholder="请输入到达时间"
                          autoComplete="off"
                          step="1"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}

              <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_120px_50px_32px] items-center gap-2">
                  <FieldLabel className="tracking-widest pl-3">商品</FieldLabel>
                  <FieldLabel className="tracking-widest pl-3">数量</FieldLabel>
                </div>
                {productFields.map((item, index) => {
                  return (
                    <OrderProductItem
                      key={item.id}
                      index={index}
                      productPricing={productPricing}
                      productPricingMap={productPricingMap}
                      remove={remove}
                      form={form}
                    />
                  );
                })}

                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    append({
                      productId: 0,
                      quantity: 1,
                    })
                  }
                >
                  新增商品
                </Button>
              </div>

              <Controller
                name="remark"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-order-remark"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-order-remark"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入描述"
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
          <AlertDialogAction form="form-order" type="submit">
            {type === 'reserved' ? '预定' : '确定'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderEdit;
