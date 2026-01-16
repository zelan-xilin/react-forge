import { areaPricingDeleteApi, areaPricingPageApi } from '@/api/pricing/area';
import type {
  AreaPricingDto,
  AreaPricingPageParams,
} from '@/api/pricing/area-types';
import { overtimeRoundingOptions, STATUS } from '@/assets/enum';
import Delete from '@/components/Delete';
import Status from '@/components/Status';
import type { Column } from '@/components/Table';
import Table, { TableExtra } from '@/components/Table';
import { Button } from '@/components/ui/button';
import type { RootState } from '@/store';
import {
  useEffect,
  useImperativeHandle,
  useState,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import AreaPricingEdit from './AreaPricingEdit';

export interface AreaTableRef {
  setEditModal: Dispatch<
    SetStateAction<{
      open: boolean;
      data: AreaPricingDto | undefined;
    }>
  >;
}
interface AreaTableProps {
  refreshId: number | undefined;
  onRefresh: () => void;
  ref: Ref<AreaTableRef>;
}
const AreaTable = (props: AreaTableProps) => {
  const { refreshId, onRefresh, ref } = props;
  const dict = useSelector((state: RootState) => state.dict);

  const [query, setQuery] = useState<AreaPricingPageParams>({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<AreaPricingDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    areaPricingPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: AreaPricingDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: AreaPricingDto) => {
    areaPricingDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };

  const columns: Column<AreaPricingDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '区域类型',
      field: 'areaType',
      render: item =>
        dict.data['area_type']?.find(it => it.value === item.areaType)?.label ||
        item.areaType,
    },
    {
      title: '包间大小',
      field: 'roomSize',
      render: item =>
        dict.data['room_size']?.find(it => it.value === item.roomSize)?.label ||
        item.roomSize,
    },
    {
      title: '收费规则应用类型',
      field: 'ruleApplicationType',
      render: item =>
        dict.data['rule_application_type']?.find(
          it => it.value === item.ruleApplicationType,
        )?.label || item.ruleApplicationType,
    },
    {
      title: '收费规则应用起始时间',
      field: 'applyTimeStart',
      render: item => item.applyTimeStart,
    },
    {
      title: '使用时长(小时)',
      field: 'usageDurationHours',
      render: item => item.usageDurationHours,
    },
    {
      title: '基础收费(元)',
      field: 'basePrice',
      render: item => item.basePrice,
    },
    {
      title: '超时每小时收费(元)',
      field: 'overtimeHourPrice',
      render: item => item.overtimeHourPrice,
    },
    {
      title: '超时取整类型',
      field: 'overtimeRoundType',
      render: item =>
        overtimeRoundingOptions.find(it => it.value === item.overtimeRoundType)
          ?.label || item.overtimeRoundType,
    },
    {
      title: '超时宽限分钟数(分钟)',
      field: 'overtimeGraceMinutes',
      render: item => item.overtimeGraceMinutes,
    },
    {
      title: '赠送茶水金额(元)',
      field: 'giftTeaAmount',
      render: item => item.giftTeaAmount,
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

  useImperativeHandle(ref, () => ({
    setEditModal,
  }));

  return (
    <>
      <Table
        columns={columns}
        data={data}
        rowKey={it => it.id}
        extra={
          <TableExtra
            dataLength={data.length}
            total={total}
            setQuery={q => setQuery(prev => ({ ...prev, ...q }))}
          />
        }
      />

      <AreaPricingEdit
        {...editModal}
        onClose={req => {
          setEditModal({ open: false, data: undefined });

          if (req) {
            onRefresh();
          }
        }}
      />
    </>
  );
};

export default AreaTable;
