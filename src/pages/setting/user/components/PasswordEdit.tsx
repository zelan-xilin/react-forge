import { userUpdateApi } from '@/api/user';
import type { UserAddOrUpdateParams } from '@/api/user/types';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
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
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, '密码至少6个字符')
      .max(100, '密码不能超过100个字符'),
    confirmPassword: z
      .string()
      .min(6, '密码至少6个字符')
      .max(100, '密码不能超过100个字符'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '输入的密码不一致',
    path: ['confirmPassword'],
  });
type FormSchema = z.infer<typeof formSchema>;

interface PasswordEditProps {
  data: UserAddOrUpdateParams | undefined;
  open: boolean;
  onClose: () => void;
}
const PasswordEdit = (props: PasswordEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      password: '',
      confirmPassword: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
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

      toast.success('修改密码成功');
      onClose();
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
          <form id="form-password" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-password-password"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      密码
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-password-password"
                        aria-invalid={fieldState.invalid}
                        aria-required="true"
                        placeholder="请输入密码"
                        autoComplete="off"
                        type={showPassword ? 'text' : 'password'}
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowPassword(v => !v)}
                        className="cursor-pointer"
                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                        role="button"
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-password-confirm-password"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      确认密码
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-password-confirm-password"
                        aria-invalid={fieldState.invalid}
                        aria-required="true"
                        placeholder="请输入密码"
                        autoComplete="off"
                        type={showConfirmPassword ? 'text' : 'password'}
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        className="cursor-pointer"
                        aria-label={
                          showConfirmPassword ? '隐藏密码' : '显示密码'
                        }
                        role="button"
                      >
                        {showConfirmPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
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
          <Button form="form-password" type="submit" loading={isPending}>
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
