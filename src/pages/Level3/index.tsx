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
import UI from '../../component/UI'
import config from './config';
import timer from './timer';
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
  countDown: number;
  state: 'preStart' | 'idle' | 'raising' | 'releasing' | 'punishing' | 'fail' | 'success';
  preFoot: 'left' | 'right';
  currentFoot: 'left' | 'right';
  currentTop: number;
  startY: number;
  currentY: number;
  t: number;
  velocity: number;
  acceleration: number;
  vigilance: number;
  starCount: number;
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
    countDown: 0,
    state: 'preStart',
    preFoot: 'right',
    currentFoot: 'left',
    currentTop: 0,
    startY: 0,
    currentY: 0,
    t: 0,
    velocity: 0,
    acceleration: 0,
    vigilance: 0,
    starCount: 0
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
      distance: 0,
      state: 'preStart',
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
    const y = this.state.currentY;
    const obj = {y};

    const velocity = heightToMeter(obj.y) / autoReleaseTime;
    this.setState({velocity});

    gsap.TweenLite.to(obj, autoReleaseTime, {
      y: 0,
      ease: easePunishing,
      onUpdate: () => {
        const {y} = obj;

        this.setState({currentY: y});
      },
      onComplete: () => {
        if (this.state.currentTop === 0) {
          this.state.currentTop = y;
        }
        this.end();
      }
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
      currentFoot, subLevel, distance, countDown
    } = this.state;
    const {
      topToStepFactor, distDistance,
      maxVigilance, overVelocity, vigilanceTh,
      goodTime, goodVigilance
    } = config.sub[subLevel];

    if (velocity > overVelocity) {
      vigilance = maxVigilance;
      timer.stop();
      this.setState({state: 'fail', starCount: 0});
      return;
    }

    const overVigilance = velocity - vigilanceTh;
    vigilance += overVigilance < 0 ? 0 : overVigilance;

    if (vigilance >= maxVigilance) {
      timer.stop();
      this.setState({state: 'fail', starCount: 0});
      return;
    }

    distance += heightToMeter(currentTop) * topToStepFactor;

    console.log(velocity, distance)

    if (distance >= distDistance) {
      timer.stop();
      let starCount = 1;

      if (countDown < goodTime) {
        starCount += 1;
      }

      if (vigilance < goodVigilance) {
        starCount += 1;
      }

      this.setState({vigilance, distance, state: 'success', starCount});
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
        {this.renderFoots()}
        {this.renderUI()}
      </div>
    );
  }

  public renderScene() {
    const {subLevel, distance} = this.state;
    const {distDistance} = config.sub[subLevel];

    return (
      <div className={cx('level3-scene')}>
        <img
          className={cx('level3-scene-bg')}
          src={assets.getSrc('level3-bg')}
          style={{
            left: `${-distance / distDistance * 100}%`
          }}
        />
        <img
          className={cx('level3-scene-snoze')}
          src={assets.getSrc('level3-snoze')}
          style={{
            transform: `scaleX(${distance < 5 ? 1 : -1})`
          }}
        />
      </div>
    );
  }

  public renderUI() {
    const {
      state, starCount, subLevel,
      countDown, vigilance
    } = this.state;
    const {maxVigilance} = config.sub[subLevel];

    let color = '#fff';

    if (vigilance / maxVigilance > .5) {
      color = '#ff0';
    }

    if (vigilance / maxVigilance > .8) {
      color = '#f00';
    }

    let uiState = 'normal';

    if (state === 'fail' || state === 'success') {
      uiState = 'result';
    }

    if (state === 'preStart') {
      uiState = 'desc';
    }

    return (
      <UI
        state={uiState as any}
        level={3}
        subLevel={subLevel + 1}
        countDown={countDown}
        starCount={starCount}
        totalTime={config.sub[subLevel].timeout}
        onStart={() => {
          timer.start(
            config.sub[subLevel].timeout,
            (countDown: number) => this.setState({countDown}),
            () => {
              if (this.state.state !== 'success' && this.state.state !== 'fail') {
                this.setState({state: 'fail'})
              }
            }
          );
          this.setState({state: 'idle'});
        }}
        onBack={() => this.props.history.push('/title')}
      >
        <p
          className={cx('level3-vigilance')}
          style={{color}}
        >
          警戒值： {this.state.vigilance.toFixed(2)}
        </p>
      </UI>
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
              <img
                className={cx('level3-foot-bg')}
                src={assets.getSrc('level3-bar')}
              />
              <img
                className={cx('level3-foot-button')}
                src={assets.getSrc(`level3-foot-${name}`)}
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
}

export default withRouter(Level1);
