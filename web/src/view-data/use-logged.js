import _ from 'lodash';
import { getAvatar } from '~/constants';
import { showMessage } from '~/helper';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';
import useAuth from './use-auth';

const initialState = {
  avatarFrmIsOpen: false,
  pwdFrmIsOpen: false,
  basicFrmIsOpen: false,
};

const useLogged = () => {
  const { state = initialState, dispatch } = useGlobalContext('logged');
  const { state: authState, actions: authActions } = useAuth();

  const avatarFrm = (value = false) => {
    dispatch({ payload: { avatarFrmIsOpen: value } });
  };

  const passwordFrm = (value = false) => {
    dispatch({ payload: { pwdFrmIsOpen: value } });
  };

  const basicFrm = (value = false) => {
    dispatch({ payload: { basicFrmIsOpen: value } });
  };

  const updateAvatar = async (data, actions) => {
    try {
      const formData = new FormData();
      formData.append('file', data);
      const response = await api.post('users/update-avatar', formData),
        avatar = _.get(response, 'data.avatar'),
        user = { ...authState.user, avatar: getAvatar({ avatar }) };

      authActions.updateUser(user);

      showMessage('success', 'Foto atualizada com sucesso!');
      actions.closeModal();
    } catch (error) {
      failure(error, dispatch);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const updatePassword = async (data, actions) => {
    try {
      const { name, ...rest } = data,
        user = Object.assign({ name }, rest.oldPassword ? rest : {});
      await api.put('/users/update-password', user);
      showMessage('success', 'Senha alterada com sucesso');
      actions.closeModal();
    } catch (error) {
      failure(error, dispatch);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const updateBasic = async (values, actions) => {
    try {
      await api.put('/users/update-basic', values);
      let user = { ...authState.user, name: values.name };
      authActions.updateUser(user);

      showMessage('success', 'Dados alterados com sucesso');
      actions.closeModal();
    } catch (error) {
      failure(error, dispatch);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return {
    state: {
      ...state,
    },
    actions: {
      avatarFrm,
      updateAvatar,
      passwordFrm,
      updatePassword,
      basicFrm,
      updateBasic,
    },
  };
};

const failure = (error, dispatch) => {
  dispatch({
    type: 'logged',
    payload: {
      formLoading: false,
    },
  });
  showMessage('error', error);
};

export default useLogged;
