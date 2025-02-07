import React from 'react';
import useSalesDetail from '~/view-data/use-sales-detail';
import DetailPanel from '~/views/sales/details';
import Spinner from '~/components/spinner';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IconButton } from '~/components/crud/styles';
import { Container, DetailContents } from '~/views/sales/styles';

function SalesDetail({ acls, history }) {
  const { state, actions } = useSalesDetail();

  return (
    <Container>
      { state.loading ?
        <Spinner visible={true} />
        :
        <DetailContents>
          <div className="contents">
            <DetailPanel
              data={state.model}
              tab={state.detailTab}
              changeTab={actions.changeDetailTab}
              />
          </div>

          <div className="actions">
            <IconButton onClick={() => history.push('/sales')}>
              <MdKeyboardBackspace />
            </IconButton>
          </div>
        </DetailContents>
      }
    </Container>
  );
}

export default SalesDetail;
