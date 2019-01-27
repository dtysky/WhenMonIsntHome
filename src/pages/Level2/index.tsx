import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../../assets';
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
  progress: number,
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
    progress: 0,
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
  public async componentDidMount() {
    const subLevel = this.props.match.params.sub;
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
    const timeout = 20000;
    let t = Date.now();
    this.interval = setInterval(() => {
      const progress = (Date.now() - t) / (timeout * 1000) * 100;
      this.setState({ progress });
      if (progress >= 100) {
        clearInterval(this.interval);
        this.setState({
          gameState: GameState.result,
        });
      }
    }, 16);
    this.setState({
      gameState: GameState.main,
      progress: 0,
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
    if (this.state.gameState === GameState.confirm) {
      return <Modal show={true} closeOnClick={() => {console.log('x')}}>
        <div>关卡挑战目标</div>
        <div>1.把游戏机放回原位</div>
        <div>2.观看电视不少于5s</div>
        <div>3.满足关卡快乐值</div>
        <button onClick={this.start}>start</button>
      </Modal>;
    }
    const common = <div>
        <div className="progress" style={{width: window.innerWidth * 0.7}}>
          <div className="progress-bar" style={{width: this.state.progress + '%'}}/>
        </div>
        <div className={'stars star-' + Object.keys(this.state.stars).length}>
          <div className="star"/>
          <div className="star"/>
          <div className="star"/>
        </div>
    </div>;
    if (this.state.gameState === GameState.tvSet) {
      return <div className="tvSet">
        {common}
        <div className={'screen' + this.state.channel}/>
        <div onClick={() => this.setState({channel: (this.state.channel - 1) < 0 ? this.channels - 1 : (this.state.channel - 1)}, this.channelOnChange)} className="btnPrev"/>
        <div onClick={() => this.setState({channel: (this.state.channel + 1) % this.channels}, this.channelOnChange)} className="btnNext"/>
        <div className="btnTv"/>
        <button className="back" onClick={() => {
          clearTimeout(this.gameTimer);
          this.setState({gameState: GameState.main});
        }}>back</button>
      </div>;
    }
    if (this.state.gameState === GameState.tvSetEmpty) {
      return <div className="tvSetEmpty">
        {common}
        <button className="back" onClick={() => this.setState({gameState: GameState.main})}>back</button>
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
        <button className="back" onClick={() => this.setState({gameState: GameState.main})}>back</button>
        </div>
      </Modal>;
    }
    if (this.state.gameState === GameState.result) {
      return null;
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
  }
}

export default withRouter(Level2);
