import React from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { MdAdd, MdPlaylistAdd, MdDelete } from 'react-icons/md';
import Fieldset from '~/components/fieldset';
import confirm from '~/components/confirm';
import { FlexRow } from '~/components/layout';
import { Autocomplete, InputLabel, InputGroup, Select } from '~/components/form';
import { IconButton } from '~/components/crud/styles';
import { TreeContainer, FormContainer, NestedDiv, TreeNode } from '~/views/report-templates/styles';
import AccountsModal from '~/views/report-templates/modal-accounts';

const getRandomId = () => {
  return `${_.random(100, 200)}-${new Date().getTime()}-${_.random(150, 300)}` ;
};

const Nested = ({amount = 0, children}) => {
  if (amount === 0) {
    return children;
  }
  return <NestedDiv>{<Nested amount={amount - 1} children={children} />}</NestedDiv>;
};

const AccountRow = ({ values, node, index, level, pIndex, handleAccountsUpdate, handleAccountRemove, previewMode }) => {
  let base = _.get(values, `items[${pIndex}].accounts[${index}]`);
  return (
    <TreeNode level={level}>
      <FlexRow>
        <div className="name-box">
          <Nested amount={level || 0}>
            <div className="name">
              <InputLabel
                label="Conta contábil"
                noMargin={true}
                value={`${_.get(base, 'accountData.acctCode') || ''} - ${_.get(base, 'accountData.acctName') || ''}`}
                />
            </div>
          </Nested>
        </div>
        <div className="order">
          <InputGroup
            type='number'
            name={`items[${pIndex}].accounts[${index}].order`}
            label='Ordem'
            noMargin={true}
            disabled={previewMode}
            onBlur={() => handleAccountsUpdate(pIndex)}
            />
        </div>
        <div className="actions">
          <IconButton
            type="button"
            title="Remover conta"
            size={32}
            margin="-1px"
            disabled={previewMode}
            onClick={() => handleAccountRemove(node, pIndex)}>
            <MdDelete />
          </IconButton>
        </div>
      </FlexRow>
    </TreeNode>
  );
};

const NodeRow = ({ values, node, isParent, index, updateTree, handleAccountsUpdate, handleNodeRemove, handleNodeAdd, handleAccountRemove, handleIncludeAccounts, previewMode }) => {

  return (
    <TreeNode level={node.level}>
      <FlexRow>
        <div className="name-box">
          <Nested amount={node.level || 0}>
            <div className="name">
              {!node.level ?
                <InputLabel
                  label="Nome do modelo de relatório"
                  noMargin={true}
                  value={node.name}
                  />
                :
                <InputGroup
                  type='text'
                  name={`items[${index}].name`}
                  label='Nome'
                  readOnly={!node.level}
                  noMargin={true}
                  disabled={previewMode}
                  />
              }
            </div>
          </Nested>
        </div>
        { node.level > 0 &&
          <div className="order">
            <InputGroup
              type='number'
              name={`items[${index}].order`}
              label='Ordem'
              noMargin={true}
              disabled={previewMode}
              onBlur={() => updateTree()}
              />
          </div>
        }
        <div className="actions">
          { node.level > 0 &&
            <IconButton title="Remover" type="button" size={32} margin="-1px" disabled={previewMode} onClick={() => handleNodeRemove(node)}>
              <MdDelete />
            </IconButton>
          }
          {_.isEmpty(node.accounts) &&
            <IconButton title="Inserir" type="button" size={32} margin="-1px" disabled={previewMode} onClick={() => handleNodeAdd(node)}>
              <MdAdd />
            </IconButton>
          }
          {node.level > 0 && !isParent(node.id) &&
            <IconButton title="Inserir conta" type="button" size={32} margin="-1px" disabled={previewMode} onClick={() => handleIncludeAccounts(node)}>
              <MdPlaylistAdd />
            </IconButton>
          }
        </div>
      </FlexRow>
      {_.map(node.accounts, (account, idx) => (
        <AccountRow
          key={idx}
          node={account}
          level={node.level + 1}
          pIndex={index}
          values={values}
          index={idx}
          previewMode={previewMode}
          handleAccountsUpdate={handleAccountsUpdate}
          handleAccountRemove={handleAccountRemove}
          />
      ))}
    </TreeNode>
  );
};

