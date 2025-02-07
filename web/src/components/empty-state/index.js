import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import noDataImg from '~/assets/no-data.svg';
import { gray } from '~/components/mixins/color';

const IconPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.iconColor};
  margin-bottom: 25px;
  width: 159px;
  height: 159px;
  svg {
    width: ${(props) => props.iconSize + 'px'};
    height: ${(props) => props.iconSize + 'px'};
  }
`;

const Container = styled.div`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 60px);

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    opacity: 0.9;
    user-select: none;
    pointer-events: none;
  }

  img {
    width: 70%;
    border: none;
    margin: 40px;
    opacity: 1;
  }

  h3 {
    color: ${gray.fade(0.6).string()} !important;
    font-size: 20px !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
`;

function EmptyState(props) {
  const { size = '100px' } = props;

  if (!props.visible) {
    return null;
  }
  return (
    <Container visible={props.visible} size={size}>
      {
        !props.Icon ?
        <div className='circle'>
          <img src={noDataImg} alt='logo' title={size} />
        </div>
        :
        <IconPanel {...props}>
          <props.Icon />
        </IconPanel>
      }
      <h3>{props.text}</h3>
    </Container>
  );
}

EmptyState.propTypes = {
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};

EmptyState.defaultProps = {
  text: '',
  visible: false,
};

export default EmptyState;
