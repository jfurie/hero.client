import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup,
  List, ListItem, FontIcon, Divider, FlatButton, RaisedButton } from 'material-ui';
import { InviteSuccessModal, Gravatar } from '../../../components/web';

let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    zIndex: '1400',
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

class ContactDetailsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  closeModal() {
    this.props.closeModal();
  }

  inviteToHero() {
    this.setState({confirmOpen: true});
  }

  handleConfirmInviteClose() {
    this.setState({confirmOpen: false});
  }

  handleConfirmInviteGo() {
    //this.props.onInvite();
    this.setState({confirmOpen: false});
    this.refs.inviteSuccessModal.show();
    this.setState({
      justInvited: true,
    });
  }

  render() {

    let { contact } = this.props;

    //let picture = null;
    let email = null;
    let phone = null;
    let addressLine = null;
    let city = null;
    let postalCode = null;
    //let countryCode = null;
    let countrySubDivisionCode = null;
    let source = null;
    let displayName = null;
    let invited = false;

    if (contact) {
      displayName = contact.get('displayName') || null;
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;
      invited = contact.get('isInvited');

      if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
        source = contact.get('sourceInfo').get('referrer');
      }

      // location stuff
      let address = contact.get('_address');

      if (address) {
        addressLine = address.get('addressLine') || null;
        city = address.get('city') || null;
        postalCode = address.get('postalCode') || null;
        countrySubDivisionCode = address.get('countrySubDivisionCode') || null;

        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        if (city && postalCode) {
          city += ` ${postalCode}`;
        }

      }
    }

    const confirmInviteActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleConfirmInviteClose.bind(this)} />,
      <FlatButton
        label="Submit"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirmInviteGo.bind(this)} />,
    ];

    return (

      <div>

        <InviteSuccessModal ref="inviteSuccessModal" email={email}/>

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
              {(!invited && !this.state.justInvited && email) ? (
                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this.inviteToHero.bind(this)} style={style.invite}>Invite</FlatButton>
                </ToolbarGroup>
              ) : (null)}
            </Toolbar>
            <List>
              <div>

                {(displayName) ? (
                  <ListItem
                    leftAvatar={<Gravatar email={email} />}
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
                    <Divider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">phone</FontIcon>}
                      primaryText={phone}
                      secondaryText={<p>phone</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

                {(addressLine) ? (
                  <div>
                    <Divider inset />
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                      primaryText={addressLine}
                      secondaryText={<p>address</p>}
                      secondaryTextLines={1}
                    />
                  </div>
                ) : (null)}

                {(city) ? (
                  <div>
                    <Divider inset />
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
                    <Divider inset />
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
        <div> {/* confirm */}
          <Dialog
            title="Are you sure?"
            actions={confirmInviteActions}
            modal={false}
            open={this.state.confirmOpen}
            onRequestClose={this.handleConfirmInviteClose.bind(this)}>
            Do you want to invite <strong style={{fontWeight: '500'}}>{displayName}</strong> ({email}) to join the Hero platform?
          </Dialog>
        </div>
      </div>
    );
  }
}

ContactDetailsModal.propTypes = {
  contact: React.PropTypes.object,
  open: React.PropTypes.bool.isRequired,
};

export default ContactDetailsModal;
