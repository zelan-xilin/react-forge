import {
  productPricingAddApi,
  productPricingUpdateApi,
} from '@/api/pricing/product';
import type { ProductPricingDto } from '@/api/pricing/product-types';
import { recipeListApi } from '@/api/recipe';
import type { RecipeDto } from '@/api/recipe/types';
import { STATUS, statusOptions } from '@/assets/enum';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useDict } from '@/hooks/useDict';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const getFormSchema = () =>
  z.object({
    productId: z.number('商品不能为空'),
    price: z.number().min(0, '售价不能为空'),
    ruleApplicationType: z.string('收费规则应用类型不能为空').optional(),
    applyTimeStart: z.string('收费规则应用起始时间不能为空').optional(),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface ProductPricingEditProps {
  data: ProductPricingDto | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const ProductPricingEdit = (props: ProductPricingEditProps) => {
  const { data, open, onClose } = props;
  const { dict } = useDict();

  const [productList, setProductList] = useState<RecipeDto[]>([]);
  useEffect(() => {
    if (!open) {
      return;
    }

    recipeListApi().then(res => {
      setProductList(res.data);
    });
  }, [open]);

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      productId: 0,
      price: 0,
      ruleApplicationType: '',
      applyTimeStart: '09:00:00',
      status: STATUS.ENABLE,
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      productId: data?.productId ?? 0,
      price: data?.price ?? 0,
      ruleApplicationType: data?.ruleApplicationType ?? '0',
      applyTimeStart: data?.applyTimeStart ?? '09:00:00',
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);

      if (data?.id) {
        await productPricingUpdateApi({
          id: data.id,
          ...formData,
          ruleApplicationType:
            formData.ruleApplicationType === '0'
              ? null
              : formData.ruleApplicationType || null,
          applyTimeStart: formData.applyTimeStart || null,
          status: formData.status as STATUS,
          description: formData.description || null,
        });
      } else {
        await productPricingAddApi({
          ...formData,
          ruleApplicationType:
            formData.ruleApplicationType === '0'
              ? null
              : formData.ruleApplicationType || null,
          applyTimeStart: formData.applyTimeStart || null,
          status: formData.status as STATUS,
          description: formData.description,
        });
      }

      toast.success(data?.id ? '编辑成功' : '新增成功');
      onClose(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.id ? '编辑商品定价' : '新增商品定价'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form
            id="form-product-pricing"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="productId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-productId"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      商品
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={val =>
                        val === 'empty' ? null : field.onChange(Number(val))
                      }
                    >
                      <SelectTrigger id="form-product-pricing-productId">
                        <SelectValue placeholder="请选择商品" />
                      </SelectTrigger>
                      <SelectContent>
                        {productList.map(it => (
                          <SelectItem
                            key={it.id}
                            value={String(it.id)}
                            disabled={it.status !== STATUS.ENABLE}
                          >
                            {it.name}
                          </SelectItem>
                        ))}
                        {!productList.length && (
                          <SelectItem value="empty">
                            暂无可用选项，请前往配方管理添加
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-price"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      售价(元)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e =>
                        field.onChange(
                          Number(Number(e.target.value).toFixed(1)),
                        )
                      }
                      type="number"
                      id="form-product-pricing-price"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入售价(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="ruleApplicationType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-ruleApplicationType"
                      className="tracking-widest"
                    >
                      收费规则应用类型
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val => field.onChange(val)}
                    >
                      <SelectTrigger id="form-product-pricing-ruleApplicationType">
                        <SelectValue placeholder="请选择收费规则应用类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">暂无收费规则应用类型</SelectItem>
                        {dict.rule_application_type?.map(it => (
                          <SelectItem
                            key={it.value}
                            value={String(it.value)}
                            disabled={it.status !== STATUS.ENABLE}
                          >
                            {it.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="applyTimeStart"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-applyTimeStart"
                      className="tracking-widest"
                    >
                      收费规则应用起始时间
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-product-pricing-applyTimeStart"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入收费规则应用起始时间"
                      autoComplete="off"
                      step="1"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-status"
                      className="tracking-widest"
                    >
                      状态
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={val =>
                        val === 'empty' ? null : field.onChange(Number(val))
                      }
                    >
                      <SelectTrigger id="form-product-pricing-status">
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                        {!statusOptions.length && (
                          <SelectItem value="empty">暂无可用选项</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-product-pricing-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-product-pricing-description"
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
        </SheetBody>

        <SheetFooter>
          <Button form="form-product-pricing" type="submit" loading={isPending}>
            保存更改
          </Button>
          <SheetClose asChild>
            <Button variant="outline">关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductPricingEdit;
