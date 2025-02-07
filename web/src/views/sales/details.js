import React from 'react';
import _ from 'lodash';
import { InputLabel } from '~/components/form';
import { ContentContainer } from '~/views/sales/styles';
import { formats } from '~/helper';
import { SalesStatusMapping } from '~/constants';
import { FlexRow, FlexItem } from '~/components/layout';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IconButton } from '~/components/crud/styles';
import Tabs from '~/components/tabs';
import TabItems from '~/views/sales/tab-items';
import TabSlips from '~/views/sales/tab-slips';
import TabDebits from '~/views/sales/tab-debits';
import TabCreditcards from '~/views/sales/tab-credit-cards';
import TabAccounting from '~/views/sales/tab-accounting';

const tabs = [
    { id: 'items', label: 'Itens', component: TabItems },
    { id: 'slips', label: 'Boletos', component: TabSlips },
    { id: 'debits', label: 'Débito Automático', component: TabDebits },
    { id: 'creditcards', label: 'Cartões de crédito', component: TabCreditcards },
    { id: 'accounting', label: 'Contabilidade', component: TabAccounting },
  ];

const addressFields = ['street', 'streetNo', 'complement', 'neighborhood'],
  addressLine2Fields = ['zipCode', 'city', 'state'];

const getAddressLine = (data) => {
  let filled = _.filter(addressFields, (f) => _.get(data, f)),
    filledLine2 = _.filter(addressLine2Fields, (f) => _.get(data, f)),
    join = (list, sep) => _.map(list, (f) => {
      let val = _.get(data, f);
      return f === 'zipCode' ? formats.cep(val) : val;
    }).join(sep)

  return `${join(filled, ', ')} - ${join(filledLine2, ' - ')}`;
};

const Info = ({ label, value }) => {
  return <InputLabel
    label={label}
    value={value}
    inputFontSize="13px"
    inputPadding="15px 10px 3px 8px"
    labelFontSize="11px"
    labelTop="15px" />
};

const SalesDetail = ({ data, tab, changeTab }) => {
  const leftFlex = '0 0 30%' ;

  return (
    <ContentContainer>
      <FlexRow>
        <FlexItem flex={leftFlex}>
          <FlexRow>
            <FlexItem flex="1">
              <Info label="Nr. Venda" value={_.get(data, 'header.billId') || ''} />
            </FlexItem>

            {_.get(data, 'header.url') &&
              <FlexItem flex="0 0 38px">
                <IconButton size={37} margin="none" title="Ver detalhes" onClick={() => window.open(_.get(data, 'header.url'), '_blank')}>
                  <HiOutlineExternalLink />
                </IconButton>
              </FlexItem>
            }
          </FlexRow>
        </FlexItem>
        <FlexItem flex="1">
          <Info label="Nome" value={_.get(data, 'header.customer.name') || ''} />
        </FlexItem>
      </FlexRow>

      <FlexRow>
        <FlexItem flex={leftFlex}>
          <Info label="Data Venda" value={formats.dateTimeZone(_.get(data, 'header.taxDate'), 'dd/MM/yyyy')} />
        </FlexItem>
        <FlexItem flex="1">
          <Info label="CPF" value={formats.cnpj_cpf(_.get(data, 'header.customer.vatNumber'))} />
        </FlexItem>
      </FlexRow>

      <FlexRow>
        <FlexItem flex={leftFlex}>
          <Info label="Status Venda" value={SalesStatusMapping[_.get(data, 'header.status')] || ''} />
        </FlexItem>
        <FlexItem flex="1">
          <Info label="E-mail" value={_.get(data, 'header.customer.email') || ''} />
        </FlexItem>
      </FlexRow>

      <FlexRow>
        <FlexItem flex={leftFlex}>
          <Info label="Tag" value={_.get(data, 'header.tag') || ''} />
        </FlexItem>
        <FlexItem flex="1">
          <Info label="Telefone" value={formats.phone(_.get(data, 'header.customer.phone'))} />
        </FlexItem>
      </FlexRow>

      <FlexRow>
        <FlexItem flex={leftFlex}>
          <Info label="Valor" value={formats.currency(_.get(data, 'header.amount'))} />
        </FlexItem>
        <FlexItem flex="1">
          <Info label="Endereço" value={getAddressLine(_.get(data, 'header.customer'))} />
        </FlexItem>
      </FlexRow>

      <Tabs
        initialTab='items'
        currentTab={tab}
        changeTab={changeTab}
        height='calc(100vh - 219px)'
        tabs={tabs}
        data={data || {}}
        />

    </ContentContainer>
  );
};

export default SalesDetail;
