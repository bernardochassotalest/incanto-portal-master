import { getAvatar } from '~/constants';
import { showMessage } from '~/helper';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';

const initialState = {
  isLoginMode: true,
  loginData: {}
};

function useAuth() {
  const history = useHistory(),
    { state: { auth = initialState }, dispatch } = useGlobalContext();

  const changeLoginMode = (isLoginMode) => {
    dispatch({ type: 'auth', payload: { isLoginMode, loginData: {} } });
  };

  const loginSubmit = async (params, action) => {
     try {
      const { data } = await api.post('auth/login', params);
      await loginSuccess(data);
    } catch (error) {
      action && action.setSubmitting(false);
      failure(error);
    }
  };

  const forgetPasswordSubmit = async (data, action) => {
    try {
      await api.post('auth/forget-password', data);

      showMessage('success', 'Senha redefinida com sucesso, verifique a caixa de entrada do seu email!');
      action.setSubmitting(false);
      changeLoginMode(true);
    } catch (error) {
      action && action.setSubmitting(false);
      failure(error);
    }
  };

  const getGravatarImage = async ({ email }) => {
    let response = await api.get('users/avatar', { params: { email } });
    return _.get(response, 'data.base64');
  };

  const loginSuccess = async ({ token, me, menu }) => {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    let avatarBase64 = await getGravatarImage(me);
    me.avatar = getAvatar({ ...me, avatarBase64 });

    dispatch({
      type: 'auth',
      persistent: true,
      payload: {
        signed: true,
        user: me,
        token: token,
        menu: menu,
      },
    });
    history.push('/home');
  };

  const failure = (error) => {
    dispatch({
      type: 'auth',
      payload: {
        signed: false,
        isLoginMode: true,
      },
    });
    showMessage('error', error)
  };

  const logout = () => {
    dispatch({
      type: 'auth',
      persistent: true,
      payload: {
        signed: false,
        token: null,
        menu: null,
        user: null,
        isLoginMode: true
      },
    });
    history.push('/');
    window.location.reload(true);
  };

  const updateUser = (user) => {
    dispatch({ type: 'auth', payload: { user, persistent: true } });
  };

  return {
    state: {
      ...auth,
    },
    actions: {
      changeLoginMode,
      logout,
      updateUser,
      loginSubmit,
      forgetPasswordSubmit,
    },
  };
}

export default useAuth;