export const ReportTemplateForm = ({ errors, findChildTreeIds, findNodeById, listTags, updateTree, touched, values, modalData, previewMode, setFieldValue, isOpenAccountModal, handleAccountModalClose, handleAccountModalOpen, listAccounts }) => {

  const handleNodeRemove = async (node) => {
    const result = await confirm.show({
      title: 'Atenção',
      text: `Deseja realmente remover o item "${node.name}"?`,
    });

    if (result) {
      let ids = findChildTreeIds(values.items, node),
        list = _.cloneDeep(values.items);
      _.remove(list, (r) => ids.includes(r.id));
      handleUpdateTree(list);
    }
  };

  const handleNodeAdd = (node) => {
    let list = _.cloneDeep(values.items);
    list.push({ id: getRandomId(), father: node.id, name: '', level: node.level + 1, order: 0 });
    setFieldValue('items', list);
    handleUpdateTree(list);
  };

  const handleAccountRemove = async (node, pIndex) => {
    const result = await confirm.show({
      title: 'Atenção',
      text: `Deseja realmente remover a conta contábil "${_.get(node, 'accountData.acctName')}"?`,
    });

    if (result) {
      let list = _.cloneDeep(values.items);
      _.remove(list[pIndex].accounts, (r) => _.get(r, 'accountData.acctCode') === _.get(node, 'accountData.acctCode'));
      setFieldValue('items', list);
      setFieldValue('_', new Date().getTime());
      handleUpdateTree(list);
    }
  };

  const handleIncludeAccounts = (node) => {
    handleAccountModalOpen(node);
  };

  const handleAccountModalSubmit = (node) => {
    let list = _.cloneDeep(values.items),
      index = _.findIndex(list, { id: node.id });

    if (index >= 0) {
      list[index].accounts = list[index].accounts || [];
      let found = _.find(list[index].accounts, (r) => _.get(r, 'accountData.acctCode') === _.get(node, 'accountData.acctCode'));
      if (!found) {
        list[index].accounts.push({ accountData: node.accountData, order: _.size(list[index].accounts) });
        list[index].accounts = _.orderBy(list[index].accounts, ['order'], ['asc']);
      }
    }
    setFieldValue('items', list);
  };

  const handleAccountsUpdate = (index) => {
    let list = _.cloneDeep(values.items);

    if (index >= 0) {
      list[index].accounts = _.orderBy(list[index].accounts, ['order'], ['asc']);
    }
    setFieldValue('items', list);
  };

  const handleUpdateTree = (list) => {
    updateTree(values, list || values.items);
  };

  return (
    <FormContainer>
      <InputGroup
        type='text'
        name='name'
        label='Nome'
        disabled={previewMode}
        hasError={errors.name && touched.name}
        />

      <Select
        name="type"
        label="Tipo"
        options={{
          values: [
            { value: '', label: 'Escolha' },
            { value: 'balance_sheet', label: 'Balanço' },
            { value: 'trial_balance', label: 'Balancete' },
            { value: 'profit_loss', label: 'Demonstração de Resultado' }
          ],
        }}
        />

      <Autocomplete
        name="tag"
        minLength={0}
        keyField="tag"
        keyApp={`tags`}
        label="Tags"
        value={values.tag}
        valueFormat={row => `${row.tag}`}
        loadData={listTags}
        emptyText={"Selecione uma Tag"}
        tipText={"Digite... "}
        loadingText={"Carregando..."}
        notFoundText={"Não encontrada"}
        />

      <TreeContainer>
        <Fieldset label="Estrutura">
            <NodeRow
              index={-1}
              node={{ id: 'root', name: values.name, level: 0 }}
              handleNodeAdd={handleNodeAdd}
              isParent={() => false}
              />
            {_.map(values.items, (item, index) => (
              <NodeRow
                key={index}
                node={item}
                index={index}
                values={values}
                isParent={(id) => !!_.find(values.items, { father: id }) }
                previewMode={previewMode}
                updateTree={handleUpdateTree}
                handleNodeRemove={handleNodeRemove}
                handleNodeAdd={handleNodeAdd}
                handleIncludeAccounts={handleIncludeAccounts}
                handleAccountsUpdate={handleAccountsUpdate}
                handleAccountRemove={handleAccountRemove}
                />
            ))}
        </Fieldset>
      </TreeContainer>

      <AccountsModal
        isOpen={isOpenAccountModal}
        loading={false}
        data={modalData}
        handleOnSubmit={handleAccountModalSubmit}
        closeModal={handleAccountModalClose}
        listAccounts={listAccounts}
        title={<span>Escolha uma conta contábil</span>}
        />
    </FormContainer>
  );
};

export const ReportTemplateSchema = Yup.object().shape({
  name: Yup.string().required('Informe o nome do Modelo de Relatório'),
  type: Yup.string().required('Informe o Tipo')
});
