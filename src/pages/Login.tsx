import { useActionState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { loginApi } from '@/api/login';
import { IS_ADMIN } from '@/api/login/types';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store';
import { setAuth } from '@/store/modules/authSlice';
import { setUser } from '@/store/modules/userSlice';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [, loginAction, isPending] = useActionState(async () => {
    const { data: resData } = await loginApi({
      username: 'admin',
      password: '123456',
    });

    dispatch(
      setUser({
        token: resData?.token,
        id: resData?.user.id,
        username: resData?.user.username,
        password: '123456',
        rememberPassword: false,
      }),
    );
    dispatch(
      setAuth({
        menus: resData?.permissions.paths,
        actions: resData?.permissions.actions,
        hasUnrestrictedPermissions: resData?.user.isAdmin === IS_ADMIN.YES,
      }),
    );

    const state = location.state as { from?: { pathname?: string } } | undefined;
    const redirectTo = state?.from?.pathname ?? '/';
    navigate(redirectTo, { replace: true });

    return true;
  }, undefined);

  return (
    <div className="flex justify-center items-center h-full">
      <form action={loginAction}>
        <Button type="submit" loading={isPending}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
