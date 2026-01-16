import { matchPath } from 'react-router';

/**
 * 判断路径是否完全匹配
 */
export const isExactPathMatch = (
  pattern: string,
  pathname: string,
  end = true,
) => {
  return matchPath({ path: pattern, end }, pathname) !== null;
};

/**
 * 拼接路径
 */
export const joinPaths = (parent: string, child: string) => {
  if (!parent) {
    return child.startsWith('/') ? child : `/${child}`;
  }
  if (child.startsWith('/')) {
    return child;
  }

  return `${parent.replace(/\/+$/, '')}/${child.replace(/^\/+/, '')}`;
};
