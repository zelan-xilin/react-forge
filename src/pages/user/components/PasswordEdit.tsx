import { userUpdateApi } from '@/api/user';
import type { UserAddOrUpdateParams } from '@/api/user/types';
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

const getFormSchema = () =>
  z
    .object({
      password: z.string().min(6, '密码至少6个字符').max(100, '密码不能超过100个字符'),
      confirmPassword: z
        .string()
        .min(6, '确认密码至少6个字符')
        .max(100, '确认密码不能超过100个字符'),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: '输入的密码不一致',
      path: ['confirmPassword'],
    });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface PasswordEditProps {
  data: UserAddOrUpdateParams | undefined;
  open: boolean;
  onClose: () => void;
}
const PasswordEdit = (props: PasswordEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      password: '',
      confirmPassword: '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    if (!data?.id) {
      return;
    }

    try {
      setIsPending(true);
      userUpdateApi({
        ...data,
        password: formData.password,
      });

      toast.success('编辑成功');
      onClose();
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
          <SheetTitle>修改密码</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-user" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-password" className="tracking-widest">
                      密码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-user-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入密码"
                      autoComplete="off"
                      type="password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-confirm-password" className="tracking-widest">
                      确认密码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-user-confirm-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入密码"
                      autoComplete="off"
                      type="password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button form="form-user" type="submit" loading={isPending}>
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

export default PasswordEdit;
