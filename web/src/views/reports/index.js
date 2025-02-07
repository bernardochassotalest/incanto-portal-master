import React from 'react';
import _ from 'lodash';
import { Formik } from 'formik';
import { startOfMonth, endOfMonth } from 'date-fns';
import { MdKeyboardBackspace, MdCheck, MdClear } from 'react-icons/md';
import { Container, TreeNode, TreeContainer, ValueBox, NestedDiv } from '~/views/reports/styles';
import { formats } from '~/helper';
import confirm from '~/components/confirm';
import { FlexRow } from '~/components/layout';
import { IconButton, FormHeader, FormToolbar } from '~/components/crud/styles';
import useReports from '~/view-data/use-reports';
import useHeader from '~/view-data/use-header';
import EmptyState from '~/components/empty-state';
import Spinner from '~/components/spinner';
import FormFilter from '~/views/reports/filter';
import DetailsModal from '~/views/reports/modal-details';

const Nested = ({amount = 0, children}) => {
  if (amount === 0) {
    return children;
  }
  return <NestedDiv>{<Nested amount={amount - 1} children={children} />}</NestedDiv>;
};

const NodeRow = ({ node, getIndex, openDetail }) => {
  let index = getIndex(),
    isParent = !_.isEmpty(node.children) || !_.isEmpty(node.accounts),
    clickable = !!(node.account && node.value);

  return (
    <TreeNode level={node.level}>
      <FlexRow gap={0}>
        <div className="name-box">
          <Nested amount={node.level || 0}>
            <div className="name">
              <ValueBox odd={index % 2 === 0} isRoot={!node.level} clickable={clickable} onClick={() => clickable ? openDetail(node) : _.noop() }>
                <span>{node.name}</span>
              </ValueBox>
            </div>
          </Nested>
        </div>
        <div className="value">
          <ValueBox odd={index % 2 === 0} isParent={isParent} isNegative={node.value < 0} clickable={clickable} onClick={() => clickable ? openDetail(node) : _.noop() }>
            <span>{formats.currency(node.value)}</span>
          </ValueBox>
        </div>
      </FlexRow>
      {_.map(_.orderBy(node.children, ['order'], 'asc'), (child, idx) => (
        <NodeRow
          key={idx}
          getIndex={getIndex}
          node={child}
          openDetail={openDetail}
          />
      ))}
      {_.map(_.orderBy(node.accounts, ['order'], 'asc'), (account, idx) => (
        <NodeRow
          key={idx}
          getIndex={getIndex}
          openDetail={openDetail}
          node={{
            level: node.level + 1,
            order: account.order,
            value: account.value,
            account: _.get(account, 'accountData.acctCode'),
            name: `${_.get(account, 'accountData.acctCode')} - ${_.get(account, 'accountData.acctName')}` }}
          />
      ))}
    </TreeNode>
  );
};

function Reports() {
  let index = 0;
  const { state, actions } = useReports(),
    { state: headerState } = useHeader({ useFilter: false }),
    getIndex = () => {
      return index++;
    };

  const onExporToXlsx = async () => {
    const result = await confirm.show({ title: 'Atenção', text: `Deseja exportar uma planilha com os dados?` });
    if (result) {
      actions.exporToXlsx(state.modalData);
    }
  }

  return (
    <Container>
      <div className='report'>
        <Spinner size={32} visible={state.loading} />

        {!state.loading &&
          (_.isEmpty(state.data) ?
            <EmptyState text={"Nenhuma informação para ser exibida, tente mudar o filtro."} visible={true} size={'180px'} />
            :
            <TreeContainer>
              <NodeRow node={state.data} getIndex={getIndex} openDetail={actions.openDetailModal} />
            </TreeContainer>
          )
        }
      </div>

      {(!state.loading && _.get(headerState, 'filter.visible')) &&
        <div className='filter'>
          <Formik
            initialValues={_.get(headerState, 'filter.data')}
            enableReinitialize={true}>
              {
                (args) => {
                  return <>
                    <FormHeader> Filtro </FormHeader>
                    <FormFilter
                      {...args}
                      listTemplates={actions.listTemplates}
                      listTags={actions.listTags}
                      />

                    <FormToolbar>
                      <div className='buttons'>
                        <IconButton
                          type="button"
                          title="Cancelar"
                          disabled={state.loading}
                          onClick={actions.closeFilter}>
                          <MdKeyboardBackspace />
                        </IconButton>

                        <IconButton
                          type="button"
                          title="Limpar Filtro"
                          disabled={state.loading}
                          onClick={() => {
                            let now =  new Date();
                            actions.generate({ dateField: 'ref', startDate: startOfMonth(now), endDate: endOfMonth(now) });
                            actions.closeFilter();
                          }}>
                          <MdClear />
                        </IconButton>

                        <IconButton
                          type="button"
                          title="Aplicar Filtro"
                          disabled={state.loading}
                          onClick={() => actions.generate(args.values)}>
                          <MdCheck />
                        </IconButton>
                      </div>
                    </FormToolbar>
                  </>
                }
              }
          </Formik>

        </div>
      }

      <DetailsModal
        isOpen={state.isOpenDetailModal}
        loading={state.modalLoading}
        detailLoading={state.modalDetailLoading}
        data={state.modalData}
        closeModal={actions.closeDetailModal}
        exporToXlsx={onExporToXlsx}
        />
    </Container>
  );
}

export default Reports;
