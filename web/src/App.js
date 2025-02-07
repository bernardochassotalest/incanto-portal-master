import React from 'react';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from '~/context';
import Routes from '~/routes';
import history from '~/services/history';
import GlobalStyle from '~/styles/global';

function App() {
  return (
    <Router history={history}>
      <AppProvider name='incanto'>
        <Routes />
      </AppProvider>
      <GlobalStyle />
      <ToastContainer autoClose={2000} />
    </Router>
  );
}

export default App;
