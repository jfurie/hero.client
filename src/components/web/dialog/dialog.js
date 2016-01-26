import React from 'react';
import {Dialog as DialogUI } from 'material-ui';

class Dialog extends React.Component {
  constructor(props){
    super(props);
  }

  closeModal(){
    this.props.closeModal();
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if(this.props.toolbar){
      clientHeight = (clientHeight -64);
    }
    return (
      <DialogUI open={this.props.open} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
        height: '100%', maxHeight: '100%', paddingTop: '0px',
      }} bodyStyle={{
        paddingTop: '0px', height: '100%', padding: '0'
      }} contentStyle={{
        width: '100%', maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
      }} ref="addNewDialog">
        {this.props.toolbar}
        <div style={{
          height: ( clientHeight) + 'px',
          overflowY:'scroll',
          WebkitOverflowScrolling: 'touch'
        }}>
          {this.props.children}
        </div>
      </DialogUI>
    );
  }
}

Dialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
};

export default Dialog;
