import React, { useState, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { primary } from '~/components/mixins/color';
import { formats } from '~/helper';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

import EmptyState from '~/components/empty-state';
import DataTableComponent, { createTheme } from 'react-data-table-component';

createTheme('incanto', {
  selected: {
    default: primary.fade(0.25).string(),
  },
  highlightOnHover: {
    default: primary.fade(0.4).string(),
  },
});

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;

  > div {
    padding: 10px;
    background: #fff;
    border-radius: 3px;
    height: calc(100%);
    overflow: hidden;
  }
  > div > div {
    height: calc(100% - ${(props) => props.noPagination ? '0px' : '46px'});
    display: block;
  }
  .rdt_Pagination {
    justify-content: center;

    span {
      margin: 0;
    }
  }
  .rdt_TableBody {
    overflow-y: auto;
    overflow-x: hidden;
  }

  @media (max-width: 599px) {
    .rdt_Pagination {
      justify-content: flex-start;

      span {
        margin: 0 10px;
      }
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex !important;
  height: 56px !important;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;

  span {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.54);
    margin: 0 10px 0 0 !important;
    user-select: none;
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 8px;
  display: inline-flex;
  margin: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.54);

  &:hover:enabled, &:focus:enabled {
    background: rgba(0, 0, 0, 0.15);
  }
  ${(props) => props.disabled && css`
    opacity: 0.5;
    cursor: default;
    user-select: none;
  `}
`

const Pagination = (data) => ({ onChangePage  }) => {

  let page = parseInt((data.offset || 0) / (data.limit || 1), 10) + 1,
    lastPage = Math.ceil(data.count / data.limit),
    fromNum = data.offset + 1,
    toNum = Math.min(data.limit * page, data.count),
    isFirst = page === 1,
    isLast = page === lastPage;

  return <PaginationContainer>
    <span>
      {fromNum}-{toNum} de {formats.number(data.count)}
    </span>
    <IconButton disabled={isFirst} onClick={() => onChangePage(1)}>
      <MdFirstPage />
    </IconButton>
    <IconButton disabled={isFirst} onClick={() => onChangePage(page - 1)}>
      <MdNavigateBefore />
    </IconButton>
    <IconButton disabled={isLast} onClick={() => onChangePage(page + 1)}>
      <MdNavigateNext />
    </IconButton>
    <IconButton disabled={isLast} onClick={() => onChangePage(lastPage)}>
      <MdLastPage />
    </IconButton>
  </PaginationContainer>
};

function DataTable({ data, pageSize, columns, keyField = 'id', extraOptions, loading, emptyText, noPagination, onRowClicked, onChangePage }) {
  const [ selected, setSelected ] = useState(null);
  const dataList = _.cloneDeep(data.rows);

  const updateState = useCallback((value) => {
    onRowClicked(value);
    setSelected(_.get(value, keyField))
  }, [onRowClicked, keyField]);

  const handleChangePage = useCallback((page) => {
    onChangePage(page);
  }, [onChangePage]);

  const selectableRowSelected = (row) => {
    return _.get(row, keyField) === selected;
  }
  const tableColumns = useMemo(() => columns, [columns]);

  return (
    <Container noPagination={noPagination}>
      <DataTableComponent
        striped
        highlightOnHover
        pointerOnHover
        dense
        persistTableHead
        showRowHover
        overflowY
        pagination={!noPagination}
        selectableRowsHighlight={true}
        selectableRowSelected={selectableRowSelected}
        noHeader
        theme="incanto"
        paginationServer
        columns={tableColumns}
        data={dataList}
        paginationComponent={Pagination(data)}
        noDataComponent={<EmptyState text={emptyText} visible={true} size={'120px'} />}
        onRowClicked={updateState}
        progressComponent={<strong style={{padding: "15px", fontSize: "14px"}}>Aguarde...</strong>}
        paginationPerPage={data.limit || pageSize}
        progressPending={loading}
        paginationTotalRows={data.count || 0}
        onChangePage={(page) => handleChangePage((page - 1) * (data.limit || 0))}
        paginationComponentOptions={{ noRowsPerPage: true, rangeSeparatorText: 'de' }}
        {...extraOptions}
        />
    </Container>
  );
}

DataTable.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.array,
    limit: PropTypes.number,
    count: PropTypes.number
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      hide: PropTypes.oneOf([ 'sm', 'md', 'lg' ]), // sm (599px), md (959px), lg (1280px)
      selector: PropTypes.string,
      cell: PropTypes.func
    })
  ).isRequired,
  pageSize: PropTypes.number,
  emptyText: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  noPagination: PropTypes.bool.isRequired,
  keyField: PropTypes.string,
  onRowClicked: PropTypes.func,
  onChangePage: PropTypes.func.isRequired,
  extraOptions: PropTypes.object,
}

DataTable.defaultProps = {
  data: {
    rows: [],
    limit: 1,
    count: 0
  },
  loading: false,
  selected: false,
  pageSize: 20,
  emptyText: 'No record',
  onRowClicked: _.noop,
  onChangePage: _.noop,
  noPagination: false,
  extraOptions: {}
}

export default DataTable;
