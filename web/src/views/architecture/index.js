import _ from 'lodash';
import { BASE_URL } from '~/constants';
import React, { useEffect } from 'react';
import ModalImage from 'react-modal-image';
import useGlobalContext from '~/view-data/use-global-context';
import { Container, ContentContainer, BoxContainer, LinksContainer, DocumentButton } from '~/views/architecture/styles';

import useHeader from '~/view-data/use-header';
import imgArch from '~/assets/arquitetura.png';
import imgArchThumb from '~/assets/arquitetura-thumb.png';
import imgModel from '~/assets/modelagem.png';
import imgModelThumb from '~/assets/modelagem-thumb.png';
import imgAvtCont01 from '~/assets/avanti-contabil-0103.png';
import imgAvtCont01Thumb from '~/assets/avanti-contabil-0103-thumb.png';
import imgAvtCont02 from '~/assets/avanti-contabil-0203.png';
import imgAvtCont02Thumb from '~/assets/avanti-contabil-0203-thumb.png';
import imgAvtCont03 from '~/assets/avanti-contabil-0303.png';
import imgAvtCont03Thumb from '~/assets/avanti-contabil-0303-thumb.png';

/*
Geração das miniaturas

convert -define png:size=300x300 arquitetura.png -thumbnail 300x300^ -gravity center -background white -extent 300x300 arquitetura-thumb.png
convert -define png:size=300x300 modelagem.png -thumbnail 300x300^ -gravity center -background white -extent 300x300 modelagem-thumb.png
convert -define png:size=300x300 avanti-contabil-0103.png -thumbnail 300x300^ -gravity center -background white -extent 300x300 avanti-contabil-0103-thumb.png
convert -define png:size=300x300 avanti-contabil-0203.png -thumbnail 300x300^ -gravity center -background white -extent 300x300 avanti-contabil-0203-thumb.png
convert -define png:size=300x300 avanti-contabil-0303.png -thumbnail 300x300^ -gravity center -background white -extent 300x300 avanti-contabil-0303-thumb.png

*/

function Home() {
  const { actions } = useHeader({ useFilter: false });
  const { state: { auth = {} } } = useGlobalContext();

  const serverUrl = `${BASE_URL}/architecture/documentation`,
    docList = [
      { id: 1,  name: 'NewC - API - Roboticket', url: `${serverUrl}?fileName=newc-api-v0.37.pdf&token=${auth.token}` },
      { id: 2,  name: 'NewC - API - Dedicated', url: `${serverUrl}?fileName=newc-api-dedicated-v03.pdf&token=${auth.token}` },
      { id: 3,  name: 'Vindi - API', url: 'https://vindi.github.io/api-docs/dist/' },
      { id: 4,  name: 'Cielo - Extrato Eletrônico', url: `${serverUrl}?fileName=cielo-extrato-eletronico-v14.pdf&token=${auth.token}` },
      { id: 5,  name: 'Rede - Vendas Crédito - EEVC', url: `${serverUrl}?fileName=rede-vendas-credito-eevc.pdf&token=${auth.token}` },
      { id: 6,  name: 'Rede - Vendas Débito - EEVD', url: `${serverUrl}?fileName=rede-vendas-debito-eevd.pdf&token=${auth.token}` },
      { id: 7,  name: 'Rede - Financeiro - EEFI', url: `${serverUrl}?fileName=rede-financeiro-eefi.pdf&token=${auth.token}` },
      { id: 8,  name: 'Rede - Saldos - EESA', url: `${serverUrl}?fileName=rede-saldos-em-aberto-eesa.pdf&token=${auth.token}` },
      { id: 9,  name: 'Itaú - Boletos 400 posições', url: `${serverUrl}?fileName=itau-boletos-400.pdf&token=${auth.token}` },
      { id: 10, name: 'Itaú - Débito 240 posições', url: `${serverUrl}?fileName=itau-debito-240.pdf&token=${auth.token}` },
      { id: 11, name: 'Itaú - Débito 150 posições', url: `${serverUrl}?fileName=itau-debito-150.pdf&token=${auth.token}` },
      { id: 12, name: 'Itaú - Extrato 240 posições', url: `${serverUrl}?fileName=itau-extrato-240.pdf&token=${auth.token}` },
      { id: 13, name: 'Bradesco - Boletos - 400 posições', url: `${serverUrl}?fileName=bradesco-boletos-400.pdf&token=${auth.token}` },
      { id: 14, name: 'Bradesco - Extrato - 240 posições', url: `${serverUrl}?fileName=bradesco-extrato-240.pdf&token=${auth.token}` },
      { id: 14, name: 'Portal - Sincronismo de Arquivos', url: `${serverUrl}?fileName=processo-de-sincronismo-de-arquivos-v1.2.pdf&token=${auth.token}` },
    ];

  useEffect(() => {
    actions.configure({
      title: 'Documentação Técnica',
      count: 'none',
      useFilter: false,
      onSearch: null
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <ContentContainer>
        <BoxContainer>
          <div className="thumbs">
            <span>Arquitetura</span>
            <ModalImage
              hideDownload={false}
              hideZoom={false}
              small={imgArchThumb}
              large={imgArch}
              alt="Arquitetura"
            />
          </div>

          <div className="thumbs">
            <span>Modelagem</span>
            <ModalImage
              hideDownload={false}
              hideZoom={false}
              small={imgModelThumb}
              large={imgModel}
              alt="Modelagem"
            />
          </div>

          <div className="thumbs">
            <span>Avanti - Contábil 1/3</span>
            <ModalImage
              hideDownload={false}
              hideZoom={false}
              small={imgAvtCont01Thumb}
              large={imgAvtCont01}
              alt="Modelagem"
            />
          </div>

          <div className="thumbs">
            <span>Avanti - Contábil 2/3</span>
            <ModalImage
              hideDownload={false}
              hideZoom={false}
              small={imgAvtCont02Thumb}
              large={imgAvtCont02}
              alt="Modelagem"
            />
          </div>

          <div className="thumbs">
            <span>Avanti - Contábil 3/3</span>
            <ModalImage
              hideDownload={false}
              hideZoom={false}
              small={imgAvtCont03Thumb}
              large={imgAvtCont03}
              alt="Modelagem"
            />
          </div>
        </BoxContainer>
        <LinksContainer>
          <span>Manuais</span>
          <div>
            {_.map(docList, (doc, index) => (
              <DocumentButton
                  key={index}
                  className='active'
                  onClick={() => window.open(doc.url, '_blank')}>
                {doc.name}
              </DocumentButton>
            ))}
          </div>
        </LinksContainer>
      </ContentContainer>
    </Container>
  );
};

export default Home;
