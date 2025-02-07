import React from 'react';
import { FormContainer } from '~/views/conciliation-accounts/styles';
import { Autocomplete, Select } from '~/components/form';
import _ from 'lodash';
import * as Yup from 'yup';

export const ConciliationAccountsForm = ({ errors, status, touched, values, isValid, previewMode, handleListChartOfAccounts, handleListBusinessPartners }) => {
  return (
    <FormContainer>
      <Select
        name="type"
        label="Tipo de Conciliação"
        options={{
          values: [
            { value: 'account', label: 'Contábil' },
            { value: 'finance', label: 'Financeira' },
          ],
        }}
        />

      <Autocomplete
        name="chartOfAccount"
        minLength={0}
        keyField="acctCode"
        label="Conta contábil"
        value={values.chartOfAccount}
        disabled={previewMode}
        valueFormat={row => `${row.acctName} (${row.acctCode})`}
        loadData={handleListChartOfAccounts}
        emptyText={"Pesquise uma conta contábil"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.chartOfAccount && touched.chartOfAccount}
      />

      {_.get(values, "chartOfAccount.lockManual") && (
        <Autocomplete
          name="businessPartner"
          minLength={0}
          keyApp={`${_.get(values, 'chartOfAccount.acctCode')}-`}
          keyField="cardCode"
          label="Parceiro de negócio"
          value={values.businessPartner}
          disabled={previewMode}
          valueFormat={row => `${row.cardName}`}
          loadData={(term, callback) => handleListBusinessPartners(term, values.chartOfAccount, callback)}
          emptyText={"Pesquise um parceiro de negócio"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
          hasError={errors.businessPartner && touched.businessPartner}
        />
      )}
    </FormContainer>
  );
};

export const ConciliationAccountsSchema = Yup.object().shape({
  chartOfAccount: Yup.mixed().required("Selecione a conta contábil"),
  businessPartner: Yup.mixed().test("", "Selecione o parceiro de negócio", function(val) {
    const {parent} = this,
      lockManual = _.get(parent, 'chartOfAccount.lockManual');
    return (lockManual && val) || !lockManual;
  }),
});
