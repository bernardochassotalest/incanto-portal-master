import React from 'react';
import Fieldset from '~/components/fieldset';
import { FormContainer } from '~/views/account-configs/styles';
import { Autocomplete, InputDate, Checkbox } from '~/components/form';
import _ from 'lodash';
import * as Yup from 'yup';

export const AccountConfigForm = ({ errors, status, touched, values, isValid, previewMode, handleListAccountModels, handleListDataSources, handleListSourceItems, handleListChartOfAccounts, handleListBusinessPartners, handleListCostingCenters, handleListProjects }) => {
  return (
    <FormContainer>
      <Checkbox name="isActive" label="Ativo" disabled={previewMode} />

      <InputDate
        name="validFrom"
        label="Válido a partir de"
        disabled={previewMode || !!values.id}
        hideErrorLabel={true}
        hasError={errors.validFrom && touched.validFrom}
      />

      <Autocomplete
        name="accountingModel"
        minLength={0}
        keyField="id"
        label="Modelo contábil"
        value={values.accountingModel}
        disabled={previewMode || !!values.id}
        valueFormat={row => `${row.name}`}
        loadData={handleListAccountModels}
        emptyText={"Pesquise uma conta modelo"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.accountingModel && touched.accountingModel}
      />

      <Autocomplete
        name="dataSource"
        minLength={0}
        keyField="id"
        label="Fonte de dados"
        value={values.dataSource}
        disabled={previewMode || !!values.id}
        valueFormat={row => `${row.name}`}
        loadData={handleListDataSources}
        emptyText={"Pesquise uma fonte de dados"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.dataSource && touched.dataSource}
      />

      <Autocomplete
        name="sourceItem"
        minLength={0}
        keyField="id"
        label="Item"
        keyApp={`${_.get(values, 'dataSource.id')}-`}
        value={!values.dataSource ? "" : values.sourceItem}
        disabled={previewMode || !values.dataSource || !!values.id}
        valueFormat={row => `${row.name}`}
        loadData={(term, callback) => handleListSourceItems(term, values.dataSource, callback)}
        emptyText={"Pesquise um item"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrado"}
        hasError={errors.sourceItem && touched.sourceItem}
      />

      <Fieldset label="Informações de Débito">
        <Autocomplete
          name="debChartOfAccount"
          minLength={0}
          keyField="acctCode"
          label="Conta contábil (débito)"
          value={values.debChartOfAccount}
          disabled={previewMode}
          valueFormat={row => `${row.acctName} (${row.acctCode})`}
          loadData={handleListChartOfAccounts}
          emptyText={"Pesquise uma conta contábil (débito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
          hasError={errors.debChartOfAccount && touched.debChartOfAccount}
        />

        {_.get(values, "debChartOfAccount.lockManual") && (
          <Autocomplete
            name="debBusinessPartner"
            minLength={0}
            keyApp={`${_.get(values, 'debChartOfAccount.acctCode')}-`}
            keyField="cardCode"
            label="Parceiro de negócio (débito)"
            value={values.debBusinessPartner}
            disabled={previewMode}
            valueFormat={row => `${row.cardName}`}
            loadData={(term, callback) => handleListBusinessPartners(term, values.debChartOfAccount, callback)}
            emptyText={"Pesquise um parceiro de negócio (débito)"}
            tipText={"Digite... "}
            loadingText={"Carregando..."}
            notFoundText={"Não encontrado"}
            hasError={errors.debBusinessPartner && touched.debBusinessPartner}
          />
        )}

        <Autocomplete
          name="debitCostingCenter"
          minLength={0}
          keyField="ocrCode"
          label="Centro de custos (débito)"
          value={values.debitCostingCenter}
          disabled={previewMode}
          valueFormat={row => `${row.ocrName} (${row.ocrCode})`}
          loadData={handleListCostingCenters}
          emptyText={"Pesquise um centro de custos (débito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
        />

        <Autocomplete
          name="debitProject"
          minLength={0}
          keyField="prjCode"
          label="Projeto (débito)"
          value={values.debitProject}
          disabled={previewMode}
          valueFormat={row => `${row.prjName} (${row.prjCode})`}
          loadData={handleListProjects}
          emptyText={"Pesquise um projeto (débito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
        />
      </Fieldset>

      <Fieldset label="Informações de Crédito">
        <Autocomplete
          name="credChartOfAccount"
          minLength={0}
          keyField="acctCode"
          label="Conta contábil (crédito)"
          value={values.credChartOfAccount}
          disabled={previewMode}
          valueFormat={row => `${row.acctName} (${row.acctCode})`}
          loadData={handleListChartOfAccounts}
          emptyText={"Pesquise uma conta contábil (crédito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
          hasError={errors.credChartOfAccount && touched.credChartOfAccount}
        />

        {_.get(values, "credChartOfAccount.lockManual") && (
          <Autocomplete
            name="credBusinessPartner"
            minLength={0}
            keyField="cardCode"
            keyApp={`${_.get(values, 'credChartOfAccount.acctCode')}-`}
            label="Parceiro de negócio (crédito)"
            value={values.credBusinessPartner}
            disabled={previewMode}
            valueFormat={row => `${row.cardName}`}
            loadData={(term, callback) => handleListBusinessPartners(term, values.credChartOfAccount, callback)}
            emptyText={"Pesquise um parceiro de negócio (crédito)"}
            tipText={"Digite... "}
            loadingText={"Carregando..."}
            notFoundText={"Não encontrado"}
            hasError={errors.credBusinessPartner && touched.credBusinessPartner}
          />
        )}

        <Autocomplete
          name="creditCostingCenter"
          minLength={0}
          keyField="ocrCode"
          label="Centro de custos (crédito)"
          value={values.creditCostingCenter}
          disabled={previewMode}
          valueFormat={row => `${row.ocrName} (${row.ocrCode})`}
          loadData={handleListCostingCenters}
          emptyText={"Pesquise um centro de custos (crédito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
        />

        <Autocomplete
          name="creditProject"
          minLength={0}
          keyField="prjCode"
          label="Projeto (crédito)"
          value={values.creditProject}
          disabled={previewMode}
          valueFormat={row => `${row.prjName} (${row.prjCode})`}
          loadData={handleListProjects}
          emptyText={"Pesquise um projeto (crédito)"}
          tipText={"Digite... "}
          loadingText={"Carregando..."}
          notFoundText={"Não encontrado"}
        />
      </Fieldset>
    </FormContainer>
  );
};

export const AccountConfigSchema = Yup.object().shape({
  validFrom: Yup.date().required("É necessário informar a data de validade"),
  accountingModel: Yup.mixed().required("Selecione o modelo contábil"),
  dataSource: Yup.mixed().required("Selecione a fonte de dados"),
  sourceItem: Yup.mixed().required("Selecione o item"),
  debChartOfAccount: Yup.mixed().required("Selecione a conta contábil para débito"),
  credChartOfAccount: Yup.mixed().required("Selecione a conta contábil para crédito"),
  debBusinessPartner: Yup.mixed().test("", "Selecione o parceiro de negócio para débito", function(val) {
    const {parent} = this,
      lockManual = _.get(parent, 'debChartOfAccount.lockManual');
    return (lockManual && val) || !lockManual;
  }),
  crdBusinessPartner: Yup.mixed().test("", "Selecione o parceiro de negócio para crédito", function(val) {
    const {parent} = this,
      lockManual = _.get(parent, 'crdChartOfAccount.lockManual');
    return (lockManual && val) || !lockManual;
  }),
});
