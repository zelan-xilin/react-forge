import { roleListApi } from '@/api/role';
import type { RoleDto } from '@/api/role/types';
import { IS_ADMIN, STATUS } from '@/api/types';
import { userAddApi, userNameExistsApi, userUpdateApi } from '@/api/user';
import type { UserAddOrUpdateParams, UserDto } from '@/api/user/types';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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

const getFormSchema = (userId?: number) =>
  z.object({
    username: z
      .string('请输入用户名称')
      .min(3, '用户名称至少3个字符')
      .max(50, '用户名称不能超过50个字符')
      .refine(
        async name => {
          const res = await userNameExistsApi(name, userId);
          return !res.data.exists;
        },
        { message: '用户名称已存在' },
      ),
    password: userId
      ? z.string().optional()
      : z.string().min(6, '密码至少6个字符').max(100, '密码不能超过100个字符'),
    roleId: z.number().optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
    status: z.number().int().min(0).max(1).optional(),
    isAdmin: z.number().int().min(0).max(1).optional(),
    phone: z
      .string()
      .refine(val => !val || (val.length === 11 && /^1[3-9]\d{9}$/.test(val)), {
        message: '请输入正确的11位手机号',
      })
      .optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface UserEditProps {
  data: UserAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (data?: UserDto) => void;
}
const UserEdit = (props: UserEditProps) => {
  const { data, open, onClose } = props;

  const [roleList, setRoleList] = useState<RoleDto[]>([]);
  useEffect(() => {
    if (!open) {
      return;
    }

    roleListApi().then(res => {
      setRoleList(res.data || []);
    });
  }, [open]);

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      username: '',
      password: '',
      phone: '',
      roleId: 0,
      description: '',
      status: STATUS.ENABLE,
      isAdmin: IS_ADMIN.NO,
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      username: data?.username ?? '',
      password: '',
      roleId: data?.roleId ?? 0,
      description: data?.description ?? '',
      phone: data?.phone ?? '',
      status: data?.status ?? STATUS.ENABLE,
      isAdmin: data?.isAdmin ?? IS_ADMIN.NO,
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);
      const res = data?.id
        ? await userUpdateApi({
            id: data.id,
            ...formData,
            password: undefined,
            phone: formData.phone || undefined,
            roleId: (formData.roleId ?? 0) > 0 ? formData.roleId : undefined,
            status: (formData.status ?? STATUS.ENABLE) as STATUS,
            isAdmin: (formData.isAdmin ?? IS_ADMIN.NO) as IS_ADMIN,
          })
        : await userAddApi({
            ...formData,
            phone: formData.phone || undefined,
            roleId: (formData.roleId ?? 0) > 0 ? formData.roleId : undefined,
            status: (formData.status ?? STATUS.ENABLE) as STATUS,
            isAdmin: (formData.isAdmin ?? IS_ADMIN.NO) as IS_ADMIN,
          });

      toast.success(data?.id ? '编辑成功' : '新增成功');
      onClose(res.data);
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
          <SheetTitle>{data?.id ? '编辑用户' : '新增用户'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-user" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-username" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      用户名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-user-username"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入用户名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {!data?.id && (
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-user-password" className="tracking-widest">
                        <span className="text-destructive">*</span>
                        密码
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-user-password"
                        aria-invalid={fieldState.invalid}
                        aria-required="true"
                        placeholder="请输入密码"
                        autoComplete="off"
                        type="password"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-phone" className="tracking-widest">
                      联系方式
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-user-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入联系方式"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="roleId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-roleId" className="tracking-widest">
                      角色
                    </FieldLabel>
                    <Select
                      value={(field.value ?? 0) > 0 ? String(field.value) : '0'}
                      onValueChange={val => field.onChange(val ? Number(val) : 0)}
                    >
                      <SelectTrigger id="form-user-roleId">
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">请选择角色</SelectItem>
                        {roleList.map(role => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-status" className="tracking-widest">
                      状态
                    </FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={val => field.onChange(Number(val))}
                    >
                      <SelectTrigger id="form-user-status">
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(STATUS.ENABLE)}>启用</SelectItem>
                        <SelectItem value={String(STATUS.DISABLE)}>禁用</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-user-description" className="tracking-widest">
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-user-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="请输入描述"
                      autoComplete="off"
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

export default UserEdit;
