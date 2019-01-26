/**
 * @File   : Title.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 11:31:10 AM
 */
import * as React from 'react';
import { Link } from 'react-router-dom';

import assets from '../assets';

interface IPropTypes {

}

interface IStateTypes {

}

export default class Title extends React.PureComponent<IPropTypes, IStateTypes> {
  public render() {
    return <Link to="/level/1/1">
      <img src={assets.getSrc('test')} />
    </Link>;
  }
}
