import { areaResourceAddApi, areaResourceNameExistsApi, areaResourceUpdateApi } from '@/api/area';
import type { AreaResourceAddOrUpdateParams, AreaResourceDto } from '@/api/area/types';
import {
  areaTypeOptions,
  roomSizeOptions,
  STATUS,
  type AREA_TYPE,
  type ROOM_SIZE,
} from '@/api/types';
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

const getFormSchema = (areaResourceId?: number) =>
  z.object({
    name: z
      .string('请输入资源名称')
      .min(1, '资源名称不能为空')
      .max(50, '资源名称不能超过50个字符')
      .refine(
        async name => {
          const res = await areaResourceNameExistsApi(name, areaResourceId);
          return !res.data.exists;
        },
        { message: '资源名称已存在' },
      ),
    areaType: z.string().min(1, '区域类型不能为空'),
    roomSize: z.string().optional(),
    capacity: z.number().min(1, '容量不能小于1').optional(),
    status: z.number().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface ResourceEditProps {
  data: AreaResourceAddOrUpdateParams | undefined;
  open: boolean;
  onClose: (data?: AreaResourceDto) => void;
}
const ResourceEdit = (props: ResourceEditProps) => {
  const { data, open, onClose } = props;

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      name: '',
      areaType: areaTypeOptions[0].value,
      roomSize: roomSizeOptions[0].value,
      capacity: 1,
      status: STATUS.ENABLE,
      description: '',
    },
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: data?.name || '',
      areaType: data?.areaType || areaTypeOptions[0].value,
      roomSize: data?.roomSize || roomSizeOptions[0].value,
      capacity: data?.capacity || 1,
      status: data?.status || STATUS.ENABLE,
      description: data?.description || '',
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);
      const res = data?.id
        ? await areaResourceUpdateApi({
            id: data.id,
            ...formData,
            areaType: formData.areaType as AREA_TYPE,
            roomSize: formData.roomSize !== '0' ? (formData.roomSize as ROOM_SIZE) : '',
            status: formData.status as STATUS,
          })
        : await areaResourceAddApi({
            ...formData,
            areaType: formData.areaType as AREA_TYPE,
            roomSize: formData.roomSize !== '0' ? (formData.roomSize as ROOM_SIZE) : '',
            status: formData.status as STATUS,
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
          <SheetTitle>{data?.id ? '编辑资源' : '新增资源'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-resource" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-resource-name" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      资源名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-resource-name"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入资源名称"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="areaType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-resource-areaType" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      区域类型
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-resource-areaType">
                        <SelectValue placeholder="请选择区域类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaTypeOptions.map(areaType => (
                          <SelectItem key={areaType.value} value={String(areaType.value)}>
                            {areaType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="roomSize"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-resource-roomSize" className="tracking-widest">
                      包间大小
                    </FieldLabel>
                    <Select value={field.value} onValueChange={val => field.onChange(val)}>
                      <SelectTrigger id="form-resource-roomSize">
                        <SelectValue placeholder="请选择包间大小" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">请选择包间大小</SelectItem>
                        {roomSizeOptions.map(roomSize => (
                          <SelectItem key={roomSize.value} value={String(roomSize.value)}>
                            {roomSize.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="capacity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-resource-capacity" className="tracking-widest">
                      <span className="text-destructive">*</span>
                      容量(人)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={Number(field.value)}
                      onChange={e => field.onChange(parseInt(e.target.value, 10))}
                      type="number"
                      id="form-resource-capacity"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入容量(人)"
                      autoComplete="off"
                    />
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
          <Button form="form-resource" type="submit" loading={isPending}>
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

export default ResourceEdit;
