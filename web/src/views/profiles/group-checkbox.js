import { ErrorMessage, FieldArray } from 'formik';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Fieldset from '~/components/fieldset';
import { secondary } from '~/components/mixins/color';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .group {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 2px 5px;
    border-top: 1px dotted ${secondary.hex()};
  }
  .group-gray {
    background: transparent;
  }

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
  .permissions {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 50%;
    justify-content: flex-end;
    label {
      margin-left: 15px;
    }
  }
`;

const Box = styled.div`
  overflow-y: auto;
  height: ${props => props.height};
`;

const GroupCheckbox = ({ label, name, values, allowedValues, permsNames, disabled, maxHeight = '100%' }) => {

  let resources = _.map(_.filter(values, (r) => !_.isEmpty(r.code)), (r) => {
      const allowedPerms = _.get(_.find(allowedValues, a => a.code === r.code), 'permissions') || [];
      return {
        code: r.code,
        perms: _.intersection(r.perms, allowedPerms)
      };
    });

  return (
    <Container>
      <Fieldset label={label}>
        <Box height={maxHeight}>
          <FieldArray id={name} name={name}>
            {({ form }) => (
              <div>
                {_.map(allowedValues, (rule, index) => (
                  <div
                    className={`group ${index % 2 !== 0 ? '' : 'group-gray'}`}
                    key={index}
                  >
                    <label>
                      <input
                        type="checkbox"
                        disabled={disabled}
                        name={`${name}.${index}`}
                        checked={!!_.find(resources, { code: rule.code })}
                        onChange={async event => {
                          let valuesRef = _.cloneDeep(resources);
                          if (event.target.checked) {
                            valuesRef.push({ code: rule.code, perms: rule.permissions || [] });
                          } else {
                            valuesRef = _.filter(valuesRef, r => r.code !== rule.code);
                          }
                          form.setFieldValue(name, valuesRef);
                          form.validateForm();
                        }}
                      />
                      {rule.label}
                    </label>
                    <FieldArray>
                      {({ push, remove, form }) => (
                        <div className="permissions">
                          {_.map(rule.permissions, (perm, pIndex) => (
                            <label key={pIndex}>
                              <input
                                type="checkbox"
                                disabled={disabled}
                                checked={(_.get(_.find(resources, { code: rule.code }), `perms`) || []).includes(perm)}
                                onChange={async event => {
                                  const idxParent = _.findIndex(resources, { code: rule.code });
                                  let valuesRef = _.cloneDeep(resources);

                                  if (idxParent >= 0) {
                                    valuesRef[idxParent].perms = valuesRef[idxParent].perms || [];

                                    if (event.target.checked) {
                                      valuesRef[idxParent].perms.push(perm);
                                    } else {
                                      valuesRef[idxParent].perms = _.filter(valuesRef[idxParent].perms, r => r !== perm);
                                    }
                                    form.setFieldValue(name, valuesRef);
                                    form.validateForm();
                                  }
                                }}
                              />
                              {permsNames[perm] || perm}
                            </label>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
        </Box>
      </Fieldset>
      <ErrorMessage name={name} className={"error"} component="div" />
    </Container>
  );
};

GroupCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  values: PropTypes.array.isRequired,
  allowedValues: PropTypes.array.isRequired
};

GroupCheckbox.defaultProps = {
  hasError: false,
  values: [],
  allowedValues: {}
};

export default GroupCheckbox;
