import { areaPricingRuleAddApi, areaPricingRuleUpdateApi } from '@/api/area';
import type { AreaPricingRuleAddOrUpdateParams, AreaPricingRuleDto } from '@/api/area/types';
import {
  areaTypeOptions,
  overtimeRoundingOptions,
  roomSizeOptions,
  STATUS,
  timeTypeOptions,
  type AREA_TYPE,
  type OVERTIME_ROUNDING,
  type ROOM_SIZE,
  type TIME_TYPE,
} from '@/api/types';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const getFormSchema = () =>
  z.object({
    areaType: z.string('请选择区域类型').min(1, '区域类型不能为空'),
    roomSize: z.string().optional(),
    timeType: z.string().min(1, '应用时间不能为空'),
    startTimeFrom: z.string().min(1, '应用时间起始不能为空'),
    baseDurationMinutes: z.number().min(1, '使用时长必须大于0'),
    basePrice: z.number().min(0, '起步价格不能为负数'),
    overtimePricePerHour: z.number().min(0, '超时每小时价格不能为负数'),
    overtimeRounding: z.string().min(1, '超时取整方式不能为空'),
    overtimeGraceMinutes: z.number().min(0, '超时宽限分钟不能为负数').optional(),
    giftTeaAmount: z.number().min(0, '赠送茶水金额不能为负数').optional(),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface RuleEditProps {
  data: AreaPricingRuleAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (data?: AreaPricingRuleDto) => void;
}
const RuleEdit = (props: RuleEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      areaType: areaTypeOptions[0].value,
      roomSize: roomSizeOptions[0].value,
      timeType: timeTypeOptions[0].value,
      startTimeFrom: '09:00:00',
      baseDurationMinutes: 60,
      basePrice: 0,
      overtimePricePerHour: 0,
      overtimeRounding: overtimeRoundingOptions[0].value,
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
      areaType: data?.areaType || areaTypeOptions[0].value,
      roomSize: data?.roomSize || roomSizeOptions[0].value,
      timeType: data?.timeType || timeTypeOptions[0].value,
      startTimeFrom: data?.startTimeFrom || '09:00:00',
      baseDurationMinutes: data?.baseDurationMinutes
        ? Number((data.baseDurationMinutes / 60).toFixed(1))
        : 5,
      basePrice: data?.basePrice || 0,
      overtimePricePerHour: data?.overtimePricePerHour || 0,
      overtimeRounding: data?.overtimeRounding || overtimeRoundingOptions[0].value,
      overtimeGraceMinutes: data?.overtimeGraceMinutes || 0,
      giftTeaAmount: data?.giftTeaAmount || 0,
      status: data?.status || STATUS.ENABLE,
      description: data?.description || '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);
      const res = data?.id
        ? await areaPricingRuleUpdateApi({
            id: data.id,
            ...formData,
            baseDurationMinutes: Math.floor(formData.baseDurationMinutes * 60),
            areaType: formData.areaType as AREA_TYPE,
            roomSize: formData.roomSize !== '0' ? (formData.roomSize as ROOM_SIZE) : '',
            timeType: formData.timeType as TIME_TYPE,
            overtimeRounding: formData.overtimeRounding as OVERTIME_ROUNDING,
            status: formData.status as STATUS,
          })
        : await areaPricingRuleAddApi({
            ...formData,
            baseDurationMinutes: Math.floor(formData.baseDurationMinutes * 60),
            areaType: formData.areaType as AREA_TYPE,
            roomSize: formData.roomSize !== '0' ? (formData.roomSize as ROOM_SIZE) : '',
            timeType: formData.timeType as TIME_TYPE,
            overtimeRounding: formData.overtimeRounding as OVERTIME_ROUNDING,
            status: formData.status as STATUS,
          });

      toast.success(data?.id ? '编辑成功' : '新增成功');
      onClose(res.data);
    } catch {
      // do nothing
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.id ? '编辑收费标准' : '新增收费标准'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-rule" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="areaType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-areaType" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      区域类型
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-rule-areaType">
                        <SelectValue placeholder="请选择区域类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaTypeOptions.map(areaType => (
                          <SelectItem key={areaType.value} value={String(areaType.value)}>
                            {areaType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="roomSize"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-roomSize" className="tracking-widest">
                      包间大小
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-rule-roomSize">
                        <SelectValue placeholder="请选择包间大小" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">请选择包间大小</SelectItem>
                        {roomSizeOptions.map(roomSize => (
                          <SelectItem key={roomSize.value} value={String(roomSize.value)}>
                            {roomSize.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="timeType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-timeType" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      应用时间
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-rule-timeType">
                        <SelectValue placeholder="请选择应用时间" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeTypeOptions.map(timeType => (
                          <SelectItem key={timeType.value} value={String(timeType.value)}>
                            {timeType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="startTimeFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-startTimeFrom" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      应用时间起始
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-rule-startTimeFrom"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入应用时间起始"
                      autoComplete="off"
                      step="1"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="baseDurationMinutes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-baseDurationMinutes" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      使用时长(小时)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(Number(Number(e.target.value).toFixed(1)))}
                      type="number"
                      id="form-rule-baseDurationMinutes"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入使用时长(小时)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="basePrice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-basePrice" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      起步价格(元)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      type="number"
                      id="form-rule-basePrice"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入起步价格(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="overtimePricePerHour"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-rule-overtimePricePerHour"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      超时每小时价格(元)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      type="number"
                      id="form-rule-overtimePricePerHour"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入超时每小时价格(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="overtimeRounding"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-overtimeRounding" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      超时取整方式
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-rule-overtimeRounding">
                        <SelectValue placeholder="请选择超时取整方式" />
                      </SelectTrigger>
                      <SelectContent>
                        {overtimeRoundingOptions.map(option => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="overtimeGraceMinutes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-rule-overtimeGraceMinutes"
                      className="tracking-widest"
                    >
                      超时宽限分钟
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      type="number"
                      id="form-rule-overtimeGraceMinutes"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入超时宽限分钟"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="giftTeaAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rule-giftTeaAmount" className="tracking-widest">
                      赠送茶水金额(元)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      type="number"
                      id="form-rule-giftTeaAmount"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入赠送茶水金额(元)"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-status" className="tracking-widest">
                      状态
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={val => field.onChange(Number(val))}
                    >
                      <SelectTrigger id="form-user-status">
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(STATUS.ENABLE)}>启用</SelectItem>
                        <SelectItem value={String(STATUS.DISABLE)}>禁用</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-description" className="tracking-widest">
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-user-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入描述"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button form="form-rule" type="submit" loading={isPending}>
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

export default RuleEdit;
