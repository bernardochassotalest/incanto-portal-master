import React from 'react';
import _ from 'lodash';
import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { parseISO, isValid } from 'date-fns';
import DateFnsUtils from '~/components/form/input-date/date-utils';
import { accent, white, red, gray, secondary, tertiary } from '~/components/mixins/color';
import ptBrLocale from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Group = styled.div`
  display: grid;
  position: relative;
  margin: 0 0 10px;

  & > svg {
    position: absolute;
    right: 15px;
    align-self: center;
    color: #555;
  }

  &:focus-within > input {
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

  .date-time-picker {
    background: ${secondary.hex()};
    border: 2px solid ${(props) => props.hasError ? red.hex() : tertiary.hex()};
    border-radius: 4px;
    padding: 22px 0 8px 10px;
    transition: border-color 0.2s ease-in 0s;
    &:disabled {
      opacity: 0.75;
    }
    &:focus + label,
    &:not([value=""]) + label {
      font-size: 70%;
      transform: translate3d(0, -100%, 0);
      opacity: 1;
      top: 20px;
    }
    & + label {
      position: absolute;
      top: 15px;
      padding-left: 10px;
      transition: all 200ms;
      color: ${gray.hex()};
    }
  }
`;


const theme = createMuiTheme({
  palette: {
    primary: {
      main: accent.hex(),
      contrastText: white.hex()
    }
  },
  shadows: Array(25).fill('none'),
  overrides: {
    MuiInput: {
      input: {
        border: 'none',
        color: gray.hex(),
        margin: '0',
        padding: '0',
        height: '16px',
        fontSize: '14px',
        fontFamily: 'Roboto',
      },
    },
    MuiIconButton: {
      root: {
        padding: '10px'
      }
    },
    MuiSvgIcon: {
      root: {
        width: '20px',
        height: '20px'
      }
    }
  }
});

const getValue = (value) => {
  if (_.isDate(value) && !_.isString(value)) {
    return value;
  }
  return value && _.isString(value) ? parseISO(value) : null;
};

const isValidDate = (value, withTime, b ,c) => {
  let val = getValue(value);
  return !value || (val && isValid(val));
};

const InputDate = ({ name, label = '', required, disabled, hideErrorLabel, monthMode, withTime, hasError, className, ...rest }) => {

  let Picker = withTime ? KeyboardDateTimePicker : KeyboardDatePicker,
    format = withTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy',
    views = undefined;

  if (monthMode) {
    format = 'MM/yyyy';
    views = [ 'year', 'month' ];
  }

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider locale={ptBrLocale} utils={DateFnsUtils}>
        <Container>
          <Field type="text" id={name} name={name}>
            {({ field }) => (
              <Group required={required} hasError={hasError || !isValidDate(field.value, withTime)}>
                <Picker
                  value={getValue(field.value)}
                  helperText=""
                  views={views}
                  format={format}
                  className="date-time-picker"
                  autoOk={!withTime}
                  ampm={false}
                  disabled={disabled}
                  placeholder={label}
                  InputProps={{ disableUnderline: true }}
                  onChange={(value) => {
                    rest.onChange && rest.onChange(value);
                    field.onChange({ target: { value, name }})
                  }}
                  />
                {field.value && <label htmlFor={name}>{label}{required ? ' (*)' : ''}</label>}
              </Group>
            )}
          </Field>
          {!hideErrorLabel && <ErrorMessage name={name} className='error' component='div' /> }
        </Container>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

InputDate.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasError: PropTypes.bool,
};

InputDate.defaultProps = {
  hasError: false,
};

export default InputDate;
