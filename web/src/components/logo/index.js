import React from 'react';
import styled from 'styled-components';
import logo from '~/assets/logo.svg';
import PropTypes from 'prop-types';

const BaseImage = styled.img`
    height: ${(props) => props.height || '55px'};
    border: none;
    user-select: none;
    pointer-events: none;
  `

const Image = ({ height }) => <BaseImage src={logo} height={height} alt="logo"></BaseImage>

Image.propTypes = {
  height: PropTypes.string
}

export default Image;
