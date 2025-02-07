import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import search from '~/assets/search.svg';
import useEventListener from '~/hooks/use-event-listener';
import { accent, primary } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;

  input {
    width: ${props => props.term ? '100%' : '36px'};
    height: 36px;
    border: none;
    padding: 5px 23px 5px 10px;
    border-radius: 3px;
    font-size: 10pt;
    color: #111;
    background: ${primary.hex()} url(${search}) no-repeat ${props => props.term ? '92%' : '10px'} center;
    box-shadow: 0 0 1.5px #999;
    border: 1px solid ${primary.hex()};

    -webkit-transition: background .45s ease;
    -moz-transition: background .45s ease;
    -ms-transition: background .45s ease;
    -o-transition: background .45s ease;
    transition: background .45s ease;

    &:hover {
      cursor: pointer;
      border: 1px solid ${accent.hex()};
    }

    &:focus {
      outline: none;
      width: 100%;
      background: #f8f8f8 url(${search}) no-repeat 92% center;
      cursor: text;
    }

    &::-webkit-input-placeholder {
      color: #222;
    }

    &:-moz-placeholder {
      color: #222;
    }

    &::-moz-placeholder {
      color: #222;
    }

    &:-ms-input-placeholder {
      color: #222;
    }

    img {
      height: 44px;
      width: 45px;
      border-radius: 50%;
      margin: 0 15px;
    }
  }
`;

function InputSearch({onSearch, incrementalSearch, ...rest}) {
    const [ term, setTerm ] = useState('');
    const inputRef = useRef(null);

    useEventListener({ name :'keydown', handler: onKeyDown, elementId: 'incanto-search-box'});
    useEventListener({ name :'keydown', handler: onKeyDownGlobal });

    useEffect(() => {
      if (incrementalSearch && term && term.length > 0) {
        onSearch(term);
      }
    }, [term, incrementalSearch, onSearch]);

    function handleChange(e) {
      setTerm(e.target.value);
    }

    function onKeyDown(event) {
      const charCode = event.which || event.keyCode;

      if (charCode === 27) {
        setTerm('');
        onSearch('');
        event.target.blur();
      }

      if (charCode === 13) {
        onSearch(event.target.value);
        event.target.focus();
      }
    }

    function onKeyDownGlobal(event) {
      const charCode = event.which || event.keyCode;
      if (charCode === 113) {
        inputRef && inputRef.current && inputRef.current.focus();
      }
    }

    return (
      <Container term={term}>
        <input
          id='incanto-search-box'
          type='text'
          ref={inputRef}
          value={term}
          onChange={handleChange}
          {...rest}
        />
      </Container>
    )
}


InputSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

InputSearch.defaultProps = {
  placeholder: 'Pesquisa...'
}

export default memo(InputSearch);
