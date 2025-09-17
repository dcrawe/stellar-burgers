import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { selectUser } from '@selectors/user';
import { updateUser } from '@slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { values, handleChange, setValues } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    if (!user) return;

    setValues((prev) => {
      if (
        prev.name === (user.name ?? '') &&
        prev.email === (user.email ?? '')
      ) {
        return prev;
      }

      return {
        ...prev,
        name: user.name ?? '',
        email: user.email ?? ''
      };
    });
  }, [user?.name, user?.email, setValues]);

  const isFormChanged =
    values.name !== (user?.name ?? '') ||
    values.email !== (user?.email ?? '') ||
    !!values.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const payload: { name?: string; email?: string; password?: string } = {};

    if (values.name !== (user?.name ?? '')) payload.name = values.name;
    if (values.email !== (user?.email ?? '')) payload.email = values.email;
    if (values.password) payload.password = values.password;
    if (Object.keys(payload).length) {
      dispatch(updateUser(payload));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setValues({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
