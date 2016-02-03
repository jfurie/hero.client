import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, ToolbarGroup, FontIcon, FlatButton } from 'material-ui';

let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  content: {
    height: `${clientHeight}px`,
    // zIndex: '50',
  },
  toolBar: {
    backgroundColor:'#ffffff',
    height:'64px',
  },
  close: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  detailsTitle: {
    lineHeight:'64px',
    float:'left',
  },
  fontIcon: {
    fontSize: '60px',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.39)',
    color: '#fff',
    padding: '20px',
    backgroundColor: '#40bb3f',
    borderRadius: '160px',
    marginTop: '50px',
    marginBottom: '30px',
  },
  centered: {
    textAlign: 'center',
  },
  done: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
};

// @connect( () => {}
// ,{pushState})
class InviteSuccessModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  show() {
    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <Dialog
          open={this.state.open}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          repositionOnUpdate={false}
          defaultOpen={false}
          style={style.dialog}
          bodyStyle={style.bodyStyle}
          contentStyle={style.contentStyle}
      >
        <div style={style.content}>
          <Toolbar style={style.toolBar}>
            <ToolbarGroup key={0} float="left">
              <ToolbarTitle style={style.detailsTitle} text={'Invite Success'} />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this.closeModal.bind(this)} style={style.done}>Done</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row">
            <div className="col-xs-12" style={style.centered}>
              <FontIcon style={style.fontIcon} className="material-icons" color={style.fontIcon.color}>done</FontIcon>
            </div>
            <div className="col-xs-12" style={style.centered}>
              <p>We just invited <bold>{this.props.email}</bold>!</p>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

InviteSuccessModal.propTypes = {
  //open: React.PropTypes.bool.isRequired,
  email: React.PropTypes.string,
};

export default InviteSuccessModal;
