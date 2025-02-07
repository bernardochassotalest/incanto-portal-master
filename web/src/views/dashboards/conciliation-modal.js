import React from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import Modal from '~/components/modal';
import { FlexRow } from '~/components/layout';
import { InputGroup } from '~/components/form';
import { MdDelete } from 'react-icons/md';
import { IoGitNetworkSharp } from 'react-icons/io5';
import { HiOutlineExternalLink } from 'react-icons/hi';
import Button from '~/components/button';
import DataTable from '~/components/datatable';
import Fieldset from '~/components/fieldset';
import { IconButton } from '~/components/crud/styles';
import { formats } from '~/helper';
import { ModalContainer, ConciliationPanel, ConciliationFilterButton, ConciliationFilterContainer } from '~/views/dashboards/styles';

const columnsFromType = {
  'slip_capture': [
    {
      name: 'Banco',
      selector: 'bank',
      width: '70px',
      center: true
    },
    {
      name: 'Dt.Ocorrência',
      selector: 'date',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Dt.Vencimento',
      selector: 'dueDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Nr.Boleto',
      selector: 'authorization',
      width: '100px',
      center: true
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '120px',
    },
    {
      name: 'CPF',
      selector: 'vatNumber',
      width: '150px',
      format: (row) => formats.cnpj_cpf(row.vatNumber)
    },
    {
      name: 'Associado',
      wrap: true,
      selector: 'name'
    }
  ],
  'slip_canceled': [
    {
      name: 'Banco',
      selector: 'bank',
      width: '70px',
      center: true
    },
    {
      name: 'Dt.Ocorrência',
      selector: 'date',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Dt.Vencimento',
      selector: 'dueDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Nr.Boleto',
      selector: 'authorization',
      width: '100px',
      center: true
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '120px',
    },
    {
      name: 'CPF',
      selector: 'vatNumber',
      width: '150px',
      format: (row) => formats.cnpj_cpf(row.vatNumber)
    },
    {
      name: 'Associado',
      wrap: true,
      selector: 'name'
    }
  ],
  'creditcard_capture': [
    {
      name: 'Adquirente',
      selector: 'acquirer',
      width: '80px'
    },
    {
      name: 'Dt/Hr Captura',
      selector: 'date',
      center: true,
      width: '160px',
      format: (row) => `${formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')} ${row.time}`
    },
    {
      name: 'NSU',
      selector: 'nsu',
      center: true,
      width: '100px',
    },
    {
      name: 'Autorização',
      selector: 'authorization',
      center: true,
      width: '100px',
    },
    {
      name: 'TID',
      selector: 'tid',
      center: true,
      width: '190px',
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '120px',
    },
    {
      name: 'CPF',
      selector: 'vatNumber',
      width: '140px',
      format: (row) => formats.cnpj_cpf(row.vatNumber)
    },
    {
      name: 'Associado',
      wrap: true,
      selector: 'name',
      cell: (row) => <div title={row.name}>{_.truncate(row.name, { length: 25 })}</div>
    }
  ],
  'direct_debit_capture': [
    {
      name: 'Banco',
      selector: 'bank',
      width: '70px',
      center: true
    },
    {
      name: 'Dt.Ocorrência',
      selector: 'date',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Dt.Vencimento',
      selector: 'dueDate',
      center: true,
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'dueDate'), 'dd/MM/yyyy')
    },
    {
      name: 'Nr.Débito',
      selector: 'authorization',
      width: '120px',
      center: true
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Nr.Fatura',
      selector: 'billId',
      width: '120px',
    },
    {
      name: 'CPF',
      selector: 'vatNumber',
      width: '150px',
      format: (row) => formats.cnpj_cpf(row.vatNumber)
    },
    {
      name: 'Associado',
      wrap: true,
      selector: 'name'
    }
  ],
  'slip_settlement': [
    {
      name: 'Dt.Liquidação',
      selector: 'date',
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Banco',
      selector: 'bank',
      width: '110px',
    },
    {
      name: 'Conta',
      selector: 'account',
      width: '130px',
    },
    {
      name: 'Nosso número',
      selector: 'ourNumber',
      width: '150px',
    },
    {
      name: 'Valor',
      selector: 'amount',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Observações',
      selector: 'notes',
      wrap: true,
      cell: (row) => <div title={row.notes}>{_.truncate(row.notes, { length: 100 })}</div>
    }
  ],
  'slip_fee': [
    {
      name: 'Dt.Liquidação',
      selector: 'date',
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Banco',
      selector: 'bank',
      width: '110px',
    },
    {
      name: 'Conta',
      selector: 'account',
      width: '130px',
    },
    {
      name: 'Nro.Tarifa',
      selector: 'ourNumber',
      width: '150px',
    },
    {
      name: 'Valor',
      selector: 'amount',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Observações',
      selector: 'notes',
      wrap: true,
      cell: (row) => <div title={row.notes}>{_.truncate(row.notes, { length: 100 })}</div>
    }
  ],
  'direct_debit_settlement': [
    {
      name: 'Dt.Liquidação',
      selector: 'date',
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Banco',
      selector: 'bank',
      width: '110px',
    },
    {
      name: 'Conta',
      selector: 'account',
      width: '130px',
    },
    {
      name: 'Nosso número',
      selector: 'ourNumber',
      width: '150px',
    },
    {
      name: 'Valor',
      selector: 'amount',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      width: '120px',
      right: true,
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Observações',
      selector: 'notes',
      wrap: true,
      cell: (row) => <div title={row.notes}>{_.truncate(row.notes, { length: 100 })}</div>
    }
  ],
  'creditcard_settlement': [
    {
      name: 'Adquirente',
      selector: 'acquirer',
      width: '120px',
    },
    {
      name: 'Data',
      selector: 'date',
      width: '110px',
      format: (row) => formats.dateTimeZone(_.get(row, 'date'), 'dd/MM/yyyy')
    },
    {
      name: 'Banco',
      selector: 'bank',
      width: '110px',
    },
    {
      name: 'Conta',
      selector: 'account',
      width: '150px',
    },
    {
      name: 'Ponto Venda',
      selector: 'pointOfSale',
      width: '130px',
    },
    {
      name: 'Resumo Venda',
      selector: 'batchNo',
      width: '150px',
    },
    {
      name: 'Valor',
      selector: 'amount',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.amount || 0)
    },
    {
      name: 'Saldo',
      selector: 'balance',
      right: true,
      width: '120px',
      format: (row) => formats.currency(row.balance || 0)
    },
    {
      name: 'Observações',
      selector: 'notes',
      wrap: true,
      cell: (row) => <div title={row.notes}>{_.truncate(row.notes, { length: 100 })}</div>
    }
  ]
};

