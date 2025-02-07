import React, { useEffect } from 'react';
import styled from 'styled-components';

import useHeader from '~/view-data/use-header';
import logoImg from '~/assets/logo.svg';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  img {
    height: 150px;
    opacity: 0.75;
  }
`;

function Home() {
  const { actions } = useHeader({ useFilter: false });

  useEffect(() => {
    actions.configure({
      title: '',
      count: 'none',
      useFilter: false,
      onSearch: null
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <img src={logoImg} alt='logo' />
    </Container>
  );
}

export default Home;
