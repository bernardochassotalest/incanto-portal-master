import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import arrow from '~/assets/arrow.svg';
import { accent, gray, secondary, tertiary } from '~/components/mixins/color';

const Group = styled.div`
  display: grid;
  position: relative;
  margin: 0 0 10px;

  &:focus-within > select {
    border-color: ${accent.hex()};
  }

  &:focus-within > svg {
    color: ${accent.hex()};
  }

  ${(props) => props.required && css`
    label {
      font-weight: 800;
    }
  `};

  select {
    height: 48px;
    padding: 18px 0 5px 10px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    height: 46px;
    color: ${gray.hex()};
    background: ${secondary.hex()} url(${arrow});
    background-repeat: no-repeat, repeat;
    background-position: right 1.5em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
    border: 2px solid ${tertiary.hex()};
    border-radius: 3px;

    &:disabled {
      opacity: 0.75;
    }

    &:focus + label,
    &:not([value='']) + label {
      font-size: 70%;
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      top: 20px;
      position: absolute;
    }
    &:not([value='']) + label {
      color: ${gray.hex()};
    }
    & + label {
      font-size: 70%;
      top: 13px;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
      opacity: 0.75;
    }
  }
`;

const Select = ({ name, label, hasError, required, hideErrorLabel, hideLabel, options, ...rest }) => {
  const OptionDefault = ({ defaults }) => {
    const { value, label } = defaults;
    if (!value && !label) return null;
    return (
      <option value={value} key={value}>
        {label}
      </option>
    );
  };

  const Options = ({ values }) =>
    values.map((opt, index) => (
      <option value={opt.value} key={index}>
        {opt.label}
      </option>
    ));

  let labelText = (required) ? `${label} (*)` : label;

  return (
    <>
      <Group required={required}>
        <Field
          as="select"
          id={name}
          name={name}
          className={!!hasError ? "error" : ""}
          {...rest}
          placeholder={labelText}
        >
          {options.defaults && <OptionDefault defaults={options.defaults} />}
          <Options values={options.values} />
        </Field>
        {!hideLabel && <label htmlFor={name}>{labelText}</label>}
        {!hideErrorLabel && <ErrorMessage name={name} className="error" component="div" />}
      </Group>
    </>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  options: PropTypes.shape({
    defaults: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    values: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Select;

/*
  Exemplo de uso

  <Select
    name="profile"
    hasError={errors.profile && touched.profile}
    label="Perfil"
    options={
      {
        defaults: {value: "", label: "Selecione um perfil"},
        values: Object.keys(PROFILES).map(key => ({"value": key, "label": PROFILES[key]}))
      }
    }
    />
*/
