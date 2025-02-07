import React from 'react'
import { Container, Button } from 'react-floating-action-button';
import styled from 'styled-components';
import { accent, white } from '~/components/mixins/color';

import 'font-awesome/css/font-awesome.min.css';

const Contents = styled.div`
  .fab-container {
    bottom: 0px;
    right: 0px;
    z-index: 1010;
  }
  .fab-item {
    box-shadow: 0 1px 2px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.23);
  }
  .fab-item:active, .fab-item:focus, .fab-item:hover {
    box-shadow: 0 5px 10px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }
`;

const Component = ({ anchorIcon, anchorTitle, actions }) => (
  <Contents>
    <Container>
      {actions.map((row, index) => (
        <Button
          key={index}
          tooltip={row.label}
          icon={row.icon}
          onClick={row.action}
          styles={{ backgroundColor: accent.hex(), color: white.hex() }}
          />  
      ))}
      <Button
        styles={{ backgroundColor: accent.hex(), color: white.hex() }}
        tooltip={anchorTitle}
        icon={anchorIcon || 'fa fa-plus'}
        />
    </Container>
  </Contents>
)

export default Component;
