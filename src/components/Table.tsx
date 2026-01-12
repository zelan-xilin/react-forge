import {
  Table as ShadcnTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ReactNode } from 'react';
import Pagination from './Pagination';

export interface Column<T> {
  title: string;
  field: string;
  width?: number;
  render: (item: T, index: number) => ReactNode;
}
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  footer?: ReactNode;
  caption?: ReactNode;
  extra?: ReactNode;
}
interface TableExtraProps {
  dataLength: number;
  total: number;
  query?: {
    page: number;
    pageSize: number;
  };
  setQuery?: (query: { page: number; pageSize: number }) => void;
}

const TableExtra = (props: TableExtraProps) => {
  const { dataLength, total, query, setQuery } = props;

  return (
    <div className="flex justify-between items-center gap-4 px-6 py-4 text-muted-foreground border-t font-medium text-xs">
      <div className="flex-none">
        显示&nbsp;{dataLength}&nbsp;条，共&nbsp;{total}&nbsp;条记录
      </div>

      {query && setQuery && (
        <div className="flex-1">
          <Pagination
            total={total}
            current={query.page}
            pageSize={query.pageSize}
            onChange={(page, pageSize) => setQuery({ page, pageSize })}
          />
        </div>
      )}
    </div>
  );
};

const Table = <T,>(props: TableProps<T>) => {
  const { columns, data, footer, caption, extra } = props;

  return (
    <div className="rounded-2xl border bg-card">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={column.field}
                style={{ width: column.width ? `${column.width}px` : 'auto' }}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column.field}>{column.render(item, index)}</TableCell>
              ))}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow className="data-no-hover">
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>{footer}</TableCell>
            </TableRow>
          </TableFooter>
        )}

        {caption && <TableCaption>{caption}</TableCaption>}
      </ShadcnTable>

      {extra}
    </div>
  );
};

export { TableExtra };
export default Table;
