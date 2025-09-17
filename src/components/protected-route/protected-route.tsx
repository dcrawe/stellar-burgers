import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCookie } from '@utils/cookie';

export const ProtectedRoute: FC = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(getCookie('accessToken'));

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const OnlyUnauthRoute: FC = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(getCookie('accessToken'));

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from || {
      pathname: '/'
    };

    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
