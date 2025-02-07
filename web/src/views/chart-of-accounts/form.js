import React from 'react';
import { FormContainer } from '~/views/chart-of-accounts/styles';
import { ChartOfAccountTypesMapping } from '~/constants';
import { InputGroup, InputLabel } from '~/components/form';

export const ChartOfAccountForm = ({ values, errors, touched, previewMode }) => {

  return (
    <FormContainer>
      <InputGroup
        type="text"
        name="acctCode"
        label="Código"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.acctCode && touched.acctCode} />

      <InputGroup
        type="text"
        name="acctName"
        label="Nome"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.acctName && touched.acctName} />

      <InputLabel
        label="Tipo"
        value={ChartOfAccountTypesMapping[values.accountType] || values.accountType || ''} />
    </FormContainer>
  );
};
