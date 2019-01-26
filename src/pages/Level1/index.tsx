import * as React from 'react';
import {
  Route, Switch, withRouter, RouteComponentProps, Redirect
} from 'react-router-dom';

import assets from '../../assets';

interface IPropTypes extends RouteComponentProps<{sub: string}> {
}

interface IStateTypes {
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
  onMouseUp= (e) => {
    this.isDragging = false;
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
    return <div
      className="bg"
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
    >
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

export default withRouter(Level1);
