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
  gameboy,
  desk,

  result,
}

interface IPropTypes extends RouteComponentProps<{sub: string}> {
}

interface IStateTypes {
  gameState: GameState,
  progress: number,
  stars: {[t:string]: true},
  subLevel: string,
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
    stars: {},
    subLevel: this.props.match.params.sub,
    items: {
      gameboy: {
        zIndex: 101,
        x: 60,
        y: 100,
        ref: React.createRef(),
      },
      book: {
        zIndex: 102,
        x: 80,
        y: 200,
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
    if ((this.draggingItem === 'book' || this.draggingItem === 'gameboy') && this.state.stars['gameboyStarAdded']) {
      const distance = (a, b) => Math.pow((parseInt(a.x) - b.x) * (parseInt(a.x) - b.x) + (parseInt(a.y) - b.y) * (parseInt(a.y) - b.y), 0.5);
      const gameboyPlace = distance(this.state.items.gameboy, { x: 60, y: 100 }) < 100;
      const bookPlace = distance(this.state.items.book, { x: 80, y: 200 }) < 100 && this.state.items.book.zIndex > this.state.items.gameboy.zIndex && gameboyPlace;
      if (gameboyPlace)
        this.state.stars['gameboyPlace'] = true;
      if (bookPlace)
        this.state.stars['bookPlace'] = true;
      this.forceUpdate();
    }
    this.isDragging = false;
    this.draggingItem = null;
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
    if (this.state.gameState === GameState.gameboy) {
      return <div style={{height: '100%', width: '100%', position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {common}
        <div className="gameboy" style={{
          display: 'inline-block',
          width: '300px',
          position: 'relative',
          height: '436px',
        }}>
          <div className="cup"/>
        </div>

        <button className="back" onClick={() => {
          clearTimeout(this.gameTimer);
          this.setState({gameState: this.state.subLevel === '2' ? GameState.shelf : GameState.desk});
          this.state.items.gameboy.x = 300;
          this.state.items.gameboy.y = 300;
          this.forceUpdate();
        }}>back</button>
      </div>;
    }
    if (this.state.gameState === GameState.shelf) {
      return <Modal show={true} closeOnClick={() => {console.log('x')}}>
        <div
          onTouchMove={this.onMouseMove}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onTouchEnd={this.onMouseUp}
          style={{width: window.innerWidth, height: window.innerHeight, background: '#fff'}}>
          {common}
          {Object.keys(this.state.items).map(i => <div
            className={i}
            key={i}
            ref={this.state.items[i].ref}
            onClick={(e) => {
              if (i === 'gameboy' && !this.state.stars['gameboyStarAdded']) {
                clearTimeout(this.gameTimer);
                this.gameTimer = setTimeout(() => {
                  this.state.stars['gameboyStarAdded'] = true;
                  this.forceUpdate();
                }, 5000);
                this.setState({gameState: GameState.gameboy});
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
    if (this.state.gameState === GameState.desk) {
      return <Modal show={true} closeOnClick={() => {console.log('x')}}>
        <div
          onTouchMove={this.onMouseMove}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onTouchEnd={this.onMouseUp}
          style={{width: window.innerWidth, height: window.innerHeight, background: 'url(../../assets/level1_desk_scene(blank).png)', backgroundSize: '100% 100%'}}>
          {common}
          {Object.keys(this.state.items).filter(i => i === 'gameboy').map(i => <div
            className={i}
            key={i}
            ref={this.state.items[i].ref}
            onClick={(e) => {
              if (i === 'gameboy' && !this.state.stars['gameboyStarAdded']) {
                clearTimeout(this.gameTimer);
                this.gameTimer = setTimeout(() => {
                  this.state.stars['gameboyStarAdded'] = true;
                  this.forceUpdate();
                }, 5000);
                this.setState({gameState: GameState.gameboy});
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
        <img className="bg-img" src={require('../../assets/level1_background.png')}/>
        <div className="desk" onClick={() => {
          if (this.state.subLevel === '1') {
            this.state.stars['gameboyFound'] = false;
            this.setState({ gameState: GameState.desk });
          }
        }
        }/>
        <div className="shelf" onClick={() => {
          if (this.state.subLevel === '2') {
            this.setState({ gameState: GameState.shelf });
          }
        }}/>
        <div className="sofa"/>
        {common}
      </div>;
    }
  }
}

export default withRouter(Level1);
