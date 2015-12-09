import React from 'react';
// import { connect } from 'react-redux';
// import { pushState } from 'redux-router';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup,
  List, ListItem, FontIcon, ListDivider, Avatar, FlatButton } from 'material-ui';
//import Infinite from 'react-infinite';
import { InviteSuccessModal } from '../../../components/web';

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
  invite: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
};

// @connect( () => {}
// ,{pushState})
class ContactDetailsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      succesInviteModalOpen: false,
    };
  }

  closeModal() {
    this.props.closeModal();
  }

  inviteSuccessModalClose() {
    this.setState({
      succesInviteModalOpen: false,
    });
  }

  inviteToHero() {
    this.setState({
      succesInviteModalOpen: true,
    });
  }

  render() {

    let { contact } = this.props;

    let picture = null;
    let email = null;
    let phone = null;
    let address = null;
    let city = null;
    let source = null;
    let displayName = null;

    if (contact) {
      displayName = contact.get('displayName') || null;
      picture = 'http://www.material-ui.com/images/kerem-128.jpg';
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;
      address = '1316 3rd St #103';
      city = 'Santa Monica, CA 90401';
      source = 'facebook.com';
    }

    return (
      <div>

        <InviteSuccessModal
            ref="inviteSuccessModal"
            closeModal={this.inviteSuccessModalClose.bind(this)}
            open={this.state.succesInviteModalOpen}
        />

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
                <ToolbarTitle style={style.detailsTitle} text={'Contact Details'} />
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right">
                <FlatButton onTouchTap={this.inviteToHero.bind(this)} style={style.invite}>Invite</FlatButton>
              </ToolbarGroup>
            </Toolbar>
            <List>
              <div>

                {(displayName) ? (
                  <ListItem
                    leftAvatar={<Avatar src={picture} />}
                    primaryText={displayName}
                    secondaryText={<p>contact</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}

                {(email) ? (
                  <ListItem
                    leftIcon={<FontIcon className="material-icons">mail</FontIcon>}
                    primaryText={email}
                    secondaryText={<p>email</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}

                {(phone) ? (
                  <div>
                    <ListDivider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">phone</FontIcon>}
                      primaryText={phone}
                      secondaryText={<p>phone</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

                {(address) ? (
                  <div>
                    <ListDivider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                      primaryText={address}
                      secondaryText={<p>address</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

                {(city) ? (
                  <div>
                    <ListDivider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">business</FontIcon>}
                      primaryText={city}
                      secondaryText={<p>city</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

                {(source) ? (
                  <div>
                    <ListDivider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">redo</FontIcon>}
                      primaryText={source}
                      secondaryText={<p>source</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

              </div>
            </List>
          </div>
        </Dialog>
      </div>
    );
  }
}

ContactDetailsModal.propTypes = {
  contact: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

export default ContactDetailsModal;
