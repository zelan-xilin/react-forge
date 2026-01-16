import { loginApi } from '@/api/login';
import { IS_ADMIN } from '@/assets/enum';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Separator } from '@/components/ui/separator';
import type { AppDispatch, RootState } from '@/store';
import { setAuth } from '@/store/modules/authSlice';
import { setUser } from '@/store/modules/userSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import * as z from 'zod';

const formSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少 6 位'),
  rememberPassword: z.boolean(),
});
type FormSchema = z.infer<typeof formSchema>;

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username ?? '',
      password: user.password ?? '',
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

      const state = location.state as
        | { from?: { pathname?: string } }
        | undefined;
      const redirectTo = state?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex h-full justify-center items-center overflow-auto">
      <div className="w-2/7 min-w-120 flex flex-col items-center gap-4">
        <Logo />

        <div className="text-xl">
          <div>欢迎回来</div>
          <div className="relative after:content-[''] after:rounded-[2px] after:absolute after:h-1.5 after:bg-primary after:w-10 after:-bottom-2 after:right-0">
            开始今日营业
          </div>
        </div>

        <form
          className="w-full border p-12 rounded-2xl bg-card/80 backdrop-blur-xl shadow-2xl mt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-login-username"
                    className="tracking-widest"
                  >
                    账号
                  </FieldLabel>
                  <InputGroup className="h-12">
                    <InputGroupAddon>
                      <User className="size-6" />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="form-login-username"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入账号"
                      autoComplete="off"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-login-password"
                    className="tracking-widest"
                  >
                    密码
                  </FieldLabel>
                  <InputGroup className="h-12">
                    <InputGroupAddon>
                      <Lock className="size-6" />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="form-login-password"
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
                        <Eye className="size-6" />
                      ) : (
                        <EyeOff className="size-6" />
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
              name="rememberPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id="form-login-rememberPassword"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel
                    htmlFor="form-login-rememberPassword"
                    className="tracking-widest"
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

          <Separator className="my-4" />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>SYSTEM OPERATIONAL</span>
            <span>BUILD 0.0.1</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
