import { areaAddApi, areaNameExistsApi, areaUpdateApi } from '@/api/area';
import type { AreaDto } from '@/api/area/types';
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

const getFormSchema = (areaId?: number) =>
  z.object({
    name: z
      .string()
      .min(1, '区域名称不能为空')
      .max(50, '区域名称不能超过50个字符')
      .refine(
        async name => {
          const res = await areaNameExistsApi(name, areaId);
          return !res.data.exists;
        },
        { message: '区域名称已存在' },
      ),
    areaType: z.string(),
    roomSize: z.string().optional(),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface AreaEditProps {
  data: AreaDto | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const AreaEdit = (props: AreaEditProps) => {
  const { data, open, onClose } = props;
  const { dict } = useDict();

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      name: '',
      areaType: '',
      roomSize: '',
      status: STATUS.ENABLE,
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: data?.name ?? '',
      areaType: data?.areaType ?? '',
      roomSize: data?.roomSize ?? '0',
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);

      if (data?.id) {
        await areaUpdateApi({
          id: data.id,
          ...formData,
          roomSize: formData.roomSize === '0' ? null : formData.roomSize,
          status: formData.status as STATUS | undefined,
          description: formData.description || null,
        });
      } else {
        await areaAddApi({
          ...formData,
          roomSize: formData.roomSize === '0' ? null : formData.roomSize,
          status: formData.status as STATUS | undefined,
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
          <SheetTitle>{data?.id ? '编辑区域' : '新增区域'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-area" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-name"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      区域名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-area-name"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入区域名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="areaType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-areaType"
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
                      <SelectTrigger id="form-area-areaType">
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
                      htmlFor="form-area-roomSize"
                      className="tracking-widest"
                    >
                      包间大小
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val => field.onChange(val)}
                    >
                      <SelectTrigger id="form-area-roomSize">
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
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-area-status"
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
                      <SelectTrigger id="form-area-status">
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
                      htmlFor="form-area-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-area-description"
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
          <Button form="form-area" type="submit" loading={isPending}>
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

export default AreaEdit;
