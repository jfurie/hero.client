import React from 'react';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Paper from 'material-ui/lib/paper';

class ActionButtonItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  _closeActions() {
    this.setState({
      open: false,
    });
  }

  _openActions() {
    this.setState({
      open: true,
    });
  }

  _onTouchTap() {
    console.log('item _onTouchTap');
    if (this.props.itemTapped) {
      console.log('call');
      this.props.itemTapped();
    }
  }

  render() {

    let style = {
      actionButtonItem: {
        position: 'fixed',
        transform: 'translate(-48px,0)',
        zIndex: '1405',
      },
      paper: {
        padding: '6px 10px',
        position: 'fixed',
        transform: 'translate(-148px,0)',
        zIndex: '1405',
        width: 'auto',
        marginBottom: '4px',
      },
    };

    // set bottom for the right position
    if (this.props.position >= 0) {
      style.actionButtonItem.bottom = `${85 + (this.props.position * 50)}px`;
      style.paper.bottom = `${85 + (this.props.position * 50)}px`;
    }

    return (
      <div style={{display: (this.props.show) ? ('block') : ('hidden')}} key={this.props.position} onTouchTap={this._onTouchTap.bind(this)}>
        <Paper style={style.paper} zDepth={1} >{this.props.title}</Paper>
        <FloatingActionButton mini={true} style={style.actionButtonItem} onTouchTap={this._openActions.bind(this)} backgroundColor={this.props.color}>
          {this.props.children}
        </FloatingActionButton>
      </div>
    );
  }
}

ActionButtonItem.propTypes = {
  color: React.PropTypes.string.isRequired,
  itemTapped: React.PropTypes.func,
  position:  React.PropTypes.number,
  show: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
  //style: React.PropTypes.object,
  // url: React.PropTypes.string.isRequired,
};

export default ActionButtonItem;
