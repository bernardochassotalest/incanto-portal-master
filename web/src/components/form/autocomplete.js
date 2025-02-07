import { Field } from 'formik';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { components } from 'react-select';
import ReactSelect from 'react-select/async';
import styled from 'styled-components';
import { accent, gray, secondary, white } from '~/components/mixins/color';

const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 0 0 10px;
  flex-direction: column;

  > div {
    width: 100%;
  }
`;

const Group = styled.div`
  display: grid;
  position: relative;
  width: 100%;

  & > label {
    font-size: 70%;
    transform: translate3d(0, -100%, 0);
    color: ${gray.hex()};
    position: absolute;
    top: 15px;
    padding-left: 10px;
    transition: all 200ms;
    opacity: 0.75;
    font-weight: ${(props) => props.required ? '800' : '400'};
  }
`;

/*

  Para mais opções suportadas acesse:
  https://react-select.com/props

*/

const parseValue = (props, row) => {
  if (!row) {
    return {};
  }
  return {
    ...row,
    value: _.get(row, props.keyField),
    label: props.valueFormat(row),
  };
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <FaSearch style={{ color: props.isFocused ? accent.hex() : gray.hex() }} />
    </components.DropdownIndicator>
  );
};

const Autocomplete = (props) => {
  let baseValue = props.value;

  if (!props.multiple) {
    if (_.isArray(props.value)) {
      baseValue = _.map(props.value, (r) => parseValue(props, r));
    } else {
      baseValue = parseValue(props, props.value);
    }
  }

  if (_.isEmpty(props.value)) {
    baseValue = undefined;
  }

  function loadOptions(q, callback) {
    let options = [];

    if (!props.minLength || _.size(q) >= props.minLength) {
      props.loadData(q, (response = []) => {
        _.each(response, (row) => {
          options.push(parseValue(props, row));
        });
        callback(options);
      });
    }
  }

  const noOptionsMessage = (elem) => {
    let length = _.size(_.get(elem, 'inputValue'));

    if (length === 0) {
      return props.tipText;
    }
    return length < props.minLength ? props.minLengthText : props.notFoundText;
  };

  const handleOnChange = useCallback((form, field) => (value) => {
    if (props.onChange) {
      props.onChange(value);
    } else {
      form.setFieldValue(field.name, value);
    }
  // eslint-disable-next-line
  }, [props]);

  const handleOnBlur = useCallback((form, field) => (event) => {
    if (props.onBlur) {
      props.onBlur(event);
    } else {
      form.handleBlur(field.name)(event);
    }
    // eslint-disable-next-line
  }, [props]);

  const getColorBorder = (isFocused, isSelected, isDisabled) => {
    const isError = props.hasError;
    let color = (isFocused || isSelected) && !isDisabled ? accent.hex() : secondary.hex();
    if (isError) {
      color = 'red';
    }
    return color;
  };

  const customStyles = {
    control: (base, { isFocused, isSelected, isDisabled }) => ({
      ...base,
      transition: 'border-color 0.2s ease-in 0s',
      border: `2px solid ${getColorBorder(isFocused, isSelected, isDisabled)}`,
      boxShadow: 'none',
      height: '46px',
      background: secondary.hex(),
      opacity: isDisabled ? 0.75 : 1,
      color: 'white',
      borderRadius: '3px',
      '&:focus': {
        borderColor: accent.hex(),
      },
      '&:hover': {
        borderColor: accent.hex(),
      },
    }),
    multiValue: (base, state) => ({
      ...base,
      background: accent.hex(),
      color: white.hex(),
      '> div': {
        color: white.hex()
      }
    }),
    valueContainer: (base, state) => ({
      ...base,
      marginTop: '10px',
    }),
    singleValue: (base, state) => ({
      ...base,
      color: gray.hex(),
      paddingTop: '8px',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      margin: '0 !important',
      width: '2px',
      backgroundColor: secondary.hex(),
    }),
    clearIndicator: (base, { isFocused, isSelected }) => ({
      ...base,
      color: isFocused || isSelected ? accent.hex() : gray.hex(),
    }),
    menuPortal: (base, state) => ({
      ...base,
      zIndex: '5'
    }),
    menu: (base, state) => ({
      ...base,
      zIndex: '1305',
      borderRadius: '3px',
      marginTop: '3px',
      borderColor: accent.hex(),
    }),
    menuList: (provided, state) => ({
      ...provided,
      zIndex: '1307',
      padding: 0,
      backgroundColor: secondary.hex(),
    }),
    option: (base, { data, isDisabled, isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isFocused || isSelected ? accent.hex() : 'transparent',
      color: isFocused || isSelected ? white.hex() : gray.hex(),
      '&:hover': {
        background: accent.fade(0.25).string()
      }
    }),
  };

  return (
    <>
      <Container>
        <Field id={props.id} name={props.name}>
          {({ field, form }) => (
            <Group required={props.required}>
              <ReactSelect
                name={props.name}
                key={props.keyApp || `${new Date().getTime()}`}
                autosize={false}
                defaultOptions={true}
                isMulti={props.multiple}
                loadOptions={loadOptions}
                debounceTimeout={200}
                value={baseValue || ''}
                menuPortalTarget={document.body}
                onChange={handleOnChange(form, field)}
                onBlur={handleOnBlur(form, field)}
                styles={customStyles}
                ref={props.innerRef}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary50: accent.fade(0.5).string(),
                  },
                })}
                components={{ DropdownIndicator }}
                isDisabled={props.disabled}
                isClearable={true}
                noOptionsMessage={noOptionsMessage}
                placeholder={props.required ? `${props.label} (*)` : props.emptyText}
                loadingMessage={() => props.loadingText}
              />
              {baseValue && <label htmlFor={props.name}>{props.label}{props.required ? ' (*)' : ''}</label>}
            </Group>
          )}
        </Field>
      </Container>
    </>
  );
};

Autocomplete.propTypes = {
  label: PropTypes.string,
  loadData: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
};

Autocomplete.defaulValues = {
  hasError: false,
};

export default Autocomplete;
