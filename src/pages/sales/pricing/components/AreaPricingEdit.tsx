import { areaPricingAddApi, areaPricingUpdateApi } from '@/api/pricing/area';
import type { AreaPricingDto } from '@/api/pricing/area-types';
import { overtimeRoundingOptions, STATUS, statusOptions } from '@/assets/enum';
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
    areaType: z.string('区域类型不能为空'),
    roomSize: z.string().optional(),
    ruleApplicationType: z.string('收费规则应用类型不能为空'),
    applyTimeStart: z.string('收费规则应用起始时间不能为空'),
    usageDurationHours: z.number().min(0, '使用时长不能为空'),
    basePrice: z.number().min(0, '基础收费不能为空'),
    overtimeHourPrice: z.number().min(0, '超时每小时收费不能为空'),
    overtimeRoundType: z.string('超时取整类型不能为空'),
    overtimeGraceMinutes: z.number().min(0, '超时宽限分钟不能为空'),
    giftTeaAmount: z.number().min(0, '赠送茶水金额不能为空'),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface AreaPricingEditProps {
  data: AreaPricingDto | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const AreaPricingEdit = (props: AreaPricingEditProps) => {
  const { data, open, onClose } = props;
  const { dict } = useDict();

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      areaType: dict.area_type?.[0]?.value ?? '',
      roomSize: dict.room_size?.[0]?.value ?? '',
      ruleApplicationType: dict.rule_application_type?.[0]?.value ?? '',
      applyTimeStart: '09:00:00',
      usageDurationHours: 5,
      basePrice: 0,
      overtimeHourPrice: 0,
      overtimeRoundType: overtimeRoundingOptions[0].value,
      overtimeGraceMinutes: 0,
      giftTeaAmount: 0,
      status: STATUS.ENABLE,
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      areaType: data?.areaType ?? dict.area_type?.[0]?.value ?? '',
      roomSize: (data?.id ? data.roomSize : dict.room_size?.[0]?.value) ?? '0',
      ruleApplicationType:
        data?.ruleApplicationType ??
        dict.rule_application_type?.[0]?.value ??
        '',
      applyTimeStart: data?.applyTimeStart ?? '09:00:00',
      usageDurationHours: data?.usageDurationHours ?? 5,
      basePrice: data?.basePrice ?? 0,
      overtimeHourPrice: data?.overtimeHourPrice ?? 0,
      overtimeRoundType:
        data?.overtimeRoundType ?? overtimeRoundingOptions[0].value,
      overtimeGraceMinutes: data?.overtimeGraceMinutes ?? 0,
      giftTeaAmount: data?.giftTeaAmount ?? 0,
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form, dict]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);

      if (data?.id) {
        await areaPricingUpdateApi({
          id: data.id,
          ...formData,
          roomSize: formData.roomSize === '0' ? null : formData.roomSize,
          status: formData.status as STATUS,
          description: formData.description || null,
        });
      } else {
        await areaPricingAddApi({
          ...formData,
          roomSize: formData.roomSize === '0' ? null : formData.roomSize,
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
          <SheetTitle>{data?.id ? '编辑区域定价' : '新增区域定价'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-area-pricing" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="areaType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-areaType"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      区域类型
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val =>
                        val === 'empty' ? null : field.onChange(val)
                      }
                    >
                      <SelectTrigger id="form-area-pricing-areaType">
                        <SelectValue placeholder="请选择区域类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {dict.area_type?.map(it => (
                          <SelectItem
                            key={it.value}
                            value={String(it.value)}
                            disabled={it.status !== STATUS.ENABLE}
                          >
                            {it.label}
                          </SelectItem>
                        ))}
                        {!dict.area_type?.length && (
                          <SelectItem value="empty">
                            暂无可用选项，请前往字典管理添加
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
                name="roomSize"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-roomSize"
                      className="tracking-widest"
                    >
                      包间大小
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val => field.onChange(val)}
                    >
                      <SelectTrigger id="form-area-pricing-roomSize">
                        <SelectValue placeholder="请选择包间大小" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">暂无包间大小</SelectItem>
                        {dict.room_size?.map(it => (
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
                name="ruleApplicationType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-ruleApplicationType"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      收费规则应用类型
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val => field.onChange(val)}
                    >
                      <SelectTrigger id="form-area-pricing-ruleApplicationType">
                        <SelectValue placeholder="请选择收费规则应用类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {dict.rule_application_type?.map(it => (
                          <SelectItem
                            key={it.value}
                            value={String(it.value)}
                            disabled={it.status !== STATUS.ENABLE}
                          >
                            {it.label}
                          </SelectItem>
                        ))}
                        {!dict.rule_application_type?.length && (
                          <SelectItem value="empty">
                            暂无可用选项，请前往字典管理添加
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
                name="applyTimeStart"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-applyTimeStart"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      收费规则应用起始时间
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-area-pricing-applyTimeStart"
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
                name="usageDurationHours"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-usageDurationHours"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      使用时长(小时)
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
                      id="form-area-pricing-usageDurationHours"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入使用时长(小时)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="basePrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-basePrice"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      基础收费(元)
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
                      id="form-area-pricing-basePrice"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入基础收费(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="overtimeHourPrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-overtimeHourPrice"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      超时每小时收费(元)
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
                      id="form-area-pricing-overtimeHourPrice"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入超时每小时收费(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="overtimeRoundType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-overtimeRoundType"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      超时取整类型
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val =>
                        val === 'empty' ? null : field.onChange(val)
                      }
                    >
                      <SelectTrigger id="form-area-pricing-overtimeRoundType">
                        <SelectValue placeholder="请选择超时取整类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {overtimeRoundingOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                        {!overtimeRoundingOptions.length && (
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
                name="overtimeGraceMinutes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-overtimeGraceMinutes"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      超时宽限分钟数(分钟)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      type="number"
                      id="form-area-pricing-overtimeGraceMinutes"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入超时宽限分钟数(分钟)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="giftTeaAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-pricing-giftTeaAmount"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      赠送茶水金额(元)
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
                      id="form-area-pricing-giftTeaAmount"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入赠送茶水金额(元)"
                      autoComplete="off"
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
                      htmlFor="form-area-pricing-status"
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
                      <SelectTrigger id="form-area-pricing-status">
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
                      htmlFor="form-area-pricing-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-area-pricing-description"
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
          <Button form="form-area-pricing" type="submit" loading={isPending}>
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

export default AreaPricingEdit;
