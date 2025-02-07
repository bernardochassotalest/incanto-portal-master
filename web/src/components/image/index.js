import axios from 'axios';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Spinner from '~/components/spinner';
import api from '~/services/api';
import useGlobalContext from '~/view-data/use-global-context';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${(props) => (props.size ? props.size : '10px')};
  min-width: ${(props) => (props.size ? props.size : '10px')};

  position: relative;

  .label {
    font-size: 17px;
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: rgba(255, 255, 255, 1);
    text-shadow: 0 0 2px #000;
  }
`;

function Image({ ...props }) {
  const [loading, setLoading] = useState(false);
  const [withoutLoading] = useState(props.withoutLoading || false);
  const [src, setSrc] = useState(props.defaultImage);
  const unmounted = useRef(false);

  const {
    state: { auth = {} },
  } = useGlobalContext();

  if (auth && auth.token) {
    api.defaults.headers.Authorization = `Bearer ${auth.token}`;
  }

  function readFileAsync({ data }) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });
  }

  const load = useCallback((src, sourceToken) => {
    if (src && src.indexOf('data:image/') !== -1) {
      if (!unmounted.current) {
        setSrc(src);
        setLoading(false);
      }
    } else {
      api
        .get(src, { responseType: 'blob', cancelToken: sourceToken.token })
        .then(readFileAsync)
        .then((result) => {
          if (!unmounted.current) {
            setSrc(result);
            setLoading(false);
          }
        })
        .catch((e) => {
          if (!unmounted.current) {
            setSrc(null);
            setLoading(false);
          }
        });
    }
  }, []);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (props && props.src) {
      load(props.src, source);
    }
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line
  }, [load, props.src]);

  useEffect(() => {
    return () => {
      unmounted.current = false;
    };
  });

  return (
    <Container size={props.size}>
      <Spinner visible={!withoutLoading && loading} />
      {!loading && (
        <>
          <img src={src || null} alt='img' key={src} />
          <span className='label'>{props.alt}</span>
        </>
      )}
    </Container>
  );
}

export default memo(Image);
