import {
  materialAddApi,
  materialNameExistsApi,
  materialUpdateApi,
} from '@/api/material';
import type { MaterialDto } from '@/api/material/types';
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

const getFormSchema = (materialId?: number) =>
  z.object({
    name: z
      .string()
      .min(1, '物料名称不能为空')
      .max(50, '物料名称不能超过50个字符')
      .refine(
        async name => {
          const res = await materialNameExistsApi(name, materialId);
          return !res.data.exists;
        },
        { message: '物料名称已存在' },
      ),
    recipeUnit: z
      .string()
      .min(1, '物料单位不能为空')
      .max(20, '物料单位不能超过20个字符'),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface MaterialEditProps {
  data: MaterialDto | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const MaterialEdit = (props: MaterialEditProps) => {
  const { data, open, onClose } = props;
  const { dict } = useDict();

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      name: '',
      recipeUnit: '',
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
      recipeUnit: data?.recipeUnit ?? '',
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);

      if (data?.id) {
        await materialUpdateApi({
          id: data.id,
          ...formData,
          status: formData.status as STATUS | undefined,
        });
      } else {
        await materialAddApi({
          ...formData,
          status: formData.status as STATUS | undefined,
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
          <SheetTitle>{data?.id ? '编辑物料' : '新增物料'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-material" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-material-name"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      物料名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-material-name"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入物料名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="recipeUnit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-material-recipeUnit"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      配方单位
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={val =>
                        val === 'empty' ? null : field.onChange(val)
                      }
                    >
                      <SelectTrigger id="form-material-recipeUnit">
                        <SelectValue placeholder="请选择配方单位" />
                      </SelectTrigger>
                      <SelectContent>
                        {dict.recipe_unit?.map(it => (
                          <SelectItem
                            key={it.value}
                            value={String(it.value)}
                            disabled={it.status !== STATUS.ENABLE}
                          >
                            {it.label}
                          </SelectItem>
                        ))}
                        {!dict.recipe_unit?.length && (
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
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-material-status"
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
                      <SelectTrigger id="form-material-status">
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
                      htmlFor="form-material-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-material-description"
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
          <Button form="form-material" type="submit" loading={isPending}>
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

export default MaterialEdit;
