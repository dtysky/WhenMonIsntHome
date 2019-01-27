/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 1/27/2019, 2:53:52 AM
 */
import * as React from 'react';
import * as cx from 'classnames';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../../assets';
import './base.scss';

interface IPropTypes extends RouteComponentProps<{}> {
  state: 'normal' | 'select' | 'result' | 'desc';
  level: number;
  subLevel: number;
  starCount: number;
  countDown: number;
  totalTime: number;
  onStart: () => void;
  onBack: () => void;
}

interface IStateTypes {

}

class UI extends React.Component<IPropTypes, IStateTypes> {
  private playSound() {

  }

  public render() {
    return (
      <div className={cx('ui')}>
        {this.renderCountDown()}
        {this.renderStars()}
        {this.renderSelect()}
        {this.renderResult()}
        {this.renderDesc()}
        <img
          className={cx('ui-button-back')}
          src={assets.getSrc('button-back')}
          onClick={() => {
            this.playSound();
            this.props.onBack();
          }}
        />
        {this.props.children}
      </div>
    );
  }

  public renderCountDown() {
    const scale = window.innerWidth / 414;
    const factor = (scale - 1) / 2;
    const {totalTime, countDown} = this.props;
    const progress = countDown / totalTime;

    return (
      <div
        className={cx('ui-countdown')}
        style={{
          transform: `scale(${scale}) translateX(${factor * 414}px)`
        }}
      >
        <div
          className={cx('ui-countdown-shoes')}
          style={{
            transform: `translateX(${360 * (1 - progress)}px)`
          }}
        >
          <img src={assets.getSrc('shoes1')} />
          <img src={assets.getSrc('shoes2')} />
        </div>
        <div className={cx('ui-countdown-bar')}>
          <img className={cx('ui-countdown-bar-box')} src={assets.getSrc('progress-box')} />
          <img
            className={cx('ui-countdown-bar-bar')}
            src={assets.getSrc('progress-bar')}
            style={{
              transform: `scaleX(${progress})`
            }}
          />
          <img className={cx('ui-countdown-bar-mom')} src={assets.getSrc('mom-come-soon')} />
          <p className={cx('ui-countdown-bar-text')}>
            {this.props.countDown.toFixed(2)}
          </p>
        </div>
        <img  className={cx('ui-countdown-door')} src={assets.getSrc('door')} />
      </div>
    );
  }

  public renderStars() {
    const {starCount} = this.props;

    const stars = [];
    for (let index = 0; index < 3; index += 1) {
      stars.push(2 - index);
    }

    return (
      <div className={cx('ui-stars')}>
        {stars.map(index => (
          <img
            key={index}
            src={assets.getSrc(index < starCount ? 'star-yellow' : 'star')}
          />
        ))}
      </div>
    );
  }

  public renderResult() {
    let {state} = this.props;

    if (state !== 'result') {
      return;
    }

    return (
      <div className={cx('ui-result')}>
        <img src={assets.getSrc('result-bg')} />
        <img
          className={cx(`star-${this.props.starCount}`)}
          src={assets.getSrc(`star-${this.props.starCount}`)}
        />
        <div
          className={cx('ui-result-restart')}
          onClick={() => {
            this.playSound();
            const {level, subLevel} = this.props;
            this.props.history.push(`/level/${level}/${subLevel}`)
          }}
        />
        <div
          className={cx('ui-result-next')}
          onClick={() => {
            this.playSound();
            let {level, subLevel} = this.props;
            subLevel += 1;

            if (subLevel > 3) {
              level += 1;
              subLevel = 1;
            }

            if (level >= 4) {
              return;
            }

            this.props.history.push(`/level/${level}/${subLevel}`);
          }}
        />
        <div
          className={cx('ui-result-back')}
          onClick={() => {
            this.playSound();
            this.props.onBack();
          }}
        />
      </div>
    );
  }

  public renderSelect() {
    let {state} = this.props;

    if (state !== 'select') {
      return;
    }

    const selects = [];
    for (let index = 0; index < 9; index += 1) {
      selects.push({row: ~~(index / 3), col: index % 3});
    }

    const left = 19;
    const top = 34;
    const width = 15;
    const height = 8;
    const rowSpace = 6;
    const colSpace = 9;

    return (
      <div className={cx('ui-select')}>
        <img src={assets.getSrc('level-select')} />
        {selects.map(({row, col}, index) => (
          <div
            key={index}
            style={{
              width: `${width}%`,
              height: `${height}%`,
              left: `${left + col * (width + colSpace)}%`,
              top: `${top + row * (height + rowSpace)}%`
            }}
            onClick={() => {
              this.playSound();
              this.props.history.push(`/level/${row + 1}/${col + 1}`);
            }}
          />
        ))}
      </div>
    );
  }

  public renderDesc() {
    const {state, level, subLevel} = this.props;

    if (state !== 'desc') {
      return;
    }

    return (
      <div className={cx('ui-desc')}>
        <img src={assets.getSrc('confirm-ui')} />
        <div
          className={cx('ui-desc-desc')}
        />
        <div
          className={cx('ui-desc-condition')}
        />
        <div
          className={cx('ui-desc-start')}
          onClick={() => {
            this.playSound();
            this.props.onStart();
          }}
        />
        <div
          className={cx('ui-desc-back')}
          onClick={() => {
            this.playSound();
            this.props.onBack();
          }}
        />
      </div>
    )
  }
}

export default withRouter(UI);
