import React from 'react';
import { FormContainer } from '~/views/projects/styles';
import { InputGroup } from '~/components/form';

export const ProjectForm = ({ values, errors, touched, previewMode }) => {

  return (
    <FormContainer>
      <InputGroup
        type="text"
        name="prjCode"
        label="Código"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.prjCode && touched.prjCode} />

      <InputGroup
        type="text"
        name="prjName"
        label="Nome"
        required={true}
        maxLength={100}
        autoFocus
        disabled={previewMode}
        hasError={errors.prjName && touched.prjName} />
    </FormContainer>
  );
};
