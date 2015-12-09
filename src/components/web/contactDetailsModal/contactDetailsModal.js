import React from 'react';
import { Dialog, ToolBar, ToolbarTitle, IconButton, ToolbarGroup } from 'material-ui';
//import Infinite from 'react-infinite';
//import { CompanyJobsList } from '../../../components/web';

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

class ContactDetailsModal extends React.Component {

  constructor(props) {
    super(props);
  }

  closeModal() {
    this.props.closeModal();
  }

  render() {

    let { contact } = this.props;

    let dialogTitle = 'Contact Details';

    console.log(contact, this.props.open);

    if (contact && contact.get('displayName')) {
      dialogTitle = contact.get('displayName');
    }

    // return (
    //   <div>
    //     <p>{dialogTitle}</p>
    //     <Dialog
    //       title="Dialog With Scrollable Content"
    //       actions={customActions}
    //       autoDetectWindowHeight={true}
    //       autoScrollBodyContent={true}
    //       open={this.state.showDialogScrollable}
    //       onRequestClose={this._handleRequestClose}>
    //       <div style={{height: '1000px'}}>
    //         Really long content
    //       </div>
    //     </Dialog>
    //   </div>
    // );

    //if (contact) {
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

          {/*<ToolBar style={style.toolBar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.detailsTitle} text={dialogTitle} />
            </ToolbarGroup>
          </ToolBar>*/}
          <div className="row center-xs">
              <p>toto</p>
          </div>
        </div>
      </Dialog>
    );
    //}
  }
}

ContactDetailsModal.propTypes = {
  contact: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

export default ContactDetailsModal;
