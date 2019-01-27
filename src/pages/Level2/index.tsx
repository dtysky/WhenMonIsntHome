import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../../assets';
import UI from '../../component/UI'
import Modal from '../../component/Modal';

enum GameState {
  confirm = 1,
  main,

  shelf,
  tvSetEmpty,
  tvSet,
  controller,
  tv,

  result,
}

interface IPropTypes extends RouteComponentProps<{sub: string}> {
}

interface IStateTypes {
  gameState: GameState,
  totalTime: number,
  countDown: number,
  stars: {[s:string]:any},
  channel: number,
  subLevel: string,
  getController: boolean,
  items: {[name:string]: {
      static?: boolean,
      zIndex: number,
      ref: React.Ref<any>,
      x: number,
      y: number,
    },
  },
}

class Level2 extends React.Component<IPropTypes, IStateTypes> {
  channels = 3;
  state = {
    gameState: GameState.confirm,
    totalTime: 0,
    countDown: 0,
    stars: {},
    channel: 0,
    getController: false,
    subLevel: this.props.match.params.sub,
    items: {
      controller: {
        zIndex: 101,
        x: 60,
        y: 100,
        ref: React.createRef(),
      },
    },
  };
  private bgm: React.RefObject<HTMLAudioElement> = React.createRef();
  constructor(props) {
    super(props);
    console.log('#');
  }
  public async componentDidMount() {
    const subLevel = this.props.match.params.sub;
  }
  public componentWillUnmount() {
    this.bgm.current.pause();
  }
  isDragging = false;
  mouseDownX;
  mouseDownY;
  zIndexMap = {};
  cachedX;
  cachedY;
  draggingItem;
  onMouseMove = (e) => {
    if (!this.isDragging || this.state.items[this.draggingItem].static) {
      return;
    }
    const x = e.pageX || e.touches[0].pageX;
    const y = e.pageY || e.touches[0].pageY;
    const diffX = x - this.mouseDownX;
    const diffY = y - this.mouseDownY;
    const items = this.state.items;
    items[this.draggingItem].x = this.cachedX + diffX + 'px';
    items[this.draggingItem].y = this.cachedY + diffY + 'px';
    Object.keys(items).forEach(i => items[i].zIndex = this.zIndexMap[i] - 1);
    items[this.draggingItem].zIndex = 100 + Object.keys(items).length;
    this.forceUpdate();
  }
  onMouseUp = (e) => {
    this.isDragging = false;
  }
  interval;
  start = () => {
    const timeout = 20000000;
    let t = Date.now();
    this.interval = setInterval(() => {
      const countDown = (timeout - (Date.now() - t)) / 1000;
      this.setState({ countDown, totalTime: timeout / 1000 });
      if (countDown < 0) {
        clearInterval(this.interval);
        this.setState({
          gameState: GameState.result,
        });
      }
    }, 16);
    this.setState({
      gameState: GameState.main,
      countDown: 0,
      totalTime: 0,
    });
  }
  itemOnMouseDown = (e, itemName) => {
    this.isDragging = true;
    this.mouseDownX = e.pageX || e.touches[0].pageX;
    this.mouseDownY = e.pageY || e.touches[0].pageY;
    this.draggingItem = itemName;
    const ref = this.state.items[itemName].ref;
    this.cachedX = parseInt(ref.current.style.left);
    this.cachedY = parseInt(ref.current.style.top);
    const items = this.state.items;
    Object.keys(items).forEach(i => this.zIndexMap[i] = items[i].zIndex);
  }
  gameTimer;
  channelOnChange = () => {
    clearTimeout(this.gameTimer);
    if (this.state.stars['channelWatched']) {
      if (this.state.channel !== 0) {
        delete this.state.stars['channelResume']
      } else {
        this.state.stars['channelResume'] = true;
      }
      this.forceUpdate();
      return;
    }
    if (this.state.channel !== 2) {
      return;
    }
    this.gameTimer = setTimeout(() => {
      this.state.stars['channelWatched'] = true;
      this.forceUpdate();
    }, 5000);
  }
  public render() {
    const { gameState } = this.state;
    let uiState = 'normal';

    if (gameState === GameState.result) {
      uiState = 'result';
    }

    if (gameState === GameState.confirm) {
      uiState = 'desc';
    }
    const common = <UI
      state={uiState as any}
      level={2}
      subLevel={parseInt(this.state.subLevel, 10)}
      countDown={this.state.countDown}
      starCount={Object.keys(this.state.stars).length}
      totalTime={this.state.totalTime}
      onStart={this.start}
      onBack={() => {
        if (this.state.gameState === GameState.tvSet) {
          clearTimeout(this.gameTimer);
          this.setState({gameState: GameState.main});
        } else if (this.state.gameState === GameState.main) {
          this.props.history.push('/title');
        } else {
          this.setState({gameState: GameState.main});
        }
      }}>
      <audio
        src={require('../../assets/level3-bgm.mp3')}
        ref={this.bgm}
        loop
        autoPlay
      />
    </UI>;
    if (this.state.gameState === GameState.tvSet) {
      return <div className="tvSet">
        {common}
        <div className={'screen' + this.state.channel}>{this.state.channel}</div>
        <div onClick={() => this.setState({channel: (this.state.channel - 1) < 0 ? this.channels - 1 : (this.state.channel - 1)}, this.channelOnChange)} className="btnPrev"/>
        <div onClick={() => this.setState({channel: (this.state.channel + 1) % this.channels}, this.channelOnChange)} className="btnNext"/>
        <div className="btnTv"/>
      </div>;
    }
    if (this.state.gameState === GameState.tvSetEmpty) {
      return <div className="tvSetEmpty">
        {common}
      </div>;
    }
    if (this.state.gameState === GameState.shelf) {
      return <Modal show={true} closeOnClick={() => {console.log('x')}}>
        <div
          onTouchMove={this.onMouseMove}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onTouchEnd={this.onMouseUp}
          onClick={() => {
            if (this.state.stars['channelResume'] && !this.state.stars['controllerResume']) {
              this.state.stars['controllerResume'] = true;
              this.state.items.controller.x = 60;
              this.state.items.controller.y = 160;
              this.forceUpdate();
            }
          }}
          style={{width: window.innerWidth, height: window.innerHeight, background: '#fff'}}>
          {common}
          {(!this.state.getController || this.state.stars['controllerResume']) && Object.keys(this.state.items).map(i => <div
            className={i}
            key={i}
            ref={this.state.items[i].ref}
            onClick={(e) => {
              if (i === 'controller') {
                this.setState({getController: true});
              }
            }}
            style={{
              position: 'absolute',
              left: this.state.items[i].x,
              zIndex: this.state.items[i].zIndex,
              top: this.state.items[i].y,
            }}
            onMouseDown={(e) => this.itemOnMouseDown(e, i)}
            onTouchStart={(e) => this.itemOnMouseDown(e, i)}
          />)
        }
        </div>
      </Modal>;
    }
    if (this.state.gameState === GameState.main) {
      return <div
        className="bg"
        ref={(ref) => {
          if (ref) {
            ref.style.width = (4000 / 2484 * window.innerHeight) + 'px';
          }
        }}
      >
        <img className="bg-img" src={require('../../assets/level2_bg.png')}/>
        <div onTouchMove={() => {
          (document.querySelector('.bg') as any).style.marginLeft = (parseInt((document.querySelector('.bg') as any).style.marginLeft || 0) + 10) + 'px';
        }} className="left"/>
        <div onTouchMove={() => {
          (document.querySelector('.bg') as any).style.marginLeft = (parseInt((document.querySelector('.bg') as any).style.marginLeft || 0) - 10) + 'px';
        }} className="right"/>
        <div className="test"/>
        <div className="tv-set" onClick={() => {
          if (this.state.stars['channelResume']) {
            return;
          }
          if (this.state.subLevel === '1') {
            this.state.stars['tvFound'] = true;
          }
          const gameState = this.state.getController || this.state.subLevel === '1' ? GameState.tvSet : GameState.tvSetEmpty;
          this.setState({gameState});
        }}/>
        <div className="shelf2" onClick={() => this.state.subLevel === '2' && this.setState({gameState: GameState.shelf})}/>
        <div className="sofa2"/>
        {common}
      </div>;
    }
    return common;
  }
}

export default withRouter(Level2);
