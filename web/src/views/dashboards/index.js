import React, { useState } from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import { MdCheck, MdKeyboardBackspace, MdDone, MdClear } from 'react-icons/md';
import { FaRegCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import { IoShuffleSharp } from 'react-icons/io5';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { GrDocumentPdf } from 'react-icons/gr';
import { BiArrowToLeft } from 'react-icons/bi';
import Spinner from '~/components/spinner';
import useDashboards from '~/view-data/use-dashboards';
import FormFilter from '~/views/dashboards/filter';
import { IconButton } from '~/components/crud/styles';
import { Container, FormHeader, FormBody, ConciliationButton, FormToolbar, Month, ColapseBtn, CalendarPanel, CardIconButton, Week, Day, Infos, SubInfo, Cards, Card } from '~/views/dashboards/styles';
import { formats } from '~/helper';
import EmptyState from '~/components/empty-state';
import ConciliationModal from '~/views/dashboards/conciliation-modal';
import BillsModal from '~/views/dashboards/bills-modal';
import SalesModal from '~/views/dashboards/sales-modal';
import VindiModal from '~/views/dashboards/vindi-modal';
import JeErrorsModal from '~/views/dashboards/je-errors-modal';
import JeConciliedModal from '~/views/dashboards/je-concilied-modal';
import MessagesModal from '~/views/dashboards/messages-modal';
import InvoicedModal from '~/views/dashboards/invoiced-modal';
import AcquirerModal from '~/views/dashboards/acquirer-modal';
import DetailModal from '~/views/sales/detail-modal';
import confirm from '~/components/confirm';

function Dashboard({ acls }) {
  const { state, actions } = useDashboards();
  const canConciliate = acls.includes('C');
  const [showCalendar, setShowCalendar] = useState(true);

  const handleConciliation = async (data, transactions) => {
    let ids = _.map(transactions, 'id'),
      notes = _.get(data, 'notes') || '',
      filter = { rule: _.get(data, 'rule.id'), ..._.get(state, 'filter.data') };

    if (_.size(transactions) === 1) {
      const result = await confirm.show({
        title: 'Atenção',
        text: `Deseja realizar a conciliação apenas dessa transação, a operação não pode ser desfeita?`,
      });

      if (result) {
        actions.conciliationCreate({ notes, id: _.first(ids) }, filter);
      }
    } else if (_.size(transactions) > 1) {
      actions.conciliationJoin({ notes, ids }, filter);
    }
  };

  const handleConciliationAll = async (data, transactions) => {
    let ids = _.map(transactions, 'id'),
      notes = _.get(data, 'notes') || '',
      filter = { rule: _.get(data, 'rule.id'), ..._.get(state, 'filter.data') };

    if (_.size(transactions) > 1) {
      const result = await confirm.show({
        title: 'Atenção',
        text: `Deseja realizar a conciliação individualmente de cada transação, a operação não pode ser desfeita?`,
      });

      if (result) {
        for (let i = 0; i < ids.length; i += 1) {
          actions.conciliationCreate({ notes, id: ids[i], message: ` - ${i + 1} de ${ids.length}` }, filter, i !== ids.length - 1);
        }
      }
    }
  };

  const Filter = () => {
    return (
      <div className='right'>
        <Formik
          onSubmit={actions.load}
          initialValues={_.get(state, 'filter.data') || {}}
          enableReinitialize={true}
          validateOnMount={true}
        >
          {(args) => {
            return (
              <>
                <FormHeader>
                  Filtro
                </FormHeader>
                <FormBody>
                  <FormFilter
                    {...args}
                    listTags={actions.listTags}
                  />
                </FormBody>
                <FormToolbar>
                  <div className='buttons'>
                    <IconButton
                      title='Cancelar'
                      disabled={state.loading}
                      onClick={actions.hideFilter}
                    >
                      <MdKeyboardBackspace />
                    </IconButton>
                    <IconButton
                      title='Aplicar Filtro'
                      disabled={state.loading}
                      onClick={args.handleSubmit}
                    >
                      <MdCheck />
                    </IconButton>
                  </div>
                </FormToolbar>
              </>
            );
          }}
        </Formik>
      </div>
    );
  };

  const Calendar = () => {
    let days = _.get(state, 'data.calendar') || [],
      weeks = [],
      weekNo = 0,
      today = formats.dateTimeZone(new Date(), 'yyyy-MM-dd');

    _.each(days, (day) => {
      if (!weeks[weekNo]) {
        weeks[weekNo] = [{}, {}, {}, {}, {}, {}, {}];
      }
      let week = weeks[weekNo];
      week[day.weekDay % 7] = day;
      if (day.weekDay === 6) {
        weekNo++;
      }
    });

    return (
      <div>
        <CalendarPanel>
          <h2>
            Status do mês
          </h2>
          <h3>
            <IconButton noBorders={true} onClick={() => actions.filterByMonth(_.get(state, 'filter.data'), false)}>
              <TiChevronLeft />
            </IconButton>
            {formats.dateTimeZone(_.get(state, 'data.period.startDate'), 'MM/yyyy')}
            <IconButton noBorders={true} onClick={() => actions.filterByMonth(_.get(state, 'filter.data'), true)}>
              <TiChevronRight />
            </IconButton>
          </h3>
          <Month>
            <Week header={true}>
              <Day header={true}>Dom</Day>
              <Day header={true}>Seg</Day>
              <Day header={true}>Ter</Day>
              <Day header={true}>Qua</Day>
              <Day header={true}>Qui</Day>
              <Day header={true}>Sex</Day>
              <Day header={true}>Sab</Day>
            </Week>
            {_.map(weeks, (week, w) => (
              <Week key={w}>
                {_.map(week, (day, d) => {
                  let dayNo = formats.dateTimeZone(day.date, 'd');
                  return (
                    <Day key={d} {...day} today={day.date === today} onClick={() => actions.filterByDay(dayNo, _.get(state, 'filter.data'))}>
                      {dayNo}
                      <span>
                        {day.sapB1 === 'concilied' && <MdDone />}
                        {day.sapB1 === 'open' && <MdClear />}
                      </span>
                    </Day>
                  );
                })}
              </Week>
            ))}
          </Month>

          <Infos>
            <div><span className="open">Aberto</span></div>
            <div><span className="concilied">Conciliado</span></div>
            <div><span className="closed">Fechado</span></div>
            <div><span className="future">Futuro</span></div>
          </Infos>
          <SubInfo>
            <div><span><MdDone /></span>Conciliado no SAP B1</div>
            <div><span><MdClear /></span>Não Conciliado no SAP B1</div>
          </SubInfo>
        </CalendarPanel>
      </div>
    );
  };

  const CardsWithCount = ({ field, groupField, nameFn }) => {
    let groups = _.groupBy(_.get(state, `data.${field}`), groupField) || {};
    const openDetail = (item) => {
      if (item.filterAcquirer) {
        actions.openAcquirerModal(nameFn(item), item.filterAcquirer);
      } else if (item.filterSale) {
        actions.openSalesModal(item.group, item.filterSale);
      } else if (item.filterVindi) {
        actions.openVindiModal(item.group, item.filterVindi);
      } else if (item.filterJV) {
        actions.openJeErrorsModal(item.filterJV);
      } else if (item.filterJE) {
        actions.openJeConciliedModal(item.filterJE);
      } else if (item.filterConfig) {
        actions.openMessagesModal(item.filterConfig);
      }
    }

    return (
      <>
        {_.map(groups, (group, groupName) => (
          <Card key={groupName}>
            <h3>{groupName}</h3>

            <table>
              <tbody>
                {_.map(group, (item, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'odd' : ''} ${item.filterAcquirer || item.filterVindi || item.filterSale || item.filterJV || item.filterJE || item.filterConfig ? 'link' : ''}`}
                    onClick={() => openDetail(item)}
                  >
                    <td className="name"> {nameFn(item)}</td>
                    <td className="count"> {formats.number(item.count)}</td>
                    <td className="value"> {formats.currency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
      </>
    );
  };

  const CardWithTotal = ({ field, title, detailBill, detailOnTotal, icon: Icon, action }) => {
    let list = _.cloneDeep(_.get(state, `data.${field}`)) || [],
      total = _.last(list) || { name: 'Total', amount: 0 };
    list.splice(-1, 1);

    return (
      <Card>
        <h3>{title}</h3>
        <table>
          <tbody>
            {_.map(list, (item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'odd' : ''}`}>
                <td className="name"> {item.name}</td>
                {item.filterDetail ?
                  <td className="value link" onClick={() => detailBill(item.filterDetail)}> {formats.currency(item.amount)}</td>
                  :
                  <td className="value"> {formats.currency(item.amount)}</td>
                }
              </tr>
            ))}
            <tr className="total">
              <td className="total name"> {total.name}</td>
              {detailOnTotal ?
                <td className="total value link" onClick={detailOnTotal}> {formats.currency(total.amount)}</td>
                :
                <td className="total value"> {formats.currency(total.amount)}</td>
              }
            </tr>
          </tbody>
        </table>
      </Card>
    );
  };

  const mapMessage = {
    'taxDate': 'Dados de Vendas',
    'refDate': 'Dados de Lançamentos',
    'dueDate': 'Dados de Vencimentos',
  };

  let infoPeriod = mapMessage[_.get(state, 'data.period.dateField') || 'taxDate'],
    startDate = formats.dateTimeZone(_.get(state, 'data.period.startDate'), 'dd/MM/yyyy'),
    endDate = formats.dateTimeZone(_.get(state, 'data.period.endDate'), 'dd/MM/yyyy'),
    tags = _.get(state, 'data.period.tags') || [],
    tagsText = _.isEmpty(tags) ? '' : ` - Tags: ${tags.join(', ')}`,
    invoicedModalTitle = '';

  const hasStepBConciliation = !_.isEmpty(_.get(state, 'data.stepB.conciliation')) && canConciliate && _.get(state, 'data.stepB.allDataCollected', false),
    hasStepCInvoiced = _.size(_.get(state, 'data.stepC.invoiced')) > 1,
    filterData = _.get(state, 'filter.data', {});

  if (state.invoicedModalType === 'notCaptured') {
    invoicedModalTitle = 'Faturas com financeiro não capturado';
  } else if (state.invoicedModalType === 'sale') {
    invoicedModalTitle = 'Faturas com diferença no saldo de captura';
  } else if (state.invoicedModalType === 'creditCard') {
    invoicedModalTitle = 'Faturas pendente de liquidação de cartão';
  } else if (state.invoicedModalType === 'slip') {
    invoicedModalTitle = 'Faturas pendente de liquidação de boleto';
  } else if (state.invoicedModalType === 'directDebit') {
    invoicedModalTitle = 'Faturas pendente de liquidação de débito automático';
  }

  return (
    <Container showForm={_.get(state, 'filter.visible')}>
      {state.loading ?
        <Spinner visible={true} />
        :
        <>
          <div className='left'>
            <ColapseBtn onClick={() => setShowCalendar(!showCalendar)}>
              {!showCalendar ? <FaRegCalendarAlt /> : <BiArrowToLeft />}
            </ColapseBtn>

            {showCalendar && <Calendar />}

            <div className="card-box">
              <h2>
                {infoPeriod} de {startDate} até {endDate} {tagsText}
              </h2>

              <div className="cards">
                <Cards>
                  <h3>Coleta de Dados</h3>
                  <div className="contents">
                    {_.isEmpty(_.get(state, 'data.stepA.collected')) ?
                      <EmptyState
                        text="Não foi encontrado dados"
                        visible={true}
                        size={'180px'} />
                      :
                      <CardsWithCount field="stepA.collected" groupField="type" nameFn={(r) => `${r.name} (${r.group})`} />
                    }
                  </div>
                </Cards>

                <div className="divider" />

                <Cards hasBtn={true}>
                  <h3>
                    Conciliação
                  </h3>
                  <div className="contents" >
                    <ConciliationButton title="Conciliar itens" onClick={() => actions.openConciliationModal(_.get(state, 'filter.data'))}>
                      <IoShuffleSharp />
                    </ConciliationButton>
                    {_.isEmpty(_.get(state, 'data.stepB.conciliation')) ?
                      <EmptyState
                        Icon={FaExchangeAlt}
                        iconSize={80}
                        iconColor="#e4e2e2"
                        text="Não existem dados para conciliar"
                        visible={true}
                        size={'180px'} />
                      :
                      <CardsWithCount field="stepB.conciliation" groupField="source" nameFn={(r) => r.ruleName} />
                    }
                  </div>
                </Cards>

                <div className="divider" />

                <Cards hasBtn={hasStepCInvoiced}>
                  <h3>Contabilização</h3>
                  <div className="contents">
                    {hasStepCInvoiced &&
                      <CardIconButton title="PDF com Resumo" onClick={() => actions.exportSummaryPdf(_.get(state, 'data.period', {}))}>
                        <GrDocumentPdf />
                      </CardIconButton>
                    }
                    <CardWithTotal field="stepC.invoiced" title="Faturamento"
                      detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'sale' })}
                      detailBill={actions.openBillsModal} />
                    {!_.isEmpty(_.get(state, 'data.stepC.notCaptured')) &&
                      <CardWithTotal field="stepC.notCaptured" title="Não Capturado"
                        detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'notCaptured' })}
                        detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.creditcard')) &&
                      <CardWithTotal field="stepC.creditcard" title="Cartões"
                        detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'creditCard' })}
                        detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.slip')) &&
                      <CardWithTotal field="stepC.slip" title="Boletos"
                        detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'slip' })}
                        detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.directDebit')) &&
                      <CardWithTotal field="stepC.directDebit" title="Débito Automático"
                        detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'directDebit' })}
                        detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.pecld')) &&
                      <CardWithTotal field="stepC.pecld" title="PECLD"
                        detailOnTotal={() => actions.openInvoicedModal({ ...filterData, type: 'pecld' })}
                        detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.canceled')) &&
                      <CardWithTotal field="stepC.canceled" title="Cancelamentos" detailBill={actions.openBillsModal} />}
                    {!_.isEmpty(_.get(state, 'data.stepC.fee')) && <CardWithTotal field="stepC.fee" title="Tarifas" />}
                    {!_.isEmpty(_.get(state, 'data.stepC.settlement')) && <CardWithTotal field="stepC.settlement" title="Liquidação" />}
                  </div>
                </Cards>
              </div>
            </div>
          </div>
          {_.get(state, 'filter.visible') &&
            <Filter />
          }
        </>
      }

      <ConciliationModal
        title={<span>Conciliação de itens</span>}
        isOpen={state.isOpenConciliationModal}
        disabled={!canConciliate}
        loading={state.conciliationModalLoading}
        data={state.modalData}
        filter={state.filter}
        previewMode={!hasStepBConciliation}
        conciliationAction={handleConciliation}
        conciliationAllAction={handleConciliationAll}
        transactions={state.conciliationTransactionList}
        selection={state.conciliationModalSelection}
        closeModal={() => { actions.load(filterData); actions.closeConciliationModal() }}
        ruleList={state.conciliationRulesList}
        listTransactions={actions.conciliationTransactions}
        addSelected={actions.addConciliationSelection}
        removeSelected={actions.removeConciliationSelection}
      />

      <BillsModal
        title={<span>Faturas</span>}
        isOpen={state.isOpenBillsModal}
        loading={state.billsModalLoading}
        filter={state.billsFilter}
        data={state.billsList}
        loadList={actions.listBills}
        openDetail={actions.openBillDetailModal}
        closeModal={() => { actions.closeBillsModal() }}
      />

      <SalesModal
        title={<span>Vendas ({state.salesModalTitle})</span>}
        isOpen={state.isOpenSalesModal}
        loading={state.salesModalLoading}
        filter={state.salesFilter}
        data={state.salesList}
        loadList={actions.listSales}
        openDetail={actions.openBillDetailModal}
        closeModal={() => { actions.closeSalesModal() }}
      />

      <VindiModal
        title={<span>Faturas da Vindi ({state.vindiModalTitle})</span>}
        isOpen={state.isOpenVindiModal}
        loading={state.vindiModalLoading}
        filter={state.vindiFilter}
        data={state.vindiList}
        loadList={actions.listVindi}
        openDetail={actions.openBillDetailModal}
        closeModal={() => { actions.closeVindiModal() }}
      />

      <InvoicedModal
        title={<span>{invoicedModalTitle}</span>}
        isOpen={state.isOpenInvoicedModal}
        loading={state.invoicedModalLoading}
        filter={filterData}
        data={state.invoicedList}
        type={state.invoicedModalType}
        loadList={actions.listInvoiced}
        openDetail={actions.openBillDetailModal}
        closeModal={() => { actions.closeInvoicedModal() }}
      />

      <JeErrorsModal
        title={<span>Lançamentos Contábeis com Erro</span>}
        isOpen={state.isOpenJeErrorsModal}
        loading={state.jeErrorsModalLoading}
        filter={state.jeErrorsFilter}
        data={state.jeErrorsList}
        loadList={actions.listJeErrors}
        resend={actions.resendJE}
        closeModal={() => { actions.load(filterData); actions.closeJeErrorsModal() }}
      />

      <JeConciliedModal
        title={<span>Contas Contábeis NÃO Conciliadas no SAP Business One</span>}
        isOpen={state.isOpenJeConciliedModal}
        loading={state.jeConciliedModalLoading}
        filter={state.jeConciliedFilter}
        data={state.jeConciliedList}
        loadList={actions.listJeConcilied}
        closeModal={() => { actions.load(filterData); actions.closeJeConciliedModal() }}
      />

      <MessagesModal
        title={<span>Mensagens de validações de configuração</span>}
        isOpen={state.isOpenMessagesModal}
        loading={state.messagesModalLoading}
        filter={state.messagesFilter}
        data={state.messagesList}
        loadList={actions.listMessages}
        confirm={actions.confirmMessages}
        closeModal={() => { actions.load(filterData); actions.closeMessagesModal() }}
      />

      <AcquirerModal
        title={<span>Detalhamento - {_.get(state, 'acquirerModalData.title')}</span>}
        isOpen={state.isOpenAcquirerModal}
        loading={state.acquirerModalLoading}
        data={state.acquirerModalData}
        closeModal={() => { actions.closeAcquirerModal() }}
      />

      <DetailModal
        title={<span>Detalhes da Venda</span>}
        isOpen={state.isOpenBillDetailModal}
        loading={state.billDetailModalLoading}
        data={state.billsDetail}
        tab={state.billsDetailTab}
        changeTab={actions.changeBillsDetailTab}
        closeModal={() => { actions.closeBillDetailModal() }}
      />
    </Container>
  );
}

export default Dashboard;
