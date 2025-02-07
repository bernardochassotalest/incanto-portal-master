import _ from 'lodash';
import React from 'react';
import Modal from '~/components/modal';
import DataTable from '~/components/datatable';
import { formats } from '~/helper';
import { ModalContainer, ChartContainer, ChartBox } from '~/views/dashboards/styles';
import Spinner from '~/components/spinner';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const chartOptions = (name, array) => ({
    chart: {
      type: 'pie',
      plotShadow: false,
      plotBorderWidth: null,
      plotBackgroundColor: null,
      height: 200,
    },
    credits: {
     enabled: false
    },
    title: {
      text: null
    },
    tooltip: {
      formatter: function (opts) { return `${this.key} (<b>${formats.decimal(this.percentage)}%</b>):  <b>${formats.currency(this.y)}</b>` }
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      margin: 5
    },
    plotOptions: {
      pie: {
        size: '75%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: false },
        showInLegend: true
      }
    },
    series: [
      {
        name,
        colorByPoint: true,
        data: _.map(array, (r) => ({ name: r.name, y: r.amount }))
      }
    ]
  }),
  columns = (name) => [
    {
      name,
      selector: 'name'
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '130px',
      format: (r) => formats.currency(r.amount)
    }
  ];

const ChartPanel = ({ name, field, columnName, data }) => {
  let rows = _.get(data, field) || [];

  return (
    <ChartBox>
      <h3>{name}</h3>

      <div className="chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions(name, rows)}
          />
      </div>

      <div className="table">
        <DataTable
          emptyText="Nenhum registro encontrado"
          noPagination={true}
          data={{ rows }}
          keyField="name"
          columns={columns(columnName)}
          onRowClicked={_.noop}
          extraOptions={{
            compact: true,
            ignoreRowClicked: true,
            highlightOnHover: false,
            selectableRows: false,
          }}
          />
      </div>
    </ChartBox>
  );
};

function AcquirerModal({ title, isOpen, loading, data, closeModal }) {

  return (
    <Modal
      width="95%"
      height="90%"
      noPadding={true}
      open={isOpen}
      title={title}
      hideClose={false}
      onClose={closeModal}
      >
      <ModalContainer>
        { loading ?
          <Spinner visible={true} />
          :
          <ChartContainer>
            <ChartPanel data={data} columnName="Bandeira" name="Bandeiras" field="cardBrand" />
            <ChartPanel data={data} columnName="Ponto de Venda" name="Pontos de Venda" field="pointOfSale" />
            <ChartPanel data={data} columnName="Tipo de Captura" name="Tipos de Captura" field="captureType" />
            <ChartPanel data={data} columnName="Terminal" name="Terminais" field="terminalNo" />
          </ChartContainer>
        }
      </ModalContainer>
    </Modal>
  );
};

export default AcquirerModal;
