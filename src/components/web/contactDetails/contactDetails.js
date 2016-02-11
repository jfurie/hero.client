import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import md5 from 'md5';

import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard } from '../../../components/web';
import {
   IconButton, List, ListItem, FontIcon,
  Divider, Styles, IconMenu, MenuItem,
} from 'material-ui';

function defineContext(props) {
  let context = {
    isCandidate: false,
    isContact: false,
  };

  if (props.candidate && !props.contact) {
    context.isCandidate = !context.isCandidate;
  } else if (!props.candidate && props.contact) {
    context.isContact = !context.isContact;
  }

  return context;
}

@connect(() => (
{}), {pushState})
export default class ContactDetails extends React.Component {

  constructor(props){
    super(props);
    let context = defineContext(props);

    this.state = {
      justInvited: false,
      confirmOpen: false,
      isCandidateContext: context.isCandidate,
      isContactContext: context.isContact,
    };
  }

  componentWillReceiveProps(props) {
    let context = defineContext(props);
    let state = this.state;

    state.isCandidateContext = context.isCandidate;
    state.isContactContext = context.isContact;

    this.setState(state);
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

  _onTouchTapCall() {
    console.log('_onTouchTapCall');
  }

  _onTouchTapSave() {
    console.log('_onTouchTapSave');
  }

  _onTouchTapEmail() {
    console.log('_onTouchTapEmail');
  }

  _onTouchTapWeb() {
    console.log('_onTouchTapWeb');
  }

  _onTouchTapShare() {
    console.log('_onTouchTapShare');
  }

  _handleTapOnChat() {
    console.log('_handleTapOnChat');
  }

  // _onTouchTapShare() {
  //   console.log('_onTouchTapShare');
  // }

  // _handleTapOnApplications() {
  //   console.log('_handleTapOnApplications');
  // }

  renderContent(contact, candidate) {

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

    if (candidate) {
      console.log(candidate.toJS());
    }

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
      let actions = [];

      if (this.state.isCandidateContext) {
        actions = [{
          materialIcon: 'phone',
          text: 'Call',
          onTouchTap: this._onTouchTapCall.bind(this),
        }, {
          materialIcon: 'star_rate',
          text: 'Save',
          onTouchTap: this._onTouchTapSave.bind(this),
        }, {
          materialIcon: 'email',
          text: 'Email',
          onTouchTap: this._onTouchTapEmail.bind(this),
        }, {
          materialIcon: 'share',
          text: 'Share',
          onTouchTap: this._onTouchTapShare.bind(this),
        }];
      } else {
        actions = [{
          materialIcon: 'phone',
          text: 'Call',
          onTouchTap: this._onTouchTapCall.bind(this),
        }, {
          materialIcon: 'email',
          text: 'Email',
          onTouchTap: this._onTouchTapEmail.bind(this),
        }, {
          materialIcon: 'star_rate',
          text: 'Save',
          onTouchTap: this._onTouchTapSave.bind(this),
        }, {
          materialIcon: 'public',
          text: 'Web',
          onTouchTap: this._onTouchTapWeb.bind(this),
        }];
      }

      // define topTags
      let topTags = [];

      if (this.state.isCandidateContext) {
        topTags = [
          {text: 'HOT!'},
          {text: 'Vetted', color: 'green'},
          {text: 'Active', color: 'green'},
        ];
      }

      return (

        <div>
          <DetailsCard
              title={displayName}
              subtitle={city}
              cover={cover}
              mainColor={Styles.Colors.indigo500}
              actions={actions}
              floatActionOnTap={this._handleTapOnChat.bind(this)}
              floatActionContent={<CommunicationChat color={Styles.Colors.indigo500}/>}
              topTags={topTags}
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

    //let { contact } = this.props;
    let contentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let { isContactContext, isCandidateContext } = this.state;

    let invited = false;
    let email = null;
    let contact = null;
    let candidate = null;
    let contextRessourceName = 'Contact';

    console.log('render isCandidateContext', this.state.isCandidateContext, 'isContactContext', this.state.isContactContext);

    if (isContactContext && !isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (isCandidateContext && !isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
      candidate = this.props.candidate;
      contextRessourceName = 'Candidate';
    }

    console.log(contact, candidate, this.props);

    if (contact) {
      invited = contact.get('isInvited');
      email = contact.get('email') || null;
    }

    return (
      <div>
        <Header transparent goBack={this.goBack.bind(this)} iconRight={
          <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
            {(this.state.isContactContext && !invited && !this.state.justInvited && email) ? (
              <MenuItem index={0} onTouchTap={this.inviteToHero.bind(this)} primaryText="Invite Contact" />
            ) : (null)}
            <MenuItem index={0} onTouchTap={this.editContactModalOpen.bind(this)} primaryText={`Edit ${contextRessourceName}`} />
          </IconMenu>
        }
        />
        <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
          {this.renderContent(contact, candidate)}
        </div>
      </div>
    );
  }
}

ContactDetails.propTypes = {
  candidate: React.PropTypes.object,
  contact: React.PropTypes.object,
  onContactDetailsClose: React.PropTypes.func,
  open: React.PropTypes.bool.isRequired,
};
