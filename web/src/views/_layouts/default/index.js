import PropTypes from 'prop-types';
import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { Search } from '~/components/form';
import Header from '~/components/header';
// import Menu from '~/components/menu';
import Menu from '~/components/menu/group';
import Spinner from '~/components/spinner';
import useHeader from '~/view-data/use-header';
import { IconButton } from '~/components/crud/styles';
import { ActionsBar, Container, Wrapper } from '~/views/_layouts/default/styles';
import { formats } from '~/helper';

export default function Default({ children }) {
  const { state: headerState, actions: headerActions } = useHeader({ useFilter: false });
  const countText = !isNaN(headerState.count) ? ` (${formats.number(headerState.count)})` : '';

  function toogleFilter() {
    const act = headerState.filter.visible ? headerActions.hideFilter : headerActions.showFilter;
    act();
  };

  return (
    <Wrapper>
      <Menu />
      <div className='main' id="incanto-main">
        <Header>
          <div className='title'>{`${headerState.title ||
            ''}${countText}`}</div>
          <ActionsBar>
            <Spinner visible={headerState.loading} />
            {!headerState.filter.use && headerState.onSearch && (
              <Search onSearch={headerState.onSearch} />
            )}
            {headerState.filter.use && (
              <IconButton
                marked={headerState.filter.visible}
                type='button'
                title='Filtro'
                onClick={toogleFilter}
              >
                <FaFilter />
              </IconButton>
            )}
          </ActionsBar>
        </Header>
        <Container>{children}</Container>
      </div>
    </Wrapper>
  );
}

Default.propTypes = {
  children: PropTypes.element.isRequired,
};
