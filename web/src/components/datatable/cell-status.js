import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
  width: 100%;
  pointer-events: none;

  .cell-contents {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 20px);
  }
`;

const Square = styled.div`
  background: ${props => props.color};
  width: 10px;
  height: 10px;
  margin-right: 10px;
  padding: 0 !important;
`;

function CellStatus({ color, title, children }) {
  return (
    <Container title={title}>
      <Square color={color} />
      <div className="cell-contents">
        {children}
      </div>
    </Container>
  );
}

CellStatus.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

export default CellStatus;