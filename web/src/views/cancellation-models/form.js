import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { formats } from '~/helper';
import { InputGroup, Select } from '~/components/form';
import { FormContainer } from '~/views/cancellation-models/styles';

export const CancellationModelForm = ({ errors, touched, tags, values, previewMode, setFieldValue }) => {

  return (
    <FormContainer>
      <InputGroup
        type='text'
        name='name'
        label='Nome'
        disabled={previewMode}
        hasError={errors.name && touched.name}
        />

      <Select
        name="tag"
        label="Tag"
        options={{ values: [
            { value: '', label: 'Escolha' },
            ..._.map(tags, (value) => ({ value, label: formats.capitalize(value) }))
          ],
        }}
        />

    </FormContainer>
  );
};

export const CancellationModelSchema = Yup.object().shape({
  name: Yup.string().required('Informe o nome'),
  tag: Yup.string().required('Informe a tag')
});
