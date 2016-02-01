import React from 'react';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';

//import { ActionButtonItem } from '../';

class ActionButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }
  close(){
    this._closeActions();
  }

  _closeActions() {
    this.setState({
      open: false,
    });
  }

  _openActions() {
    this.setState({
      open: !this.state.open,
    });
  }

  renderActions() {

    let position = 0;

    return React.Children.map(this.props.actions, function (action) {
      return React.cloneElement(action, {
        show: this.state.open,
        position: position++,
      });
    }.bind(this));
  }

  render() {

    let style = {
      actionButton: {
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        zIndex: '1405',
      },
      overlay: {
        position: 'fixed',
        height: '100%',
        width: '100%',
        backgroundColor: '#FFFFFF',
        opacity: '0.85',
        zIndex: '1400',
        top: '0',
        bottom: '0',
        left: '0',
        rigth: '0',
      },
      actions: {

      },
    };

    let margedStyle = style;

    if (this.state.open) {
      margedStyle.overlay.display = 'block';
      margedStyle.actions.display = 'block';
    } else {
      margedStyle.overlay.display = 'none';
      margedStyle.actions.display = 'none';
    }

    //console.log(this.props.actions.length);


  //   <actionItem key={key} show={this.state.open} />
  // );

    return (
      <div>
        <div style={margedStyle.overlay} className="overlay" onTouchTap={this._closeActions.bind(this)}></div>
        <div className="actions" style={margedStyle.actions}>

          {this.renderActions()}

        </div>
        <FloatingActionButton style={style.actionButton} onTouchTap={this._openActions.bind(this)}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

ActionButton.propTypes = {
  actions: React.PropTypes.array.isRequired,
  // style: React.PropTypes.object,
  // url: React.PropTypes.string.isRequired,
};

export default ActionButton;
