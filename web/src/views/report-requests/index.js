import React from 'react';
import _ from 'lodash';
import { MdSave, MdCloudDownload } from 'react-icons/md';
import Crud from '~/components/crud';
import { formats } from '~/helper';
import { IconButton } from '~/components/crud/styles';
import { ReportRequestsForm, ReportRequestsSchema } from '~/views/report-requests/form';
import { Container } from '~/views/report-requests/styles';
import useReportRequests from '~/view-data/use-report-requests';

const statusMapping = {
    pending: 'Pendente',
    executing: 'Gerando',
    available: 'Disponível'
  },
  columns = (handleDownload) => [
    {
      name: 'Status',
      selector: 'status',
      width: '150px',
      format: (row) => statusMapping[row.status || ''],
    },
    {
      name: 'Tipo do Relatório',
      selector: 'typeData.name',
    },
    {
      name: 'Período De',
      selector: 'filters.startDate',
      width: '120px',
      center: true,
      format: (row) => formats.dateTimeZone(_.get(row, 'filters.startDate'), 'dd/MM/yyyy'),
    },
    {
      name: 'Período Até',
      selector: 'filters.endDate',
      width: '120px',
      center: true,
      format: (row) => formats.dateTimeZone(_.get(row, 'filters.endDate'), 'dd/MM/yyyy'),
    },
    {
      name: 'Solicitado em',
      selector: 'date',
      width: '200px',
      format: (row) => `${formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')} ${row.time || ''}`,
    },
    {
      name: 'Ações',
      selector: 'id',
      width: '80px',
      center: true,
      cell: (row) => {
        if (row.status !== 'available') {
          return null;
        }
        return <div>
          <IconButton
            type="button"
            title="Download"
            size={32}
            margin="-1px"
            onClick={() => handleDownload(row.id, row.typeData.id)}>
            <MdCloudDownload />
          </IconButton>
        </div>
      }
    }
  ];

function ReportRequests({ acls }) {
  const { state, actions } = useReportRequests();
  const canWrite = acls.includes('W');
  const actionsList = [
      {
        label: 'Salvar',
        icon: MdSave,
        isSubmit: true,
        isDisabled: ({ isValid }) => !isValid || !canWrite,
        action: actions.create,
      }
    ];

  return (
    <Container>
      <Crud
        openForm={state.openForm}
        useOpenForm={true}
        onCloseFilter={actions.closeForm}
        columns={columns(actions.handleDownload)}
        formTitle={(data) => (_.get(data, 'id')) ? `Solicitação de exportação "${data.name}"` : `Nova solicitação de exportação`}
        emptyText='Nenhuma solicitação de exportação encontrada'
        data={state.data}
        hideAdd={!canWrite}
        tableLoading={state.loading}
        formLoading={state.formLoading}
        onChangePage={actions.pageChange}
        onRowClicked={actions.load}
        rightWidth="35%"
        formOptions={{
          validationSchema: ReportRequestsSchema,
          initialValues: state.model,
        }}
        renderForm={(args) => (
          <ReportRequestsForm
            {...args}
            previewMode={!canWrite}
            listReportTypes={actions.listReportTypes}
          />
        )}
        actions={actionsList}
      />
    </Container>
  );
}

export default ReportRequests;
