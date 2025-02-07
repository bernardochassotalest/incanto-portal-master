import React from 'react';
import _ from 'lodash';
import { formats } from '~/helper';
import { FormContainer } from '~/views/business-partners/styles';
import { BusinessPartnerTypesMapping } from '~/constants';
import { InputLabel } from '~/components/form';

export const BusinessPartnerForm = ({ values, errors, touched, previewMode }) => {

  return (
    <FormContainer>
      <InputLabel
        label="Código"
        value={_.get(values, 'cardCode')} />

      <InputLabel
        label="Nome"
        value={_.get(values, 'cardName')} />

      <InputLabel
        label="Tipo"
        value={BusinessPartnerTypesMapping[values.type] || values.type || ''} />

      <InputLabel
        label="CNPJ/CPF"
        value={formats.cnpj_cpf(_.get(values, 'vatNumber'))} />

      <InputLabel
        label="Grupo"
        value={_.get(values, 'bpGroup.grpName')} />

    </FormContainer>
  );
};
