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
        copySuccess: 'Copied',
      });
    });

    clipboard.on('error', function() {
      self.setState({
        copyError: 'Can\'t copy',
      });
    });
  }

  select(e) {
    e.target.select();
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
          <TextField value={url} className="copy-text" style={{width: '100%'}} onFocus={this.select.bind(this)} />
          <br />
          <div style={{color: Styles.Colors.green500}}>{this.state.copySuccess}</div>
          <div style={{color: Styles.Colors.red500}}>{this.state.copyError}</div>
      </Dialog>
    );
  }
}

export default ShareLinkModal;
