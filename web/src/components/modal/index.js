import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MdClose } from 'react-icons/md';
import { Background, Title, Container, Content, Footer, FullscreenToggle, CloseButton } from './styles';
import Button from '~components/button';

function Modal({ open, title, onClose, actions, positive, negative, background, width, height, noPadding, hideClose, allowFullscreen, children }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  function handleClose() {
    setIsFullscreen(false);
    onClose();
  };

  function handleIsFullscreen() {
    setIsFullscreen(!isFullscreen);
  };

  function buildActions(actions) {
    if (_.isEmpty(actions)) {
      return null;
    }
    return (_.map(actions, ({ label, action, type = 'button', disabled = false, primary = false}, index) => (
        <Button key={index} type={type} disabled={disabled} primary={primary} onClick={action}>
          {label}
        </Button>
      )));
  };

  function build() {
    if (!open) return null;

    return (
      <Background isOpen={open}>
        <Container
          fullscreen={isFullscreen}
          height={height}
          width={width}
          >
          {!hideClose &&
            <CloseButton onClick={handleClose}>
              <MdClose />
            </CloseButton>
          }
          {allowFullscreen === true && (
            <FullscreenToggle
              fullscreen={isFullscreen.toString()}
              onClick={handleIsFullscreen}
            />
          )}
          <Title>{title}</Title>
          <Content
            background={background}
            noPadding={noPadding}
            hasHeader={hideClose && !title}
            hasFooter={!_.isEmpty(actions)}
            >
            {children}
          </Content>
          <Footer>
            {buildActions(actions)}
          </Footer>
        </Container>
      </Background>
    );
  }
  return ReactDOM.createPortal(build(), document.body);
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  allowFullscreen: PropTypes.bool,
  hideClose: PropTypes.bool,
  title: PropTypes.node,
  actions: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string
};

Modal.defaultProps = {
  open: false,
  allowFullscreen: false,
  hideClose: false,
  actions: [],
  width: '80vw',
  height: '80vh'
};

export default Modal;
