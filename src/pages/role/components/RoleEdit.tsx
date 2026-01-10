import { roleAddApi, roleNameExistsApi, roleUpdateApi } from '@/api/role';
import type { RoleAddOrUpdateParams, RoleDto } from '@/api/role/types';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const getFormSchema = (roleId?: number) =>
  z.object({
    name: z
      .string('请输入角色名称')
      .min(1, '角色名称不能为空')
      .max(50, '角色名称不能超过50个字符')
      .refine(
        async name => {
          const res = await roleNameExistsApi(name, roleId);
          return !res.data.exists;
        },
        { message: '角色名称已存在' },
      ),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface RoleEditProps {
  data: RoleAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (data?: RoleDto, add?: boolean) => void;
}
const RoleEdit = (props: RoleEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: '',
      description: '',
      ...data,
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);
      const res = data?.id
        ? await roleUpdateApi({ id: data.id, ...formData })
        : await roleAddApi(formData);

      if (data?.id) {
        toast.success('编辑成功');
      }
      onClose(res.data, !data?.id);
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
          <SheetTitle>{data?.id ? '编辑角色' : '新增角色'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-role" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-role-name" className="tracking-widest">
                      角色名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-role-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入角色名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-role-description" className="tracking-widest">
                      描述
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-role-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入描述"
                      autoComplete="off"
                      type="text"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button form="form-role" type="submit" loading={isPending}>
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

export default RoleEdit;
