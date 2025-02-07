import React from 'react';
import _ from 'lodash';
import { MdSave } from 'react-icons/md';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { ReportTemplateForm, ReportTemplateSchema } from '~/views/report-templates/form';
import { Container } from '~/views/report-templates/styles';
import useReportTemplates from '~/view-data/use-report-templates';

const columns = [
  {
    name: 'Nome',
    selector: 'name',
    format: (row) => row.name || '',
  },
  {
    name: 'Cadastrado em',
    selector: 'createdAt',
    hide: 'md',
    width: '140px',
    format: (row) => formats.dateTimeZone(_.get(row, 'createdAt'), 'dd/MM/yyyy HH:mm'),
  }
];

function ReportTemplates({ acls }) {
  const { state, actions } = useReportTemplates();
  const canWrite = acls.includes('W');
  const actionsList = [
      {
        label: 'Salvar',
        icon: MdSave,
        isSubmit: true,
        isDisabled: ({ isValid }) => !isValid || !canWrite,
        action: actions.createOrUpdate,
      }
    ];

  return (
    <Container>
      <Crud
        columns={columns}
        formTitle={(data) => (_.get(data, 'id')) ? `Modelo de relatório "${data.name}"` : `Novo modelo de relatório`}
        emptyText='Nenhum modelo de relatório encontrado'
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        rightWidth="50%"
        formOptions={{
          validationSchema: ReportTemplateSchema,
          initialValues: state.model,
        }}
        renderForm={(args) => (
          <ReportTemplateForm
            {...args}
            previewMode={!canWrite}
            updateTree={actions.updateTree}
            findChildTreeIds={actions.findChildTreeIds}
            getTreeFromArray={actions.getTreeFromArray}
            findNodeById={actions.findNodeById}
            listTags={actions.listTags}
            listAccounts={actions.listAccounts}
            isOpenAccountModal={state.isOpenAccountModal}
            modalData={state.modalData}
            handleAccountModalClose={actions.handleAccountModalClose}
            handleAccountModalOpen={actions.handleAccountModalOpen}
          />
        )}
        actions={actionsList}
      />
    </Container>
  );
}

export default ReportTemplates;
