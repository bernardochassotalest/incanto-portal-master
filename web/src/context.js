import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useImmerReducer } from 'use-immer';

export const globalContext = React.createContext();

const getLocalStorage = (name) => {
  if (!name) return {};
  let storage = localStorage.getItem(name);
  return storage !== null ? JSON.parse(storage) : {};
};

const persist = (name, { persistent = false, type, payload }) => {
  if (!name || !persistent) return;
  const retrieved = getLocalStorage(name);
  retrieved[type] = payload;
  localStorage.setItem(name, JSON.stringify(retrieved));
};

const AppProvider = (props) => {
  const [data] = useState(() => {
    return getLocalStorage(props.name);
  });

  const reducer = (draft, action) => {
    persist(props.name, action);
    const { merge, type, payload } = action,
      current = draft[type] || {};
    draft[action.type] = merge ? _.merge(current, payload) : {...current, ...payload};
    return draft;
  };

  const [state, dispatch] = useImmerReducer(reducer, data),
  contextValue = useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <globalContext.Provider value={contextValue}>
      {props.children}
    </globalContext.Provider>
  );
};

AppProvider.propTypes = {
  name: PropTypes.string.isRequired,
};

export { AppProvider };

