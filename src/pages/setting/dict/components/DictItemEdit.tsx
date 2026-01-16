import {
  dictItemAddApi,
  dictItemNameExistsApi,
  dictItemUpdateApi,
} from '@/api/dict';
import type { DictItemDTO } from '@/api/dict/types';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const getFormSchema = (parentId: number | undefined, itemId?: number) =>
  z.object({
    label: z
      .string('请输入字典子项名称')
      .min(1, '字典子项名称不能为空')
      .max(100, '字典子项名称不能超过100个字符')
      .refine(
        async label => {
          if (!parentId) {
            return true;
          }

          const res = await dictItemNameExistsApi(parentId, label, '', itemId);
          return !res.data.labelExists;
        },
        {
          message: '字典子项名称已存在',
        },
      ),
    value: z
      .string('请输入字典子项编码')
      .min(1, '字典子项编码不能为空')
      .max(100, '字典子项编码不能超过100个字符')
      .refine(
        async value => {
          if (!parentId) {
            return true;
          }

          const res = await dictItemNameExistsApi(parentId, '', value, itemId);
          return !res.data.valueExists;
        },
        {
          message: '字典子项编码已存在',
        },
      ),
    sort: z.number().int().min(-1).optional(),
    status: z.number().int().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface DictItemEditProps {
  parentId: number | undefined;
  data: DictItemDTO | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const DictItemEdit = (props: DictItemEditProps) => {
  const { parentId, data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(parentId, data?.id)),
    defaultValues: {
      label: '',
      value: '',
      sort: -1,
      status: STATUS.ENABLE,
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      label: data?.label ?? '',
      value: data?.value ?? '',
      sort: data?.sort ?? -1,
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    if (!parentId) {
      return;
    }

    try {
      setIsPending(true);

      if (data?.id) {
        await dictItemUpdateApi(data.id, {
          ...formData,
          parentId,
          id: data.id,
          status: formData.status as STATUS,
          description: formData.description || null,
        });
      } else {
        await dictItemAddApi(parentId, {
          ...formData,
          parentId,
          status: formData.status as STATUS,
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
          <SheetTitle>{data?.id ? '编辑字典子项' : '新增字典子项'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-dict-item" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="label"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-item-label"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      字典子项名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-dict-item-label"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入字典子项名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-item-value"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      字典子项编码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-dict-item-value"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入字典子项编码"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="sort"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-item-sort"
                      className="tracking-widest"
                    >
                      排序
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      type="number"
                      id="form-dict-item-sort"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入排序"
                      autoComplete="off"
                      min="-1"
                    />
                    <div className="text-xs text-muted-foreground">
                      -1 表示该字典子项将排在最后
                    </div>
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
                      htmlFor="form-dict-item-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-dict-item-description"
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
          <Button form="form-dict-item" type="submit" loading={isPending}>
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

export default DictItemEdit;
