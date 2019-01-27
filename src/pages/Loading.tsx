/**
 * @File   : Loading.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 11:31:19 AM
 */
import * as React from 'react';
import * as cx from 'classnames';

import assets from '../assets';

interface IPropTypes {
  progress: number;
  name: string;
}

interface IStateTypes {

}

export default class Loading extends React.PureComponent<IPropTypes, IStateTypes> {
  public render() {
    const {progress, name} = this.props;

    return (
      <div className={cx('loading')}>
        <img className={cx('loading-bg')} src={assets.getSrc('loading')} />
        <img className={cx('loading-img')} src={assets.getSrc('loading-img')} />
      </div>
    );
  }
}
