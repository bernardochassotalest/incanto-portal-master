import { useContext } from 'react';
import _ from 'lodash';
import { globalContext } from '~/context';

export default (type) => {
  const [state, dispatch] = useContext(globalContext);

  const gainState = type ? _.get(state, type) : state;
  const goalDispatch = type
    ? (actionData: ActionData) => dispatch({ ...actionData, type })
    : dispatch;

  return {
    state: gainState,
    dispatch: goalDispatch,
  };
};