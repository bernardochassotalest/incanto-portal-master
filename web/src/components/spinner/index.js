import React from 'react';
import wave from '~/assets/wave.svg';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: transparent;
`;

export default function Spinner({ ...props }) {
  if (!props.visible) return null;
  const size = props.size || 20;

  return (
    <Container>
      <img
        src={wave}
        style={{ width: size, height: size, border: 'none', alignSelf: 'center' }}
        alt=''
      />
    </Container>
  );
}
