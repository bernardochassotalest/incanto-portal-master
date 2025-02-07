import React, { useEffect } from 'react';
import { Container } from './styles';
import useHeader from '~/view-data/use-header';

function Forbidden() {
  const { actions } = useHeader({ useFilter: false });

  useEffect(() => {
    actions.configure({ title: '', count: 'none', useFilter: false, onSearch: null });
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <h1>403</h1>
      <p>Você não tem permissão para acessar essa página!</p>
    </Container>
  );
}

export default Forbidden;
