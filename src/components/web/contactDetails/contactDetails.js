import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import md5 from 'md5';

import { Header, DetailsCard } from '../../../components/web';
import {
  Dialog, IconButton, List, ListItem, FontIcon,
  Divider, Styles, IconMenu, MenuItem,
} from 'material-ui';

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

  _onTouchTapSearch() {
    console.log('_onTouchTapSearch');
  }

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapHot() {
    console.log('_onTouchTapHot');
  }

  _onTouchTapShare() {
    console.log('_onTouchTapShare');
  }

  _handleTapOnApplications() {
    console.log('_handleTapOnApplications');
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

      // build cover from gravatar
      if (email) {
        cover = md5(email);
      } else {
        cover = '00000000000000000000000000000000';
      }

      let cover = `http://www.gravatar.com/avatar/${cover}?d=mm&s=500`;

      // define action for the details card
      let actions = [{
        materialIcon: 'search',
        text: 'Find',
        onTouchTap: this._onTouchTapSearch.bind(this),
      }, {
        materialIcon: 'star_rate',
        text: 'Save',
        onTouchTap: this._onTouchTapSave.bind(this),
      }, {
        materialIcon: 'favorite',
        text: 'Hot!',
        onTouchTap: this._onTouchTapHot.bind(this),
      }, {
        materialIcon: 'share',
        text: 'Share',
        onTouchTap: this._onTouchTapShare.bind(this),
      }];

      return (

        <div>
          <DetailsCard
              title={displayName}
              subtitle={city}
              cover={cover}
              mainColor={Styles.Colors.indigo500}
              actions={actions}
              floatActionOnTap={this._handleTapOnApplications.bind(this)}
              floatActionContent={<span style={{color: Styles.Colors.indigo500, fontSize: '15px !important'}}>9</span>}
          />
          <List style={{position: 'relative', top: '3px'}}>
            <div>

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
    //let displayName = null;

    if (contact) {
      invited = contact.get('isInvited');
      email = contact.get('email') || null;
      //displayName = contact.get('displayName') || null;
    }

    // const confirmInviteActions = [
    //   <FlatButton
    //       label="Cancel"
    //       primary
    //       onTouchTap={this.handleConfirmInviteClose.bind(this)} />,
    //   <FlatButton
    //       label="Submit"
    //       secondary
    //       keyboardFocused
    //       onTouchTap={this.handleConfirmInviteGo.bind(this)} />,
    // ];

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
            <Header transparent goBack={this.goBack.bind(this)} iconRight={
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
      </div>
    );
  }
}

ContactDetails.propTypes = {
  contact: React.PropTypes.object,
  onContactDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
