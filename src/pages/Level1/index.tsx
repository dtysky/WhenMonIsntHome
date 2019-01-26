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
  items: {[name:string]: {
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
      }
    }
  }
  public async componentDidMount() {
    const subLevel = this.props.match.params.sub;
  }
  isDragging = false;
  mouseDownX;
  mouseDownY;
  cachedX;
  cachedY;
  draggingItem;
  onMouseMove = (e) => {
    if (!this.isDragging) {
      return;
    }
    const x = e.pageX;
    const y = e.pageY;
    const diffX = x - this.mouseDownX;
    const diffY = y - this.mouseDownY;
    const items = this.state.items;
    items[this.draggingItem].x = this.cachedX + diffX + 'px';
    items[this.draggingItem].y = this.cachedY + diffY + 'px';
    Object.keys(items).forEach(i => items[i].zIndex--);
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
    }, 100);
    this.setState({
      gameState: GameState.gaming,
      progress: 0,
    });
  }
  itemOnMouseDown = (e, itemName) => {
    this.isDragging = true;
    this.mouseDownX = e.pageX;
    this.mouseDownY = e.pageY;
    this.draggingItem = itemName;
    const ref = this.state.items[itemName].ref;
    this.cachedX = parseInt(ref.current.style.left);
    this.cachedY = parseInt(ref.current.style.top);
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
    if (this.state.gameState === GameState.gaming) {
      return <div
        className="bg"
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <div className="progress">
          <div className="progress-bar" style={{width: this.state.progress + '%'}}/>
        </div>
        {
          Object.keys(this.state.items).map(i => <div
            className={i}
            ref={this.state.items[i].ref}
            style={{
              position: 'absolute',
              left: this.state.items[i].x,
              zIndex: this.state.items[i].zIndex,
              top: this.state.items[i].y,
            }}
            onMouseDown={(e) => this.itemOnMouseDown(e, i)}
          />)
        }
      </div>;
    }
  }
}

export default withRouter(Level1);
