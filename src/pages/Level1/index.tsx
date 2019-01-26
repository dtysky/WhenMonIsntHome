import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../../assets';
import Modal from '../../component/Modal';

enum GameState {
  confirm = 1,
  gaming,
  timeout,
  finished,
}

interface IPropTypes extends RouteComponentProps<{sub: string}> {
}

interface IStateTypes {
  gameState: GameState,
  progress: number,
  verticalProgress: number,
  tvOn: boolean,
  items: {[name:string]: {
      static?: boolean,
      zIndex: number,
      ref: React.Ref<any>,
      x: number,
      y: number,
    },
  },
}

class Level1 extends React.Component<IPropTypes, IStateTypes> {
  state = {
    gameState: GameState.confirm,
    progress: 0,
    verticalProgress: 30,
    tvOn: false,
    items: {
      gameboy: {
        zIndex: 100,
        x: 30,
        y: 100,
        ref: React.createRef(),
      },
      book: {
        zIndex: 101,
        x: 60,
        y: 200,
        ref: React.createRef(),
      },
      tv: {
        static: true,
        zIndex: 99,
        x: 110,
        y: 200,
        ref: React.createRef(),
      }
    }
  }
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
    console.log(this.draggingItem);
    const x = e.pageX || e.touches[0].pageX;
    const y = e.pageY || e.touches[0].pageY;
    const diffX = x - this.mouseDownX;
    const diffY = y - this.mouseDownY;
    const items = this.state.items;
    items[this.draggingItem].x = this.cachedX + diffX + 'px';
    items[this.draggingItem].y = this.cachedY + diffY + 'px';
    Object.keys(items).forEach(i => this.zIndexMap[i]);
    items[this.draggingItem].zIndex = 100 + Object.keys(items).length - 1;
    this.forceUpdate();
  }
  onMouseUp = (e) => {
    this.isDragging = false;
  }
  interval;
  start = () => {
    const timeout = 20;
    let t = Date.now();
    this.interval = setInterval(() => {
      const progress = (Date.now() - t) / (timeout * 1000) * 100;
      this.setState({ progress });
      if (progress >= 100) {
        clearInterval(this.interval);
        this.setState({
          gameState: GameState.timeout,
        });
      }
    }, 16);
    this.setState({
      gameState: GameState.gaming,
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
  checkpoints = {
    tv: false,
  };
  tvTimer;
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
    if (this.state.gameState === GameState.gaming) {
      return <div
        className="bg"
        onTouchMove={this.onMouseMove}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
      >
        <div className="progress">
          <div className="progress-bar" style={{width: this.state.progress + '%'}}/>
        </div>
        <div className="progress-vertical">
          <div className="progress-vertical-bar" style={{height: this.state.verticalProgress + '%'}}/>
        </div>
        {
          Object.keys(this.state.items).map(i => <div
            className={i}
            key={i}
            ref={this.state.items[i].ref}
            onClick={(e) => {
              if (i === 'tv') {
                clearTimeout(this.tvTimer);
                if (!this.state.tvOn) {
                  (this.state.items[i].ref.current as HTMLElement).setAttribute('class', 'tv on');
                  this.tvTimer = setTimeout(() => {
                    this.checkpoints.tv = true;
                  }, 5000);
                } else {
                  (this.state.items[i].ref.current as HTMLElement).setAttribute('class', 'tv');
                }
                this.setState({
                  tvOn: this.state.tvOn,
                });
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
      </div>;
    }
  }
}

export default withRouter(Level1);