const columns = ({ selection, transactions, type, action, actionName, actionIcon: Icon }, previewMode) => [
  {
    name: 'Origem/Tag',
    selector: 'source',
    width: '100px',
    format: (row) => `${row.source}/${row.tag}`
  },
  ...(columnsFromType[type] || []),
  {
    name: 'Ações',
    width: '90px',
    right: true,
    cell: (row) => <>
      {row.url &&
        <IconButton size={28} title="Ver detalhes" onClick={() => window.open(row.url, '_blank')}>
          <HiOutlineExternalLink />
        </IconButton>
      }

      {!previewMode &&
        <IconButton size={28} title={actionName} onClick={() => action(selection, transactions, row)}>
          <Icon />
        </IconButton>
      }
    </>
  }
];

function ConciliationModal({ title, isOpen, loading, data, filter, transactions, selection, closeModal, ruleList, previewMode, listTransactions, addSelected, removeSelected, conciliationAction, conciliationAllAction, disabled }) {

  const hasTransactions = !_.isEmpty(transactions),
    hasSelections = !_.isEmpty(selection);

  const canConciliate = (values) => {
    let sum = _.sumBy(selection, 'balance'),
      selectionSize = _.size(selection);

    return selectionSize !== 0 && _.size(_.get(values, 'notes')) >= 5 && (selectionSize === 1 || sum === 0)
  };

  const canConciliateAll = (values) => {
    let sum = _.sumBy(selection, 'balance'),
      selectionSize = _.size(selection);

    return selectionSize > 1 && _.size(_.get(values, 'notes')) >= 5 && sum !== 0;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
    >
      {({ values, handleReset, setFieldValue, ...rest }) => {
        return (
          <Modal
            width="95%"
            height="90%"
            noPadding={true}
            open={isOpen}
            title={title}
            hideClose={false}
            onClose={() => { handleReset(); closeModal() }}
          >
            <ModalContainer isEmpty={!hasTransactions} style={{ padding: "0 10px" }}>
              <ConciliationFilterContainer>
                {_.map(ruleList, (rule, index) => (
                  <ConciliationFilterButton
                    key={index}
                    className={`${_.get(rule, 'id') === _.get(values, 'rule.id') ? 'active' : ''}`}
                    onClick={() => {
                      setFieldValue('rule', rule);
                      listTransactions({ ...(_.get(filter, 'data') || {}), rule: _.get(rule, 'id') })
                    }}>
                    {rule.name}
                  </ConciliationFilterButton>
                ))}
              </ConciliationFilterContainer>

              <ConciliationPanel previewMode={previewMode}>
                <div className="transactions">
                  <Fieldset label="A conciliar">
                    <div className="primary">
                      {
                        !_.get(values, 'rule') ?
                          <h3> Selecione uma regra de conciliação para ver as transações </h3>
                          :
                          <DataTable
                            emptyText="Nenhuma transação encontrada"
                            noPagination={true}
                            data={{ rows: transactions }}
                            loading={loading}
                            columns={columns({ type: _.get(values, 'rule.id'), transactions, selection, action: addSelected, actionIcon: IoGitNetworkSharp, actionName: 'Selecionar' }, previewMode)}
                            onRowClicked={_.noop}
                          />
                      }
                    </div>
                  </Fieldset>
                </div>
                {!previewMode &&
                  <div className="selection">
                    {(_.get(values, 'rule') && (hasTransactions || hasSelections)) &&
                      <Fieldset label="Conciliação">
                        <div className="secondary">
                          {
                            _.isEmpty(selection) ?
                              <h3> Selecione uma ou mais transações para conciliar </h3>
                              :
                              <DataTable
                                emptyText=""
                                noPagination={true}
                                data={{ rows: selection }}
                                loading={loading}
                                columns={columns({ type: _.get(values, 'rule.id'), transactions, selection, action: removeSelected, actionIcon: MdDelete, actionName: 'Deselecionar' })}
                                onRowClicked={_.noop}
                              />
                          }
                        </div>
                      </Fieldset>
                    }
                    {hasSelections &&
                      <FlexRow style={{ alignItems: 'center' }}>
                        <div style={{ flex: '1' }}>
                          <InputGroup
                            type="text"
                            name="notes"
                            label="Observação"
                            required={true}
                            noMargin={true}
                            maxLength={200}
                          />
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                          <Button primary disabled={!canConciliateAll(values)} onClick={() => conciliationAllAction(values, selection)}>
                            Conciliar Todos
                          </Button>
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                          <Button primary disabled={!canConciliate(values)} onClick={() => conciliationAction(values, selection)}>
                            Conciliar
                          </Button>
                        </div>
                      </FlexRow>
                    }
                  </div>
                }
              </ConciliationPanel>
            </ModalContainer>
          </Modal>
        );
      }}
    </Formik>
  );
}

export default ConciliationModal;
