import * as React from 'react';

interface IPropTypes {
    show: boolean,
    closeOnClick: Function,
}

interface IStateTypes {
}

export default class Modal extends React.Component<IPropTypes, IStateTypes> {
  public render() {
    if (!this.props.show) {
        return null;
    }
    return <div
       onClick={(e) => this.props.closeOnClick()}
       style={{
           position: 'fixed',
           left: 0,
           top: 0,
           width: '100%',
           height: '100%',
           zIndex: 1000,
       }}
    >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                top: '50%',
                background: '#aaa',
                padding: 10,
            }}
        >
        {this.props.children}
        </div>
    </div>;
  }
}