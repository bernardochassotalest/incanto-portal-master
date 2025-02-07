import _ from 'lodash';
import React from 'react';
import * as Yup from 'yup';
import Fieldset from '~/components/fieldset';
import { Checkbox, InputGroup, GroupCheckbox as ArrayCheckbox } from '~/components/form';
import { PERMISSIONS_NAMES } from '~/constants';
import GroupCheckbox from '~/views/profiles/group-checkbox';
import { FormContainer } from '~/views/profiles/styles';

export const ProfileForm = ({ errors, permissions, tags, status, touched, values = {}, previewMode }) => {
  return (
    <FormContainer>
      <Checkbox disabled={previewMode} name='active' label='Ativo' />

      <InputGroup
        type='text'
        name='name'
        label='Nome do Perfil'
        maxLength={30}
        disabled={previewMode}
        hasError={errors.name && touched.name}
      />

      <Fieldset label="Tags">
        <ArrayCheckbox
          label="Tags"
          name="tags"
          disabled={previewMode}
          values={values.tags || []}
          allowedValues={tags}
          />
      </Fieldset>

      <GroupCheckbox
        maxHeight='auto'
        label='Permissões'
        name='permissions'
        disabled={previewMode}
        values={values && values.permissions}
        allowedValues={permissions || []}
        permsNames={PERMISSIONS_NAMES}
        hasError={errors.name && touched.name}
        />

      {status && status.msg && <div>{status.msg}</div>}
    </FormContainer>
  );
};

export const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Verifique se o nome está correto').required('Informe o nome'),
  permissions: Yup.mixed().test('', 'Informe ao menos uma permissão', function() {
      const { path, parent } = this;
      return !_.isEmpty(_.get(parent, path));
    }
  ),
});
