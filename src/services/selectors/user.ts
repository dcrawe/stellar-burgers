import { RootState } from '../store';
import { TUser } from '@utils-types';

export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectUserName = (state: RootState): string =>
  state.user.user?.name || '';
