import { roleDeleteApi, rolePageApi } from '@/api/role';
import type { RoleDto, RolePageParams } from '@/api/role/types';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import Table, { TableExtra, type Column } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import { Plus, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AuthEdit from './components/AuthEdit';
import RoleEdit from './components/RoleEdit';

const columns: Column<RoleDto>[] = [
  {
    title: '序号',
    field: 'index',
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: '角色名称',
    field: 'name',
    render: item => item.name,
  },
  {
    title: '描述',
    field: 'description',
    render: item => item.description,
  },
];

const Role = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/setting/role');

  const [query, setQuery] = useState<RolePageParams>({ page: 1, pageSize: 10 });
  const [data, setData] = useState<RoleDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    rolePageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: RoleDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    data: RoleDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: RoleDto) => {
    roleDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const actions: Column<RoleDto>[] = [
    {
      title: '操作',
      field: 'actions',
      width: 130,
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
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setAuthModal({ open: true, data: item })}
          >
            权限
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
      title="角色管理"
      description="配置系统用户角色及对应权限，保障数据安全访问。"
      extra={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增角色</span>
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
        columns={[...columns, ...actions]}
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

      <RoleEdit
        {...editModal}
        onClose={(dto, add) => {
          setEditModal({ open: false, data: undefined });

          if (dto) {
            onRefresh();
          }

          if (add) {
            setAuthModal({ open: true, data: dto });
            return;
          }
        }}
      />
      <AuthEdit
        {...authModal}
        onClose={req => {
          setAuthModal({ open: false, data: undefined });

          if (req) {
            onRefresh();
          }
        }}
      />
    </PageWrapper>
  );
};

export default Role;
