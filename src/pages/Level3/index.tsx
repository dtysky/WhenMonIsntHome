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
import cx from 'classnames';
import * as gsap from 'gsap';

import assets from '../../assets';
import config from './config';
import './bass.scss';

class EasePunishing extends gsap.Ease {
  getRatio(p: number): number {
    return 1 - Math.cos(p * Math.PI / 2);
  }
}
const easePunishing = new EasePunishing();

interface IPropTypes extends RouteComponentProps<{sub: string}> {

}

interface IStateTypes {
  subLevel: number;
  distance: number;
  state: 'idle' | 'raising' | 'releasing' | 'punishing' | 'fail' | 'success';
  preFoot: 'left' | 'right';
  currentFoot: 'left' | 'right';
  currentTop: number;
  startY: number;
  currentY: number;
  t: number;
  velocity: number;
  acceleration: number;
  vigilance: number;
}

const CONSTANTS = {
  height: 240
};

function heightToMeter(height: number) {
  return height / CONSTANTS.height;
}

class Level1 extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    subLevel: 0,
    distance: 0,
    state: 'idle',
    preFoot: 'right',
    currentFoot: 'left',
    currentTop: 0,
    startY: 0,
    currentY: 0,
    t: 0,
    velocity: 0,
    acceleration: 0,
    vigilance: 0
  }

  public async componentDidMount() {
    this.updateSubLevel(this.props.match.params.sub);
  }

  public componentWillReceiveProps(nextProps: IPropTypes) {
    this.updateSubLevel(nextProps.match.params.sub);
  }

  private updateSubLevel(sub: string) {
    const subLevel = parseInt(sub, 10) - 1;

    this.setState({
      subLevel: subLevel,
      state: 'idle',
      preFoot: 'right',
      currentFoot: 'left',
      currentTop: 0,
      startY: 0,
      currentY: 0,
      t: 0,
      velocity: 0,
      acceleration: 0,
      vigilance: 0
    });
  }

  private handleTouchStart(name: 'left' | 'right', event: React.TouchEvent<HTMLImageElement>) {
    const {preFoot, state} = this.state;

    if (state !== 'idle') {
      return;
    }

    if (preFoot === name) {
      return;
    }

    if (event.touches.length !== 1) {
      return;
    }

    this.setState({
      currentY: 0,
      currentFoot: name,
      startY: event.touches[0].clientY,
      state: 'raising'
    });
  }

  private handleTouchEnd = (event: React.TouchEvent) => {
    const {state} = this.state;

    if (state !== 'raising' && state !== 'releasing') {
      return;
    }

    this.startPunishing();
    this.setState({state: 'punishing'});
  }

  private startPunishing() {
    const {autoReleaseTime} = config.sub[this.state.subLevel];
    const obj = {y: this.state.currentY};

    const velocity = heightToMeter(obj.y) / autoReleaseTime;
    this.setState({velocity});

    gsap.TweenLite.to(obj, autoReleaseTime, {
      y: 0,
      ease: easePunishing,
      onUpdate: () => {
        const {y} = obj;

        this.setState({currentY: y});
      },
      onComplete: () => this.end()
    });
  }

  private handleTouchMove = (event: React.TouchEvent) => {
    const {state} = this.state;

    if (state !== 'raising' && state !== 'releasing') {
      return;
    }

    if (event.touches.length !== 1) {
      return;
    }

    const {currentY: preY, startY, t: preT, velocity: preVelocity} = this.state;
    const {clientY} = event.touches[0];

    const currentY = startY - clientY;

    if (currentY > CONSTANTS.height) {
      return;
    }

    if (state === 'releasing' && currentY > preY) {
      return;
    }

    const t = performance.now() / 1000;
    const diffT = t - preT;
    const diffY = currentY - preY;
    const meter = heightToMeter(diffY);
    const velocity = -meter / diffT;
    // console.log(velocity);
    // const diffVelocity = velocity - preVelocity;
    // const acceleration = diffVelocity / diffT;

    if (currentY <= 0) {
      this.setState(
        {
          currentY: 0,
          velocity,
          currentTop: startY
        },
        () => this.end()
      );
      return;
    }

    if (state === 'raising' && currentY < preY) {
      this.state.state = 'releasing';
    }

    this.setState({
      currentY,
      t,
      velocity,
      // acceleration
    });
  }

  private end() {
    let {
      velocity, vigilance, currentTop,
      currentFoot, subLevel, distance
    } = this.state;
    const {
      topToStepFactor, distDistance,
      maxVigilance, overVelocity, vigilanceTh
    } = config.sub[subLevel];

    if (velocity > overVelocity) {
      vigilance = maxVigilance;
      this.setState({state: 'fail'});
      return;
    }

    const overVigilance = velocity - vigilanceTh;
    vigilance += overVigilance < 0 ? 0 : overVigilance;

    if (vigilance >= maxVigilance) {
      this.setState({state: 'fail'});
      return;
    }

    distance += heightToMeter(currentTop) * topToStepFactor;

    console.log(velocity, distance)

    if (distance >= distDistance) {
      this.setState({vigilance, distance, state: 'success'});
      return;
    }

    this.setState({
      state: 'idle',
      preFoot: currentFoot,
      vigilance,
      distance
    });
  }

  public render() {
    return (
      <div className={cx('level3')}>
        {this.renderScene()}
        {this.renderUI()}
        {this.renderFoots()}
        {this.renderResult()}
      </div>
    );
  }

  public renderScene() {
    return (
      <div className={cx('level3-scene')}>

      </div>
    );
  }

  public renderUI() {
    const {distance, velocity} = this.state;

    return (
      <div className={cx('level3-ui')}>
        <p>velocity: {velocity}</p>
        <p>distance: {distance}</p>
      </div>
    );
  }

  public renderFoots() {
    const {currentY, currentFoot} = this.state;

    return (
      <div
        className={cx('level3-foots')}
        style={{height: CONSTANTS.height}}
      >
        {
          ['left', 'right'].map((name: 'left' | 'right') => (
            <div
              key={name}
              className={cx('level3-foot', `level3-foot-${name}`)}
            >
              <div
                className={cx('level3-foot-bg')}
              />
              <img
                className={cx('level3-foot-button')}
                src={''}
                style={{
                  bottom: name === currentFoot ? currentY : 0
                }}
                onTouchStart={event => this.handleTouchStart(name, event)}
                onTouchEnd={this.handleTouchEnd}
                onTouchCancel={this.handleTouchEnd}
                onTouchMove={this.handleTouchMove}
              />
            </div>
          ))
        }
      </div>
    );
  }

  public renderResult() {
    const {state} = this.state;

    if (state !== 'fail' && state !== 'success') {
      return null;
    }

    return (
      <div className={'level3-result'}>

      </div>
    );
  }
}

export default withRouter(Level1);
