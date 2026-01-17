import {
  productPricingDeleteApi,
  productPricingPageApi,
} from '@/api/pricing/product';
import type {
  ProductPricingDto,
  ProductPricingPageParams,
} from '@/api/pricing/product-types';
import { recipeListApi } from '@/api/recipe';
import type { RecipeDto } from '@/api/recipe/types';
import { STATUS } from '@/assets/enum';
import Delete from '@/components/Delete';
import Status from '@/components/Status';
import type { Column } from '@/components/Table';
import Table, { TableExtra } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { useDict } from '@/hooks/useDict';
import {
  useEffect,
  useImperativeHandle,
  useState,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from 'react';
import { toast } from 'sonner';
import ProductPricingEdit from './ProductPricingEdit';

export interface ProductTableRef {
  setEditModal: Dispatch<
    SetStateAction<{
      open: boolean;
      data: ProductPricingDto | undefined;
    }>
  >;
}
interface ProductTableProps {
  refreshId: number | undefined;
  onRefresh: () => void;
  ref: Ref<ProductTableRef>;
}
const ProductTable = (props: ProductTableProps) => {
  const { refreshId, onRefresh, ref } = props;
  const { dict } = useDict();

  const [productList, setProductList] = useState<RecipeDto[]>([]);
  useEffect(() => {
    recipeListApi().then(res => {
      setProductList(res.data);
    });
  }, [refreshId]);

  const [query, setQuery] = useState<ProductPricingPageParams>({
    page: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<ProductPricingDto[]>([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    void refreshId;

    productPricingPageApi(query).then(res => {
      setData(res.data.records || []);
      setTotal(res.data.total || 0);
    });
  }, [refreshId, query]);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: ProductPricingDto | undefined;
  }>({
    open: false,
    data: undefined,
  });
  const onDelete = (item: ProductPricingDto) => {
    productPricingDeleteApi(item.id).then(() => {
      onRefresh();
      toast.success('删除成功');
    });
  };

  const columns: Column<ProductPricingDto>[] = [
    {
      title: '序号',
      field: 'index',
      width: 80,
      render: (_, index) => index + 1,
    },
    {
      title: '商品名称',
      field: 'productId',
      render: item =>
        productList.find(it => it.id === item.productId)?.name ||
        item.productId,
    },
    {
      title: '售价(元)',
      field: 'price',
      render: item => item.price,
    },
    {
      title: '收费规则应用类型',
      field: 'ruleApplicationType',
      render: item =>
        dict.rule_application_type?.find(
          it => it.value === item.ruleApplicationType,
        )?.label || item.ruleApplicationType,
    },
    {
      title: '收费规则应用起始时间',
      field: 'applyTimeStart',
      render: item => item.applyTimeStart,
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

      <ProductPricingEdit
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

export default ProductTable;
