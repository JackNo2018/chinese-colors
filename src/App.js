import React, { useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import pinyin from 'pinyin';
import convert from 'color-convert';
import Loading from './components/Loading';
const ColorTitle = lazy(() => import('./components/ColorTitle'));
const Color = lazy(() => import('./components/Color'));
const Preview = lazy(() => import('./components/Preview'));
const ColorParam = lazy(() => import('./components/ColorParam'));
const InfoModal = lazy(() => import('./components/InfoModal'));
const IconInfo = lazy(() => import('./components/IconInfo'));
const Header = lazy(() => import('./components/Header'));
const IconScreenshot = lazy(() => import('./components/IconScreenshot'));
const ColorSet = lazy(() => import('./components/ColorSet'));

// import ColorTitle from './components/ColorTitle';
// import Color from './components/Color';
// import Preview from './components/Preview';
// import ColorParam from './components/ColorParam';
// import InfoModal from './components/InfoModal';
// import IconInfo from './components/IconInfo';
// import IconScreenshot from './components/IconScreenshot';
// import Header from './components/Header';
// import ColorSet from './components/ColorSet';

import { useModal, useColor, usePreview } from './hooks';

import colors from './assets/colors.json';

colors.push({
  name: '',
  colors: JSON.parse(localStorage.getItem('FAV_COLORS') || '[]')
});
const Colors = colors.map(set => {
  set.RGB = convert.hex.rgb(set.hex);
  set.colors = set.colors.map(c => {
    return {
      ...c,
      RGB: convert.hex.rgb(c.hex),
      CMYK: convert.hex.cmyk(c.hex),
      pinyin: pinyin(c.name, {
        heteronym: true, // 启用多音字模式
        segment: true // 启用分词，以解决多音字问题。
      })
        .map(item => {
          return item.length > 1 ? item[item.length - 1] : item;
        })
        .join(' ')
    };
  });
  return set;
});

console.log('colors:', Colors);

const Wrapper = styled.section`
  height: 100vh;
  display: flex;
  padding: 1rem 0.5rem;
  justify-content: space-evenly;
  transition: all 0.9s;
  .params {
    margin-right: 1rem;
  }
  .colorSet {
    position: fixed;
    bottom: 2rem;
    right: 3rem;
    padding: 0 1rem;
    z-index: 999;
  }
  .colorNav {
    position: relative;
    height: 100vh;
    width: 16rem;
    margin-right: 1.5rem;
    .colors {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 100vh;
      overflow-y: scroll;
    }
  }
  .btns {
    position: fixed;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;
console.log('colors', colors);
const App = () => {
  console.log('run app');
  const SelectedColorSet = JSON.parse(localStorage.getItem('SELECTED_COLOR_SET')) || Colors[0];
  const SelectedColor =
    JSON.parse(localStorage.getItem('SELECTED_COLOR')) || SelectedColorSet.colors[9];

  const { visible: modalVisible, showModal, closeModal } = useModal();
  const { preview, showPreview, closePreview } = usePreview();
  const { sets, currSet, currColor, updateCurrColor, updateCurrSet } = useColor({
    sets: Colors.map(set => {
      const newSet = { ...set };
      // delete newSet.colors;
      return newSet;
    }),
    currColor: SelectedColor,
    currSet: SelectedColorSet
  });
  useEffect(() => {
    document.body.style.backgroundColor = currColor.hex;
  }, [currColor]);
  return (
    <Suspense fallback={<Loading color="#000" size="4" sizeUnit="rem" />}>
      <Wrapper>
        <aside className="colorSet">
          <ColorSet sets={sets} currSetName={currSet.name} setCurrSet={updateCurrSet} />
        </aside>
        <nav className="colorNav">
          <ul className="colors">
            {currSet.colors.map((color, idx) => {
              return (
                <Color
                  seq={idx + 1}
                  isCurr={currColor.name == color.name}
                  setCurrColor={updateCurrColor}
                  {...color}
                  key={color.name}
                />
              );
            })}
          </ul>
        </nav>
        <ColorParam className="params" {...currColor} />
        <ColorTitle {...currColor}></ColorTitle>
        <Header rgb={currColor.RGB} />
        <section className="btns">
          <IconInfo showInfoModal={showModal} />
          <IconScreenshot showPreview={showPreview} />
        </section>
      </Wrapper>
      {preview && (
        <Preview
          closePreview={closePreview}
          name={currColor.name}
          pinyin={currColor.pinyin}
          color={currColor.hex}
          figure={currColor.figure}
        />
      )}
      {modalVisible && <InfoModal bgColor={currColor.hex} closeModal={closeModal} />}
    </Suspense>
  );
};
export default App;
