import { STATUS } from '@/api/types';
import { userCountApi, userDeleteApi, userPageApi } from '@/api/user';
import type { UserDto, UserPageParams } from '@/api/user/types';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import Status from '@/components/Status';
import Summary, { type SummaryVo } from '@/components/Summary';
import Table, { type Column } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import { Plus, RotateCw, Shield, ShieldEllipsis, ShieldUser } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PasswordEdit from './components/PasswordEdit';
import UserEdit from './components/UserEdit';

const columns: Column<UserDto>[] = [
  {
    title: '序号',
    field: 'index',
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: '用户名称',
    field: 'username',
    render: item => item.username,
  },
  {
    title: '角色名称',
    field: 'roleName',
    render: item => item.roleName,
  },
  {
    title: '联系方式',
    field: 'phone',
    render: item => item.phone?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
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
    title: '创建者',
    field: 'createdByName',
    render: item => item.createdByName,
  },
  {
    title: '创建时间',
    field: 'createdAt',
    render: item => (item.createdAt ? new Date(item.createdAt).toLocaleString() : ''),
  },
];

const User = () => {
  const { refreshId, refreshLoading, onRefresh } = useKeepAliveRefresh('/user');

  const [count, setCount] = useState<SummaryVo[]>([
    {
      key: 'userCount',
      label: '用户总数',
      value: 0,
      icon: ShieldUser,
    },
    {
      key: 'enableUserCount',
      label: '启用用户总数',
      value: 0,
      icon: ShieldEllipsis,
    },
    {
      key: 'associatedUserCount',
      label: '关联角色的用户总数',
      value: 0,
      icon: Shield,
    },
  ]);
  useEffect(() => {
    void refreshId;

    userCountApi().then(res => {
      setCount(prevCount =>
        prevCount.map(it => ({
          ...it,
          value: res.data ? res.data[it.key as keyof typeof res.data] : 0,
        })),
      );
    });
  }, [refreshId]);

  const [query, setQuery] = useState<UserPageParams>({ page: 1, pageSize: 10 });
  const [data, setData] = useState<UserDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    userPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{ open: boolean; data: UserDto | undefined }>({
    open: false,
    data: undefined,
  });
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; data: UserDto | undefined }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: UserDto) => {
    userDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const actions: Column<UserDto>[] = [
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
            onClick={() => setPasswordModal({ open: true, data: item })}
          >
            修改密码
          </Button>
          <Delete onDelete={() => onDelete(item)}>
            <Button variant="link-destructive" size="sm" className="px-0 text-xs">
              删除
            </Button>
          </Delete>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="用户管理"
      description="配置系统用户及对应权限，保障数据安全访问。"
      extra={
        <SearchInput
          placeholder="搜索用户名称..."
          onChange={val =>
            setQuery(pre => ({
              username: val,
              page: 1,
              pageSize: pre.pageSize,
            }))
          }
        />
      }
      summary={<Summary data={count} />}
      action={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增用户</span>
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
        footer={
          <div className="flex justify-between items-center">
            <div>
              显示&nbsp;{data.length}&nbsp;条，共&nbsp;{total}&nbsp;条记录
            </div>

            <Pagination
              total={total}
              current={query.page}
              pageSize={query.pageSize}
              onChange={(page, pageSize) => setQuery(prev => ({ ...prev, page, pageSize }))}
            />
          </div>
        }
      />

      <UserEdit
        {...editModal}
        onClose={dto => {
          setEditModal({ open: false, data: undefined });

          if (dto) {
            onRefresh();
          }
        }}
      />
      <PasswordEdit
        {...passwordModal}
        onClose={() => {
          setPasswordModal({ open: false, data: undefined });
        }}
      />
    </PageWrapper>
  );
};

export default User;
