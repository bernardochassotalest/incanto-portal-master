import React from 'react';
import ReactDOM from 'react-dom';
import { Background, Container, Title, Content, Footer } from '~/components/confirm/styles';
import Button from '~/components/button';

class Confirm extends React.Component {
  state = {
    isOpen: false,
    confirmProps: {}
  };

  resolve = null;

  static create(props = {}) {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return ReactDOM.render(<Confirm confirmProps={props} />, el);
  }

  handleNo = () => {
    this.setState({ isOpen: false });
    this.resolve(false);
  };

  handleYes = () => {
    this.setState({ isOpen: false });
    this.resolve(true);
  };

  show = (props = {}) => {
    if ((props.height && isNaN(props.height)) || (props.width && isNaN(props.width))) {
      throw new Error('width and height must be numeric!')
    }
    const confirmProps = { ...this.props.confirmProps, ...props };
    this.setState({ isOpen: true, confirmProps });
    return new Promise(res => {
      this.resolve = res;
    });
  };

  render() {
    const { isOpen, confirmProps } = this.state,
      { title, text, width = 400, height = 100, noText = 'Não', yesText = 'Sim' } = confirmProps

    if (!isOpen) {
      return null;
    }
    return (
      <Background isOpen={isOpen}>
        <Container height={height > window.innerHeight ? '90%' : `${height}px`} width={width > window.innerWidth ? '90%' : `${width}px`}>
          <Title>{title}</Title>
          <Content>{text}</Content>
          <Footer>
            <Button onClick={this.handleNo}>
              {noText}
            </Button>

            <Button primary={true} onClick={this.handleYes}>
              {yesText}
            </Button>
          </Footer>
        </Container>
      </Background>
    );
  }
}

export default Confirm;
