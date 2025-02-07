import React from 'react';
import { Formik } from 'formik';
import _ from 'lodash';
import Modal from '~/components/modal';
import { FlexRow } from '~/components/layout';
import { Autocomplete } from '~/components/form';
import { ModalContainer } from '~/views/report-templates/styles';

function AccountModal({ data = {}, isOpen, loading, title, closeModal, handleOnSubmit, listAccounts, disabled }) {

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      >
      {({ values, errors, touched, isValid, handleReset, setFieldTouched, ...rest }) => {
        return (
          <Modal
            width="500px"
            height="200px"
            open={isOpen}
            title={title}
            hideClose={true}
            onClose={() => { handleReset(); closeModal(); }}
            actions={[
              {
                label: 'Cancelar',
                action: () => { handleReset() ; closeModal() },
                disabled: loading
              },
              {
                label: 'Adicionar',
                action: () => { handleOnSubmit(values, { ...rest }); handleReset() ; closeModal() },
                primary: true,
                disabled: loading || !_.get(values, 'accountData.acctCode')
              }
            ]}
            >
            <ModalContainer>
              <section>
                <FlexRow>
                  <Autocomplete
                    name='accountData'
                    minLength={0}
                    keyField='acctCode'
                    label='Conta contábil'
                    value={_.get(values, 'accountData')}
                    disabled={disabled}
                    valueFormat={(row) => `${row.acctCode} - ${row.acctName}`}
                    loadData={listAccounts}
                    emptyText={'Pesquise uma conta contábil'}
                    tipText={'Digite... '}
                    loadingText={'Carregando...'}
                    notFoundText={'Não encontrada'}
                    />
                </FlexRow>
              </section>
            </ModalContainer>
          </Modal>
        );
      }}
    </Formik>
  );
}

export default AccountModal;
