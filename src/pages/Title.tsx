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
  started: boolean;
}

export default class Title extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    started: false
  };

  public render() {
    if (!this.state.started) {
      return (
        <div className={'title'} onClick={() => this.setState({started: true})}>
          <img className={'title-bg'} src={assets.getSrc('title-bg')} />
          <img className={'title-start'} src={assets.getSrc('title-start')} />
        </div>
      )
    }

    return (
      <UI
        state={'select'}
        level={1}
        subLevel={1}
        starCount={0}
        countDown={1}
        totalTime={1}
        onStart={() => {}}
        onBack={() => {}}
        onBackTitle={() => this.props.history.push('/title')}
      />
    );
  }
}
