import { recipeDeleteApi, recipePageApi } from '@/api/recipe';
import type {
  RecipeDto,
  RecipeItemDto,
  RecipePageParams,
} from '@/api/recipe/types';
import { STATUS } from '@/assets/enum';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import Status from '@/components/Status';
import Table, { TableExtra, type Column } from '@/components/Table';
import TableExpandable from '@/components/TableExpandable';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import type { RootState } from '@/store';
import { Plus, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import RecipeEdit from './components/RecipeEdit';

const Recipe = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/material/recipe');
  const dict = useSelector((state: RootState) => state.dict);

  const [query, setQuery] = useState<RecipePageParams>({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<RecipeDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    recipePageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: RecipeDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: RecipeDto) => {
    recipeDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };

  const columns: Column<RecipeDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '配方名称',
      field: 'label',
      width: 250,
      render: item => item.name,
    },
    {
      title: '状态',
      field: 'status',
      width: 250,
      render: item => <Status value={item.status === STATUS.ENABLE} />,
    },
    {
      title: '描述',
      field: 'description',
      render: item => item.description,
    },
    {
      title: '操作',
      field: 'actions',
      width: 135,
      render: item => (
        <div className="flex gap-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setEditModal({ open: true, data: item })}
          >
            编辑
          </Button>
          <Delete onDelete={() => onDelete(item)}>
            <Button variant="link" size="sm" className="px-0 text-xs">
              删除
            </Button>
          </Delete>
        </div>
      ),
    },
  ];
  const itemColumns: Column<RecipeItemDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 140,
      render: (_, index) => index + 1,
    },
    {
      title: '物料名称',
      field: 'name',
      width: 250,
      render: item => item.materialName,
    },
    {
      title: '配方单位',
      field: 'recipeUnit',
      width: 250,
      render: item =>
        dict.data['recipe_unit']?.find(it => it.value === item.recipeUnit)
          ?.label || item.recipeUnit,
    },
    {
      title: '配方用量',
      field: 'amount',
      render: item => item.amount,
    },
  ];

  return (
    <PageWrapper
      title="配方管理"
      description="配置茶楼的各个销售商品信息，便于在收银台中选择对应的商品。"
      extra={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增配方</span>
          </Button>
          <Button
            hideChildrenOnLoading
            variant="ghost"
            loading={refreshLoading}
            onClick={onRefresh}
          >
            <RotateCw />
          </Button>
        </>
      }
    >
      <TableExpandable
        columns={columns}
        data={data}
        rowKey={it => it.id}
        extra={
          <TableExtra
            dataLength={data.length}
            total={total}
            query={query}
            setQuery={q => setQuery(prev => ({ ...prev, ...q }))}
          />
        }
        expandable={{
          render: it => (
            <Table
              className="bg-muted/50"
              columns={itemColumns}
              data={it.children || []}
              rowKey={e => e.materialId}
            />
          ),
        }}
      />

      <RecipeEdit
        {...editModal}
        onClose={req => {
          setEditModal({ open: false, data: undefined });

          if (req) {
            onRefresh();
          }
        }}
      />
    </PageWrapper>
  );
};

export default Recipe;
