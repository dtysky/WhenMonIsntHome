/**
 * @File   : App.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2018-7-7 00:37:29
 */
import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import Title from './pages/Title';
import Loading from './pages/Loading';
import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import Level3 from './pages/Level3';

interface IPropTypes extends RouteComponentProps<{}> {

}

interface IStateTypes {
  gameState: 'pre' | 'loading' | 'gaming';
}

class App extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    gameState: 'pre'
  };

  public render() {
    const {gameState} = this.state;

    if (gameState === 'pre') {
      return this.renderPre();
    }

    if (gameState === 'loading') {
      return this.renderLoading();
    }

    return this.renderMain();
  }

  public renderPre() {
    return null;
  }

  public renderLoading() {
    return null;
  }

  public renderMain() {
    return (
      <Switch>
        <Route path={'/title'} component={Title} /> 
        <Route path={'/level/1/:sub'} component={Level1} /> 
        <Route path={'/level/2/:sub'} component={Level2} /> 
        <Route path={'/level/3/:sub'} component={Level3} />
        <Route render={() => <Redirect to={'/title'} />} />
      </Switch>
    );
  }
}

export default withRouter(App);
