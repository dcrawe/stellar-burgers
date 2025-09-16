import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '@services/store';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { setCookie } from '@utils/cookie';
import { fetchUser } from '@slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { email, password } = values;
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    loginUserApi({ email, password })
      .then((data) => {
        if (!data?.accessToken || !data?.refreshToken) {
          throw new Error('Ошибка авторизации: некорректный ответ сервера');
        }

        localStorage.setItem('refreshToken', data.refreshToken);

        setCookie('accessToken', data.accessToken);

        dispatch(fetchUser());

        const from = (location.state as { from?: Location })?.from || {
          pathname: '/'
        };

        navigate(from, { replace: true });
      })
      .catch((err: any) => {
        setError(err?.message || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
