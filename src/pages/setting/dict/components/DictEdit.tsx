import { dictAddApi, dictNameExistsApi, dictUpdateApi } from '@/api/dict';
import type { DictDto } from '@/api/dict/types';
import { mustHaveDictOptions, STATUS, statusOptions } from '@/assets/enum';
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

const getFormSchema = (dictId?: number) =>
  z.object({
    label: z
      .string('请输入字典名称')
      .min(1, '字典名称不能为空')
      .max(100, '字典名称不能超过100个字符')
      .refine(
        async label => {
          const res = await dictNameExistsApi(label, '', dictId);
          return !res.data.labelExists;
        },
        {
          message: '字典名称已存在',
        },
      ),
    value: z
      .string('请输入字典编码')
      .min(1, '字典编码不能为空')
      .max(100, '字典编码不能超过100个字符')
      .refine(
        async value => {
          const res = await dictNameExistsApi('', value, dictId);
          return !res.data.valueExists;
        },
        {
          message: '字典编码已存在',
        },
      ),
    status: z.number().int().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface DictEditProps {
  data: Omit<DictDto, 'children'> | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const DictEdit = (props: DictEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      label: '',
      value: '',
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
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);

      if (data?.id) {
        await dictUpdateApi({
          id: data.id,
          ...formData,
          status: formData.status as STATUS,
          description: formData.description || null,
        });
      } else {
        await dictAddApi({
          ...formData,
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
          <SheetTitle>{data?.id ? '编辑字典' : '新增字典'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-dict" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="label"
                control={form.control}
                disabled={mustHaveDictOptions.some(
                  d => d.value === data?.value,
                )}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-label"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      字典名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-dict-label"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入字典名称"
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
                disabled={mustHaveDictOptions.some(
                  d => d.value === data?.value,
                )}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-dict-value"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      字典编码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-dict-value"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入字典编码"
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
                disabled={mustHaveDictOptions.some(
                  d => d.value === data?.value,
                )}
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
                      disabled={mustHaveDictOptions.some(
                        d => d.value === data?.value,
                      )}
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
                      htmlFor="form-dict-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-dict-description"
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
          <Button form="form-dict" type="submit" loading={isPending}>
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

export default DictEdit;
