import { ChangeEvent } from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = Omit<PageUIProps, 'setEmail'> & {
  password: string;
  userName: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
