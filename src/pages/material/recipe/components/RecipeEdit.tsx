import { materialListApi } from '@/api/material';
import type { MaterialDto } from '@/api/material/types';
import {
  recipeAddApi,
  recipeNameExistsApi,
  recipeUpdateApi,
} from '@/api/recipe';
import type { RecipeDto } from '@/api/recipe/types';
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
import type { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as z from 'zod';

const getFormSchema = (recipeId?: number) =>
  z.object({
    name: z
      .string('请输入配方名称')
      .min(1, '配方名称至少1个字符')
      .max(50, '配方名称不能超过50个字符')
      .refine(
        async name => {
          const res = await recipeNameExistsApi(name, recipeId);
          return !res.data.exists;
        },
        { message: '配方名称已存在' },
      ),
    status: z.number().int().min(0).max(1).optional(),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
    children: z
      .array(
        z.object({
          materialId: z.string().length(1, '请选择物料'),
          amount: z.number().min(0, '数量不能小于0'),
        }),
      )
      .superRefine((children, ctx) => {
        const seen = new Map<string, number>();

        children.forEach((row, index) => {
          const id = row.materialId?.trim?.() ?? row.materialId;
          if (!id) return;

          const firstIndex = seen.get(id);
          if (firstIndex === undefined) {
            seen.set(id, index);
            return;
          }

          ctx.addIssue({
            code: 'custom',
            message: '物料不能重复',
            path: [index, 'materialId'],
          });

          ctx.addIssue({
            code: 'custom',
            message: '物料不能重复',
            path: [firstIndex, 'materialId'],
          });
        });
      }),
  });
type FormSchema = z.infer<ReturnType<typeof getFormSchema>>;

interface RecipeEditProps {
  data: RecipeDto | undefined;
  open: boolean;
  onClose: (req?: boolean) => void;
}
const RecipeEdit = (props: RecipeEditProps) => {
  const { data, open, onClose } = props;
  const dict = useSelector((state: RootState) => state.dict);

  const [materialList, setMaterialList] = useState<MaterialDto[]>([]);
  useEffect(() => {
    if (!open) {
      return;
    }

    materialListApi().then(res => {
      setMaterialList(res.data || []);
    });
  }, [open]);

  const [isPending, setIsPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(getFormSchema(data?.id)),
    defaultValues: {
      name: '',
      status: STATUS.ENABLE,
      description: '',
      children: [],
    },
  });
  const {
    fields: childFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'children',
  });
  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: data?.name ?? '',
      status: data?.status ?? STATUS.ENABLE,
      description: data?.description ?? '',
      children: data?.children?.map(it => ({
        ...it,
        materialId: String(it.materialId),
      })) ?? [{ materialId: '', amount: 0 }],
    });
  }, [open, data, form]);
  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsPending(true);
      const res = data?.id
        ? await recipeUpdateApi({
            id: data.id,
            ...formData,
            status: formData.status as STATUS,
            children: formData.children.map(it => ({
              ...it,
              materialId: Number(it.materialId),
            })),
          })
        : await recipeAddApi({
            ...formData,
            status: formData.status as STATUS,
            children: formData.children.map(it => ({
              ...it,
              materialId: Number(it.materialId),
            })),
          });

      toast.success(data?.id ? '编辑成功' : '新增成功');
      onClose(res.data);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.id ? '编辑配方' : '新增配方'}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="form-recipe" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="form-recipe-name"
                      className="tracking-widest"
                    >
                      <span className="text-destructive">*</span>
                      配方名称
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-recipe-name"
                      aria-invalid={fieldState.invalid}
                      aria-required="true"
                      placeholder="请输入配方名称"
                      autoComplete="off"
                    />
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
                      htmlFor="form-recipe-status"
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
                      <SelectTrigger id="form-recipe-status">
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
                      htmlFor="form-recipe-description"
                      className="tracking-widest"
                    >
                      描述
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-recipe-description"
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

              <div className="space-y-3">
                <FieldLabel className="tracking-widest">物料列表</FieldLabel>

                <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
                  <div className="grid grid-cols-[120px_1fr_auto] gap-2">
                    <FieldLabel className="tracking-widest pl-3">
                      物料
                    </FieldLabel>
                    <FieldLabel className="tracking-widest pl-3">
                      配方用量
                    </FieldLabel>
                    <div></div>
                  </div>

                  {childFields.map((item, index) => {
                    const selectedMaterialId = form.watch(
                      `children.${index}.materialId`,
                    );
                    const selectedMaterial = materialList.find(
                      m => String(m.id) === String(selectedMaterialId),
                    );
                    const unitLabel =
                      dict.data?.['recipe_unit']?.find(
                        u => u.value === selectedMaterial?.recipeUnit,
                      )?.label ??
                      selectedMaterial?.recipeUnit ??
                      '-';

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[120px_1fr_30px_auto] gap-2"
                      >
                        <Controller
                          name={`children.${index}.materialId`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <Select
                                value={String(field.value)}
                                onValueChange={val =>
                                  val === 'empty' ? null : field.onChange(val)
                                }
                              >
                                <SelectTrigger id="form-recipe-materialId">
                                  <SelectValue placeholder="请选择物料" />
                                </SelectTrigger>
                                <SelectContent>
                                  {materialList.map(option => (
                                    <SelectItem
                                      key={option.id}
                                      value={String(option.id)}
                                      disabled={option.status !== STATUS.ENABLE}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                  {!materialList.length && (
                                    <SelectItem value="empty">
                                      暂无可用选项，请前往物料管理添加
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )}
                        />

                        <Controller
                          name={`children.${index}.amount`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <Input
                                {...field}
                                onChange={e =>
                                  field.onChange(Number(e.target.value))
                                }
                                placeholder="用量"
                              />
                              <FieldError errors={[fieldState.error]} />
                            </Field>
                          )}
                        />

                        <div className="text-sm flex items-center">
                          {unitLabel}
                        </div>

                        <Button
                          type="button"
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      append({
                        materialId: '',
                        amount: 1,
                      })
                    }
                  >
                    新增物料
                  </Button>
                </div>
              </div>
            </FieldGroup>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button form="form-recipe" type="submit" loading={isPending}>
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

export default RecipeEdit;
