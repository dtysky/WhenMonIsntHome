/**
 * @File   : Title.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 11:31:10 AM
 */
import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../assets';
import UI from '../component/UI';

interface IPropTypes extends RouteComponentProps<{}> {

}

interface IStateTypes {

}

export default class Title extends React.Component<IPropTypes, IStateTypes> {
  public render() {
    return (
      <UI
        state={'select'}
        level={1}
        subLevel={1}
        starCount={0}
        countDown={0}
        onStart={() => {}}
        onBack={() => {}}
      />
    );
  }
}
