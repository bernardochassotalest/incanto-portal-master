import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import { gray, secondary, white, tertiary } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0px;
`;

const Group = styled.div`
  display: grid;
  position: relative;
  margin: ${props => props.noMargin ? '0' : '0 0 10px'};
  width: 100%;
  min-width: 0px;

  textarea {
    font-size: ${(props) => props.inputFontSize || '14px'};
    padding: ${(props) => props.inputPadding || '22px 0 8px 10px'};
    background: ${secondary.hex()};
    border: 2px solid ${tertiary.hex()};
    border-radius: 3px;
    color: ${gray.hex()};
    transition: border-color 0.2s ease-in 0s;
    resize: none;
    height: 46px;
    min-width: 0px;

    & + label {
      font-size: ${(props) => props.labelFontSize || '70%'};
      top: ${(props) => props.labelTop || '15px'};
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      color: ${white.hex()};
      position: absolute;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
      opacity: 0.75;
    }
  }

  input {
    font-size: ${(props) => props.inputFontSize || '14px'};
    padding: ${(props) => props.inputPadding || '19px 40px 6px 10px'};
    background: ${secondary.hex()};
    border: 2px solid ${secondary.hex()};
    border-radius: 3px;
    color: ${gray.hex()};
    position: relative;
    transition: border-color 0.2s ease-in 0s;
    min-width: 0px;

    & + label {
      font-size: ${(props) => props.labelFontSize || '70%'};
      top: ${(props) => props.labelTop || '15px'};
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      color: ${white.hex()};
      position: absolute;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
      opacity: 0.75;
    }
  }
`;

const hasVal = (val) => {
  return !_.isUndefined(val) && !_.isNull(val) && val !== '';
};

const InputLabel = ({ label, value, rows, noMargin, inputPadding, inputFontSize, labelFontSize, labelTop }) => (
  <Container>
    <Group
      noMargin={noMargin}
      inputPadding={inputPadding}
      inputFontSize={inputFontSize}
      labelFontSize={labelFontSize}
      labelTop={labelTop}>
      { rows ?
        <textarea
          placeholder={label}
          value={hasVal(value) ? value : ''}
          disabled={true}
          />
        :
        <input
          type="text"
          placeholder={label}
          value={hasVal(value) ? value : ''}
          disabled={true}
        />
      }
      <label htmlFor={label}>{label}</label>
    </Group>
  </Container>
);

InputLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default InputLabel;
