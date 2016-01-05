import React from 'react';
import {Dialog as DialogUI } from 'material-ui';

export default class Dialog extends React.Component {
  constructor(props){
    super(props);
  }

  closeModal(){
    this.props.closeModal();
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <DialogUI open={this.props.open} autoDetectWindowHeight={false} autoScrollBodyContent={false} repositionOnUpdate={false} defaultOpen={false} style={{
        height: '100%', maxHeight: '100%', paddingTop: '0px',
      }} bodyStyle={{
        paddingTop: '0px', height: '100%', padding: '0'
      }} contentStyle={{
        width: '100%', maxWidth: 'none', height: '100%', maxHeight: '100%', paddingTop: '0px', top: '-64px'
      }} ref="addNewDialog">
        <div style={{
          height: ( clientHeight) + 'px',
          overflowY:'scroll'
        }}>
          {this.props.children}
        </div>
      </DialogUI>
    );
  }
}
