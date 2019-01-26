/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/26/2019, 11:24:44 AM
 */
import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

interface IPropTypes extends RouteComponentProps<{sub: string}> {

}

interface IStateTypes {

}

class Level1 extends React.Component<IPropTypes, IStateTypes> {
  public async componentDidMount() {
    const subLevel = this.props.match.params.sub;
  }
  public render() {
    return null;
  }
}

export default withRouter(Level1);
