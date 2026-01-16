import { dictDeleteApi, dictListApi, dictPageApi } from '@/api/dict';
import type { DictDto, DictItemDTO, DictPageParams } from '@/api/dict/types';
import { mustHaveDictOptions, STATUS } from '@/assets/enum';
import Delete from '@/components/Delete';
import PageWrapper from '@/components/PageWrapper';
import Status from '@/components/Status';
import Table, { TableExtra, type Column } from '@/components/Table';
import TableExpandable from '@/components/TableExpandable';
import { Button } from '@/components/ui/button';
import { useKeepAliveRefresh } from '@/layouts';
import type { AppDispatch } from '@/store';
import { clearDict, setDict } from '@/store/modules/dictSlice';
import { Plus, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import DictEdit from './components/DictEdit';
import DictItemEdit from './components/DictItemEdit';
import MustDictDescription from './components/MustDictDescription';

const columns: Column<DictDto>[] = [
  {
    title: '序号',
    field: 'index',
    width: 80,
    render: (_, index) => index + 1,
  },
  {
    title: '字典名称',
    field: 'label',
    width: 250,
    render: item => item.label,
  },
  {
    title: '字典编码',
    field: 'value',
    width: 250,
    render: item => item.value,
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
];
const itemColumns: Column<DictItemDTO>[] = [
  {
    title: '序号',
    field: 'index',
    width: 140,
    render: (_, index) => index + 1,
  },
  {
    title: '子项名称',
    field: 'label',
    width: 250,
    render: item => item.label,
  },
  {
    title: '子项编码',
    field: 'value',
    width: 250,
    render: item => item.value,
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
];

interface ItemProps {
  data: DictItemDTO[];
  onEdit: (item: DictItemDTO) => void;
  onRefresh: () => void;
}
const DictItems = (props: ItemProps) => {
  const { data, onEdit, onRefresh } = props;

  const onDelete = (item: DictItemDTO) => {
    dictDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };

  const actions: Column<DictItemDTO>[] = [
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
            onClick={() => onEdit(item)}
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
    <Table
      className="bg-muted/50"
      columns={[...itemColumns, ...actions]}
      data={data}
      rowKey={it => it.id}
    />
  );
};

const Dict = () => {
  const { refreshId, refreshLoading, onRefresh } =
    useKeepAliveRefresh('/setting/dict');
  const dispatch = useDispatch<AppDispatch>();
  const refreshStoreDict = () => {
    dictListApi().then(res => {
      dispatch(clearDict());

      res.data?.forEach(it => {
        dispatch(
          setDict({
            [it.value]: it.children || [],
          }),
        );
      });
    });
  };

  const [query, setQuery] = useState<DictPageParams>({ page: 1, pageSize: 10 });
  const [data, setData] = useState<DictDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    dictPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: DictDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const [editItemModal, setEditItemModal] = useState<{
    open: boolean;
    data: DictItemDTO | undefined;
    parentId: number | undefined;
  }>({
    open: false,
    data: undefined,
    parentId: undefined,
  });
  const onDelete = (item: DictDto) => {
    dictDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };
  const actions: Column<DictDto>[] = [
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
            onClick={() =>
              setEditItemModal({
                open: true,
                data: undefined,
                parentId: item.id,
              })
            }
          >
            新增子项
          </Button>
          <Delete
            onDelete={() => onDelete(item)}
            disabled={mustHaveDictOptions.some(d => d.value === item.value)}
          >
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
      title={
        <>
          <span>字典管理</span>
          <MustDictDescription />
        </>
      }
      description="配置系统字典，用于数据字典的统一管理，系统内置字典不允许删除。"
      extra={
        <>
          <Button onClick={() => setEditModal({ open: true, data: undefined })}>
            <Plus />
            <span>新增字典</span>
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
        expandable={{
          render: it => (
            <DictItems
              data={it.children || []}
              onEdit={dictIt =>
                setEditItemModal({ open: true, data: dictIt, parentId: it.id })
              }
              onRefresh={onRefresh}
            />
          ),
        }}
      />

      <DictEdit
        {...editModal}
        onClose={req => {
          setEditModal({ open: false, data: undefined });

          if (req) {
            onRefresh();
            refreshStoreDict();
          }
        }}
      />
      <DictItemEdit
        {...editItemModal}
        onClose={req => {
          setEditItemModal({
            open: false,
            data: undefined,
            parentId: undefined,
          });

          if (req) {
            onRefresh();
            refreshStoreDict();
          }
        }}
      />
    </PageWrapper>
  );
};

export default Dict;
