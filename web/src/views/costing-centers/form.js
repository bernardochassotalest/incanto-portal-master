import React from 'react';
import { FormContainer } from '~/views/costing-centers/styles';
import { InputGroup } from '~/components/form';

export const CostingCenterForm = ({ values, errors, touched, previewMode }) => {

  return (
    <FormContainer>
      <InputGroup
        type="text"
        name="ocrCode"
        label="Código"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.ocrCode && touched.ocrCode} />

      <InputGroup
        type="text"
        name="ocrName"
        label="Nome"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.ocrName && touched.ocrName} />
    </FormContainer>
  );
};
