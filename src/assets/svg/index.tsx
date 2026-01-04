import { type ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import logoUrl from './logo.svg';

export const Logo = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  const { className, ...rest } = props;

  return <img alt="Logo" src={logoUrl} className={cn('size-6 inline-flex', className)} {...rest} />;
};
