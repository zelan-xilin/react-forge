import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import * as z from 'zod';

import { loginApi } from '@/api/login';
import { IS_ADMIN } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Logo from '@/layouts/Logo';
import type { AppDispatch, RootState } from '@/store';
import { setAuth } from '@/store/modules/authSlice';
import { setUser } from '@/store/modules/userSlice';

const formSchema = z.object({
  username: z.string('请输入账号').min(1, '用户名不能为空'),
  password: z.string('请输入密码').min(6, '密码至少 6 位'),
  rememberPassword: z.boolean().optional(),
});

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username ?? undefined,
      password: user.password ?? undefined,
      rememberPassword: user.rememberPassword ?? false,
    },
  });

  const [isPending, setIsPending] = useState(false);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsPending(true);

      const { data: resData } = await loginApi({
        username: data.username,
        password: data.password,
      });

      dispatch(
        setUser({
          token: resData?.token,
          id: resData?.user.id,
          username: resData?.user.username,
          password: data.rememberPassword ? data.password : null,
          rememberPassword: data.rememberPassword ?? false,
        }),
      );
      dispatch(
        setAuth({
          paths: resData?.permissions.paths,
          actions: resData?.permissions.actions,
          hasUnrestrictedPermissions: resData?.user.isAdmin === IS_ADMIN.YES,
        }),
      );

      const state = location.state as { from?: { pathname?: string } } | undefined;
      const redirectTo = state?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } catch {
      // do nothing
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-none border-r py-2 pb-8 flex justify-end items-center [writing-mode:vertical-rl] text-9xl text-transparent [-webkit-text-stroke:1px_var(--color-muted-foreground)]">
        {'login'
          .toLocaleUpperCase()
          .split('')
          .reverse()
          .map((ch, i) => (
            <div key={i} className="rotate-180 select-none">
              {ch}
            </div>
          ))}
      </div>

      <div className="pr-32 flex-1 flex justify-center items-center overflow-auto">
        <div className="border p-12 rounded-2xl w-1/3 min-w-120 flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <Logo />
          </div>

          <div className="flex justify-center tracking-[0.15em] text-xl">
            <div>
              <div>欢迎回来</div>
              <div className="relative">
                <span>开始今日营业</span>
                <span className="absolute h-1.5 bg-primary w-12 -bottom-2 right-0"></span>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-username" className="tracking-widest">
                      账号
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入账号"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-password" className="tracking-widest">
                      密码
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-password"
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
                name="rememberPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <Checkbox
                      id="form-rhf-checkbox-rememberPassword"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel
                      htmlFor="form-rhf-checkbox-rememberPassword"
                      className="font-normal tracking-widest"
                    >
                      是否记住密码
                    </FieldLabel>
                  </Field>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  size="lg"
                  loading={isPending}
                  className="text-lg tracking-[0.3em]"
                >
                  登录
                  <ArrowRight className="size-5" />
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <Separator />

          <div className="flex justify-between text-xs">
            <span>SYSTEM OPERATIONAL</span>
            <span>BUILD 0.0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
