import { materialDeleteApi, materialPageApi } from '@/api/material';
import type { MaterialDto, MaterialPageParams } from '@/api/material/types';
import { STATUS } from '@/assets/enum';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import Status from '@/components/Status';
import Table, { TableExtra, type Column } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { useDict } from '@/hooks/useDict';
import { useKeepAliveRefresh } from '@/layouts';
import { Plus, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MaterialEdit from './components/MaterialEdit';

const Material = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/material/material');
  const { dict } = useDict();

  const [query, setQuery] = useState<MaterialPageParams>({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<MaterialDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    materialPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: MaterialDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: MaterialDto) => {
    materialDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const columns: Column<MaterialDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '物料名称',
      field: 'name',
      render: item => item.name,
    },
    {
      title: '配方单位',
      field: 'recipeUnit',
      render: item =>
        dict.recipe_unit?.find(it => it.value === item.recipeUnit)?.label ||
        item.recipeUnit,
    },
    {
      title: '状态',
      field: 'status',
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
      width: 100,
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

  return (
    <PageWrapper
      title="物料管理"
      description="管理物料信息，便于在配方管理中选择对应的物料。"
      extra={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增物料</span>
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
      <Table
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
      />

      <MaterialEdit
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

export default Material;
