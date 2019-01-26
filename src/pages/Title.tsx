/**
 * @File   : Title.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 11:31:10 AM
 */
import * as React from 'react';

import assets from '../assets';

interface IPropTypes {

}

interface IStateTypes {

}

export default class Title extends React.PureComponent<IPropTypes, IStateTypes> {
  public render() {
    return <img src={assets.getSrc('test')} />;
  }
}
