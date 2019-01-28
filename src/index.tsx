/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2018-7-7 00:25:02
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import * as es6ObjectAssign from 'es6-object-assign';

es6ObjectAssign.polyfill();

import App from './App';
import './base.scss';

document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, {passive: false});

const render = () => {
  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>,
    document.getElementById('container')
  );
};

render();
