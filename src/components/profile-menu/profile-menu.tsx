import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { deleteCookie } from '@utils/cookie';
import { useDispatch } from '@services/store';
import { clearUser } from '@slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutApi()
      .catch(() => null)
      .finally(() => {
        deleteCookie('accessToken');

        localStorage.removeItem('refreshToken');

        dispatch(clearUser());
        navigate('/login', { replace: true });
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
