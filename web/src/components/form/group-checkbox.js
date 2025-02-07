import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FieldArray, ErrorMessage } from 'formik';
import styled from 'styled-components';

const Container = styled.div `
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;

    label {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 15px;
      text-indent: -15px;
      color: #4a4c50;
      line-height: 20px;
    }
    input[type="checkbox"] {
      width: 13px;
      height: 13px;
      padding: 0;
      margin: 0 5px 0 0;
      vertical-align: bottom;
      position: relative;
      top: -1px;
      overflow: hidden;
    }
`;

const Box = styled.div `
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justifyContent || 'space-between'};
  height: ${props => props.height};
`;

const GroupCheckbox = (props) => {
  const { label, name, values, disabled, allowedValues, maxHeight = '100%' } = props;

  return (
    <Container>
      <Box height={maxHeight}>
        <FieldArray
          id={name}
          name={name}>
          {({push, remove, form}) => (
            <>
              { _.map(allowedValues, (val, index) =>
                <div key={index}>
                  <label>
                    <input
                      type="checkbox"
                      name={name}
                      disabled={disabled}
                      checked={values.includes(val)}
                      onChange={async (event) => {
                        if (event.target.checked) {
                          await push(val);
                        } else {
                          const idx = values.indexOf(val);
                          await remove(idx);
                        }
                        form.validateForm();
                      }}
                    />
                    {allowedValues[index]}
                  </label>
                </div>
              )}
            </>
          )}
        </FieldArray>
      </Box>
      <ErrorMessage name={props.name} className={"error"} component="div" />
    </Container>
  )
}

GroupCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  values: PropTypes.array.isRequired,
  allowedValues: PropTypes.array.isRequired,
}

GroupCheckbox.defaultProps = {
  hasError: false,
  values: [],
  allowedValues: []
}

export default GroupCheckbox;
