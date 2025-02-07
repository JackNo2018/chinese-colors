import { useState, useReducer, useEffect } from 'react';

const useMobile = (width = 750) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= width);

  console.log('mmmmmm');
  useEffect(() => {
    const checkMobile = () => {
      console.log('rrrr');

      if (window.innerWidth <= width) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile, true);
    };
  }, [width]);
  return { isMobile };
};

const usePreview = () => {
  const [preview, setPreview] = useState(false);
  const closePreview = () => {
    setPreview(false);
  };
  const showPreview = () => {
    setPreview(true);
  };
  return { preview, closePreview, showPreview };
};

const useModal = () => {
  const [visible, setVisible] = useState(false);
  const closeModal = () => {
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  return { visible, closeModal, showModal };
};

const useColor = initialValue => {
  const execSideEffect = obj => {
    localStorage.setItem('SELECTED_COLOR', JSON.stringify(obj));
    let arr = document.title.split(' - ');
    document.title = arr.length > 1 ? `${obj.name} - ${arr[1]}` : `${obj.name} - ${arr[0]}`;
    let metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', obj.hex);
  };
  const reducer = (state, action) => {
    const { type, payload } = action;
    const { currSet, sets } = state;
    switch (type) {
      case 'UPDATE_COLOR': {
        let c = currSet.colors.find(c => c.name === payload.name);
        execSideEffect(c);
        return { ...state, currColor: c };
      }
      case 'UPDATE_COLOR_SET': {
        let cs = sets.find(cs => cs.name === payload.name);
        localStorage.setItem('SELECTED_COLOR_SET', JSON.stringify(cs));
        if (payload.name == '') {
          cs.colors = JSON.parse(localStorage.getItem('FAV_COLORS') || '[]');
        }
        execSideEffect(cs.colors[0]);
        return { ...state, currSet: cs, currColor: cs.colors[0] };
      }
      default:
        throw new Error();
    }
  };
  const { currColor } = initialValue;
  execSideEffect(currColor);
  const [state, dispatch] = useReducer(reducer, initialValue);
  const updateCurrColor = name => {
    dispatch({ type: 'UPDATE_COLOR', payload: { name } });
  };
  const updateCurrSet = name => {
    dispatch({ type: 'UPDATE_COLOR_SET', payload: { name } });
  };
  console.log('useReducer store', state);

  return { ...state, updateCurrColor, updateCurrSet };
};

export { useModal, usePreview, useColor, useMobile };
export default useColor;
