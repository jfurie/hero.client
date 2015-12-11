import React from 'react';
import {Dialog as DialogUI, IconButton, ToolbarGroup, Toolbar, FlatButton, TextField, ToolbarTitle} from 'material-ui';
//const ToolBar = require('material-ui/lib/toolbar/toolbar');
const websiteRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
//Blahs
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
        height: '100%', maxHeight: '100%', paddingTop: '0px'
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
