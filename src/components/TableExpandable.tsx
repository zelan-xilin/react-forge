import { Button } from '@/components/ui/button';
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
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Key, ReactNode } from 'react';
import { Fragment, useCallback, useRef, useState } from 'react';
import type { Column } from './Table';

export interface TableExpandableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (item: T) => Key;
  footer?: ReactNode;
  caption?: ReactNode;
  extra?: ReactNode;

  expandable: {
    render: (item: T) => ReactNode;
    expandedKeys?: Key[];
    defaultExpandedKeys?: Key[];
    onExpandedKeysChange?: (keys: Key[]) => void;
  };
}

const TableExpandable = <T,>(props: TableExpandableProps<T>) => {
  const { columns, data, rowKey, footer, caption, extra, expandable } = props;
  const onExpandedKeysChangeRef = useRef(expandable.onExpandedKeysChange);

  const controlled = Array.isArray(expandable.expandedKeys);
  const [uncontrolledExpandedKeys, setUncontrolledExpandedKeys] = useState<
    Key[]
  >(expandable.defaultExpandedKeys || []);
  const expandedKeys = controlled
    ? expandable.expandedKeys!
    : uncontrolledExpandedKeys;

  const isExpanded = useCallback(
    (key: Key) => {
      return expandedKeys.includes(key);
    },
    [expandedKeys],
  );
  const setExpandedKeys = useCallback(
    (keys: Key[]) => {
      if (!controlled) {
        setUncontrolledExpandedKeys(keys);
      }

      onExpandedKeysChangeRef.current?.(keys);
    },
    [controlled],
  );
  const toggle = useCallback(
    (key: Key) => {
      setExpandedKeys(
        isExpanded(key)
          ? expandedKeys.filter(k => k !== key)
          : [...expandedKeys, key],
      );
    },
    [expandedKeys, isExpanded, setExpandedKeys],
  );

  return (
    <div className="rounded-2xl border bg-card">
      <ShadcnTable>
        <TableHeader>
          <TableRow>
            <TableHead key="__expand__" className="w-12" />

            {columns.map(column => (
              <TableHead
                key={column.field}
                style={{
                  width: column.width ? `${column.width}px` : undefined,
                }}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => {
            const key = rowKey(item);

            return (
              <Fragment key={key}>
                <TableRow>
                  <TableCell key="__expand__">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggle(key)}
                    >
                      {isExpanded(key) ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </Button>
                  </TableCell>

                  {columns.map(col => (
                    <TableCell key={col.field}>
                      {col.render(item, index)}
                    </TableCell>
                  ))}
                </TableRow>

                {isExpanded(key) && (
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={columns.length + 1}>
                      {expandable.render(item)}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}

          {data.length === 0 && (
            <TableRow className="data-no-hover">
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length + 1}>{footer}</TableCell>
            </TableRow>
          </TableFooter>
        )}

        {caption && <TableCaption>{caption}</TableCaption>}
      </ShadcnTable>

      {extra}
    </div>
  );
};

export default TableExpandable;
