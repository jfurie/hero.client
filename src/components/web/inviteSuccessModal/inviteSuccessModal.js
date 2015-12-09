import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup } from 'material-ui';

let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    zIndex: '50',
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
};

// @connect( () => {}
// ,{pushState})
class InviteSuccessModal extends React.Component {

  constructor(props) {
    super(props);
  }

  closeModal() {
    this.props.closeModal();
  }

  render() {

    return (
      <Dialog
          open={this.props.open}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          repositionOnUpdate={false}
          defaultOpen={false}
          style={style.dialog}
          bodyStyle={style.bodyStyle}
          contentStyle={style.contentStyle}
          ref="contactDetailsDialog"
      >
        <div style={style.content}>
          <Toolbar style={style.toolBar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.detailsTitle} text={'Invite Success'} />
            </ToolbarGroup>
          </Toolbar>
          <p>success!</p>
        </div>
      </Dialog>
    );
  }
}

InviteSuccessModal.propTypes = {
  open: React.PropTypes.bool.isRequired,
};

export default InviteSuccessModal;
