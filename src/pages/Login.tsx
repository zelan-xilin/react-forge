import { useActionState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store';
import { setAuth } from '@/store/modules/authSlice';
import { setUser } from '@/store/modules/userSlice';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [, loginAction, isPending] = useActionState(async () => {
    const delay = Math.random() * 5000;
    await new Promise(res => setTimeout(res, delay));

    dispatch(
      setUser({
        id: '1',
        token: 'token',
        username: 'Admin',
        account: '983867260000',
        password: null,
        rememberPassword: false,
      }),
    );
    dispatch(
      setAuth({
        menus: [],
        buttons: [],
        hasUnrestrictedPermissions: true,
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
