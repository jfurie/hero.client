import React from 'react';
import {Dialog} from 'material-ui';

export default class ClientsCreateModal extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return (
      <Dialog
          modal={false}
          open={this.props.open}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          repositionOnUpdate={false}
          defaultOpen={false}
          style={{
            height: '100%',
            maxHeight: '100%',
            paddingTop: '0px',
          }}
          bodyStyle={{
            paddingTop: '0px',
            height: '100%',
            padding: '0',
          }}
          contentStyle={{
            width: '100%',
            maxWidth: 'none',
            height: '100%',
            maxHeight: '100%',
            paddingTop: '0px',
            top: '-64px',
          }}
          ref="addNewDialog"
      >
        <div style={{height: `${clientHeight}px`}}></div>

      </Dialog>
    );
  }
}
