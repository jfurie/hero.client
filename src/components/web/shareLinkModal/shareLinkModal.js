import React from 'react';
import { Dialog, FlatButton, TextField, Styles } from 'material-ui';

class ShareLinkModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyStatus: ' ',
    };
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  copy() {
    let self = this;

    let clipboard = new Clipboard('.copy-btn');

    clipboard.on('success', function() {
      self.setState({
        copyStatus: 'Copied',
      });
    });

    clipboard.on('error', function() {
      self.setState({
        copyStatus: 'Selected',
      });
    });
  }

  render() {
    let { url } = this.props;

    return (
      <Dialog
          actions=
          {[
            <FlatButton
                label="Close"
                secondary
                onTouchTap={this.onClose.bind(this)}
            />,
            <FlatButton
                className="copy-btn"
                data-clipboard-target=".copy-text"
                label="Copy to Clipboard"
                primary
                onTouchTap={this.copy.bind(this)}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.onClose.bind(this)}
      >
          <TextField value={url} className="copy-text" style={{width: '100%'}} />
          <br />
          <div style={{color: Styles.Colors.green500}}>{this.state.copyStatus}</div>
      </Dialog>
    );
  }
}

export default ShareLinkModal;
