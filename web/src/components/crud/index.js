import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MdAdd, MdKeyboardBackspace } from 'react-icons/md';
import { Formik } from 'formik';
import _ from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Spinner from '~/components/spinner';
import DataTable from '~/components/datatable';
import FloatingButton from '~/components/floatbutton';
import { Container, FormHeader, FormToolbar, IconButton } from '~/components/crud/styles';

function Crud({ data, hideAdd, openForm = false, useOpenForm, columns, dataTableProps, dataTableOptions, rightWidth, emptyText, keyField, onCloseFilter, onRowClicked, onChangePage, tableLoading, formTitle, formLoading, actions, renderForm, formOptions }) {

  const [ showForm, setShowForm ] = useState(openForm);
  const toogleForm = () => setShowForm(!showForm);
  const closeForm = () => {
    setShowForm(false);
    onCloseFilter && onCloseFilter();
  };

  let flag = showForm;
  if (useOpenForm) {
    flag = openForm;
  }
  const handleOnSelect = useCallback(value => {
    setShowForm(true)
    onRowClicked(value)
  }, [setShowForm, onRowClicked]);

  return (
    <Container showForm={flag} rightWidth={rightWidth}>
      <div className='left'>
        <DataTable
          columns={columns}
          data={data}
          emptyText={emptyText}
          loading={tableLoading}
          onChangePage={onChangePage}
          onRowClicked={handleOnSelect}
          keyField={keyField}
          extraOptions={dataTableOptions || {}}
          {...(dataTableProps)}
          />

        {(!flag && !hideAdd) &&
          <FloatingButton
            icon={MdAdd}
            onClick={(e) => handleOnSelect({})}
            />
        }
      </div>

      {(flag) &&
        <div className='right'>
          <Formik
            enableReinitialize={true}
            validateOnMount={!formLoading}
            {...formOptions}
            >
            {(args) => {
              return <>
                <FormHeader>
                  {formTitle(args.values)}
                  <Spinner visible={formLoading} />
                </FormHeader>

                <PerfectScrollbar>
                  <fieldset className="form-contents" disabled={formLoading}>
                    {renderForm(args)}
                  </fieldset>
                </PerfectScrollbar>

                <FormToolbar>
                  <div className='buttons'>
                    <IconButton title="Cancelar" disabled={formLoading} onClick={closeForm}>
                      <MdKeyboardBackspace />
                    </IconButton>
                    {_.map(actions, (row, index) => (
                      <IconButton
                        key={index}
                        type={row.isSubmit ? 'submit' : 'button'}
                        title={row.label}
                        disabled={(formLoading || row.disabled || (row.isDisabled && row.isDisabled(args)))}
                        onClick={() => row.action(args.values, {toogleForm, ...args})}>
                        <row.icon />
                      </IconButton>
                    ))}
                  </div>
                </FormToolbar>
              </>
            }}
          </Formik>
        </div>
      }
    </Container>
  );
}

Crud.propTypes = {
  data: PropTypes.object.isRequired,
  tableLoading: PropTypes.bool,
  formLoading: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  emptyText: PropTypes.string.isRequired,
  onRowClicked: PropTypes.func,
  formTitle: PropTypes.func,
  onChangePage: PropTypes.func
}

Crud.defaultProps = {
  formTitle: () => '',
  onRowClicked: _.noop,
  formLoading: false,
  tableLoading: false,
  dataTableOptions: {},
  dataTableProps: {},
  data: {}
}

export default Crud
