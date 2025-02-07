import { useState, useEffect } from 'react';

const useScroll = (props) => {
  const { id, handleOnScroll, hasMore } = props;
  const [loadMore, setLoadMore] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => { // watching var "loadMore" and loading data
    function load() {
      if (loadMore || firstLoad) {
        setLoadMore(false);
        setFirstLoad(false);
        handleOnScroll && handleOnScroll();
      }
    }
    load();
  });

  useEffect(() => { // watching event scroll from component
    const list = document.getElementById(id);

    const onScroll = (e) => {
      const el = e.target;
      if (el.scrollTop + el.clientHeight === el.scrollHeight) {
        setLoadMore(hasMore);
      }
    }

    if (list) {
      // register listener
      list.addEventListener('scroll', onScroll);
    }

    // umount => remove listener
    return () => {
      if (list) {
        list.removeEventListener('scroll', onScroll);
      }
      setFirstLoad(false);
    }
  });
}

export default useScroll;
