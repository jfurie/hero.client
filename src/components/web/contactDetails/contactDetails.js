import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { InviteSuccessModal, Gravatar, Header } from '../../../components/web';
import {
  Dialog, IconButton, List, ListItem, FontIcon,
  Divider, FlatButton, Styles, IconMenu, MenuItem,
} from 'material-ui';

const style = {
  viewContent: {
  },
  cardTitle: {
    position: 'relative',
  },
  cardTitleComponent: {
    backgroundColor: Styles.Colors.indigo500,
    padding: '21px 16px 26px',
  },
  subtitle: {
    fontWeight: 200,
    opacity: 0.5,
  },
  direction: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: '50',
  },
  actionFontIcon: {
    position: 'relative',
    // left: '-5px',
    top: '8px',
    marginLeft: '0px',
    width: '24px',
    height: '24px',
  },
  actionBox: {
    marginRight: '0px',
  },
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
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
  },
};

@connect(() => (
{}), {pushState})
export default class ContactDetails extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
    };
  }

  editContactModalOpen(){
    console.log('yo!');
  }

  goBack() {
    if (this.props.onContactDetailsClose) {
      this.props.onContactDetailsClose();
    }
  }

  handleConfirmInviteClose() {
    this.setState({confirmOpen: false});
  }

  handleConfirmInviteGo() {
    this.setState({confirmOpen: false});
    this.refs.inviteSuccessModal.show();
    this.setState({
      justInvited: true,
    });
  }

  inviteToHero() {
    this.setState({confirmOpen: true});
  }

  renderContent(contact) {

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
    //let invited = false;

    if (contact) {
      displayName = contact.get('displayName') || null;
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;
      //invited = contact.get('isInvited');

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

      return (

        <div>
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
      );

    }
    else {
      return (<div></div>);
    }
  }

  render() {

    let { contact } = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight;

    let invited = false;
    let email = null;
    let displayName = null;

    if (contact) {
      invited = contact.get('isInvited');
      email = contact.get('email') || null;
      displayName = contact.get('displayName') || null;
    }

    const confirmInviteActions = [
      <FlatButton
          label="Cancel"
          primary
          onTouchTap={this.handleConfirmInviteClose.bind(this)} />,
      <FlatButton
          label="Submit"
          secondary
          keyboardFocused
          onTouchTap={this.handleConfirmInviteGo.bind(this)} />,
    ];

    return (
      <div>
        <Dialog
            open={this.props.open}
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            repositionOnUpdate={false}
            defaultOpen={false}
            style={style.dialog}
            bodyStyle={style.bodyStyle}
            contentStyle={style.contentStyle}
        >
          <div style={{minHeight: `${clientHeight}px`, overflowY:'scroll'}}>
            <Header title="Contact details" goBack={this.goBack.bind(this)} iconRight={
              <IconMenu iconButtonElement={
                <IconButton iconClassName="material-icons">more_vert</IconButton>
              }>
                {(!invited && !this.state.justInvited && email) ? (
                  <MenuItem index={0} onTouchTap={this.inviteToHero.bind(this)} primaryText="Invite Contact" />
                ) : (null)}
                <MenuItem index={0} onTouchTap={this.editContactModalOpen.bind(this)} primaryText="Edit Contact" />
              </IconMenu>
            }
            />
            <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
              {this.renderContent(contact)}
            </div>
          </div>
        </Dialog>
        <Dialog
          title="Are you sure?"
          actions={confirmInviteActions}
          modal={false}
          open={this.state.confirmOpen}
          onRequestClose={this.handleConfirmInviteClose.bind(this)}>
          Do you want to invite <strong style={{fontWeight: '500'}}>{displayName}</strong> ({email}) to join the Hero platform?
        </Dialog>
        <InviteSuccessModal ref="inviteSuccessModal" email={email}/>
      </div>
    );
  }
}

ContactDetails.propTypes = {
  contact: React.PropTypes.object,
  onContactDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
