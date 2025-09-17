import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@services/store';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { setCookie } from '@utils/cookie';
import { fetchUser } from '@slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });
  const { userName, email, password } = values;
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError('');

    registerUserApi({ name: userName, email, password })
      .then((data) => {
        if (!data?.accessToken || !data?.refreshToken) {
          throw new Error('Ошибка регистрации: некорректный ответ сервера');
        }

        localStorage.setItem('refreshToken', data.refreshToken);

        setCookie('accessToken', data.accessToken);

        dispatch(fetchUser());
        navigate('/', { replace: true });
      })
      .catch((err: any) => {
        setError(err?.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
