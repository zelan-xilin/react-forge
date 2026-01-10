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
}
const Table = <T,>(props: TableProps<T>) => {
  const { columns, data, footer, caption } = props;

  return (
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
      </TableBody>

      {footer && (
        <TableFooter>
          <TableRow>{footer}</TableRow>
        </TableFooter>
      )}

      {caption && <TableCaption>{caption}</TableCaption>}
    </ShadcnTable>
  );
};

export default Table;
