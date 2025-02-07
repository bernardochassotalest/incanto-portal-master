import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { MdAdd, MdKeyboardBackspace } from 'react-icons/md';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _ from 'lodash';
import { Container, FormToolbar, IconButton, Overlay } from 'components/list/styles';
import Spinner from '~/components/spinner';
import DataTable from '~/components/datatable';
import FloatingButton from '~/components/floatbutton';

function List({ data, columns, hideAdd, emptyText, showFilter, keyField, onRowClicked, onChangePage, onCloseFilter, tableLoading, formLoading, formOptions, renderForm, actions }) {

  const handleOnSelect = useCallback(value => {
    onRowClicked(value);
  }, [onRowClicked]);

  return (
    <Container showForm={showFilter}>
      <div className='left'>
        <DataTable
          columns={columns}
          data={data}
          emptyText={emptyText}
          loading={tableLoading}
          keyField={keyField}
          onChangePage={onChangePage}
          onRowClicked={handleOnSelect}
        />

        {
          !showFilter && !hideAdd &&
          <FloatingButton
            icon={MdAdd}
            onClick={(e) => handleOnSelect({})}
          />
        }
      </div>

      {
        showFilter &&
        <div className='right'>
          <Overlay visible={formLoading} />

          <Formik
            enableReinitialize={true}
            validateOnMount={true}
            {...formOptions}
            >
            {(args) => {
              return <>
                <PerfectScrollbar>
                  {renderForm(args)}
                </PerfectScrollbar>

                <FormToolbar>
                  <Spinner visible={formLoading} />
                  <div className='buttons'>
                    <IconButton title="Cancelar" disabled={formLoading} onClick={onCloseFilter}>
                      <MdKeyboardBackspace />
                    </IconButton>
                    {
                      _.map(actions, (row, index) => (
                        <IconButton
                          key={index}
                          type={row.isSubmit ? 'submit' : 'button'}
                          title={row.label}
                          disabled={(formLoading || row.disabled || (row.isDisabled && row.isDisabled(args)))}
                          onClick={
                            row.isSubmit
                              ? args.handleSubmit
                              : () => row.action(args.values)
                          }>
                          <row.icon />
                        </IconButton>
                      ))
                    }
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

List.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  formLoading: PropTypes.bool.isRequired,
  emptyText: PropTypes.string.isRequired,
  onRowClicked: PropTypes.func,
  onChangePage: PropTypes.func.isRequired,
  onCloseFilter: PropTypes.func,
  actions: PropTypes.array.isRequired,
}

List.defaultProps = {
  onRowClicked: _.noop,
  tableLoading: false,
  formLoading: false,
  actions: [],
}

export default List;