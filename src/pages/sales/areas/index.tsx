import { areaDeleteApi, areaPageApi } from '@/api/area';
import type { AreaDto, AreaPageParams } from '@/api/area/types';
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
import AreaEdit from './components/AreaEdit';

const Areas = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/sales/areas');
  const { dict } = useDict();

  const [query, setQuery] = useState<AreaPageParams>({ page: 1, pageSize: 10 });
  const [data, setData] = useState<AreaDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    areaPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: AreaDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: AreaDto) => {
    areaDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const columns: Column<AreaDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '区域名称',
      field: 'name',
      render: item => item.name,
    },
    {
      title: '区域类型',
      field: 'areaType',
      render: item =>
        dict.area_type?.find(it => it.value === item.areaType)?.label ||
        item.areaType,
    },
    {
      title: '包间大小',
      field: 'roomSize',
      render: item =>
        dict.room_size?.find(it => it.value === item.roomSize)?.label ||
        item.roomSize,
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
      title="区域管理"
      description="配置茶楼的各个区域信息，便于在收银台中选择对应的区域。"
      extra={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增区域</span>
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

      <AreaEdit
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

export default Areas;
