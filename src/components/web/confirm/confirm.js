import React from 'react';
import {FlatButton, Dialog} from 'material-ui';
import Q from 'q';

export default class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.confirm = this.confirm.bind(this);
    this.handleAbort = this.handleAbort.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  confirm = (options) => {
    this.setState({
      open: true,
      ...options
    });
    this.defer = Q.defer();
    return this.defer.promise;
  };

  handleAbort = () => {
    this.setState({open: false});
    this.defer.reject();
  };
  handleConfirm = () => {
    this.setState({open: false});
    this.defer.resolve();
  };

  render() {
    const actions = [
      <FlatButton
          label={this.props.abortLabel}
          secondary
          onTouchTap={this.handleAbort}
      />,
      <FlatButton
          label={this.props.confirmLabel}
          primary
          onTouchTap={this.handleConfirm}
      />,
    ];
    const customContentStyle = {
      maxWidth: '400px',
    };
    return (
      <div>
        <Dialog
            title={this.state.title}
            actions={actions}
            modal
            open={this.state.open}
            contentStyle={customContentStyle}
        >
          {this.state.message}
        </Dialog>
      </div>
    );
  }
}

Confirm.defaultProps = { abortLabel: 'Cancel', confirmLabel: 'OK' };
