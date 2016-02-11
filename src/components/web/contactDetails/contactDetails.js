import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import md5 from 'md5';

import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard, CustomTabsSwipe } from '../../../components/web';
import {
   IconButton, List, ListItem, FontIcon, Avatar,
  Divider, Styles, IconMenu, MenuItem, CardText, Card,
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

const style = {
  title:{
    color:'rgba(0, 0, 0, 0.87)',
    fontSize:'15px',
    fontWeight:'500',
  },
  content:{
    color:'rgba(0, 0, 0, 0.54)',
    fontSize:'14px',
    fontWeight:'500',
  },
  card: {
    paddingTop: '4px',
  },
  avatar: {
    margin: '8px 17px 8px 0px',
  },
};

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

  getCommonDetailsCard(contact) {

    // build cover from gravatar
    let email = contact.get('email') || null;
    let cover = null;

    if (email) {
      cover = md5(email);
    } else {
      cover = '00000000000000000000000000000000';
    }

    // location stuff
    let address = contact.get('_address');
    let city = null;

    if (address) {
      city = address.get('city') || null;
      let countrySubDivisionCode = address.get('countrySubDivisionCode') || null;

      if (city && countrySubDivisionCode) {
        city += `, ${countrySubDivisionCode}`;
      }
    }

    // displayName
    let displayName = contact.get('displayName') || null;

    return {
      cover: `http://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      city,
      displayName,
    };
  }

  renderCandidateDetailsCard(contact, candidate) {

    if (candidate) {
      console.log(candidate.toJS());
    }

    let common = this.getCommonDetailsCard(contact);

    let topTags = [
      {text: 'HOT!'},
      {text: 'Vetted', color: 'green'},
      {text: 'Active', color: 'green'},
    ];

    let actions = [{
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

    // salary
    let salaryMin = '$[?]';
    let salaryMax = '$[?]';

    if (contact.get('currentSalary')) {
      salaryMin = `$${~~(contact.get('currentSalary')) / 1000}k`;
    }

    if (contact.get('desiredSalary')) {
      salaryMax = `$${~~(contact.get('desiredSalary')) / 1000}k`;
    }

    // workAuthorization
    let workAuthorization = contact.get('workAuthorization') || null;

    return (
      <DetailsCard
          title={common.displayName}
          subtitle={common.city}
          cover={common.cover}
          mainColor={Styles.Colors.indigo500}
          actions={actions}
          floatActionOnTap={this._handleTapOnChat.bind(this)}
          floatActionContent={<div><p style={{color: `${Styles.Colors.indigo500}`, fontSize: '20px', fontWeight: '500'}}>12</p></div>}
          topTags={topTags}
          extraLeftLine={`${salaryMin} - ${salaryMax}`}
          extraRightLine={workAuthorization}
      />
    );
  }

  renderContactDetailsCard(contact) {

    let common = this.getCommonDetailsCard(contact);

    let actions = [{
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

    return (
      <DetailsCard
          title={common.displayName}
          subtitle={common.city}
          cover={common.cover}
          mainColor={Styles.Colors.indigo500}
          actions={actions}
          floatActionOnTap={this._handleTapOnChat.bind(this)}
          floatActionContent={<CommunicationChat color={Styles.Colors.indigo500}/>}
      />
    );
  }

  renderBigListItem(title, content, avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display:'inline-block'}}>
          <div style={style.title}>{title}</div>
          <div style={style.content}>{content}</div>
        </div>
      </div>
    );
  }

  renderContent(contact, candidate) {

    let email = null;
    let phone = null;
    let addressLine = null;
    // let city = null;
    // let postalCode = null;
    // let countrySubDivisionCode = null;
    let source = null;

    if (contact) {
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;

      if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
        source = contact.get('sourceInfo').get('referrer');
      }

      // location stuff
      let location = contact.get('_address');

      if (location) {
        let address = location.get('addressLine') || '';
        let city = location.get('city') || null;
        let countrySubDivisionCode = location.get('countrySubDivisionCode') || null;

        if (city && countrySubDivisionCode) {
          city += `, ${countrySubDivisionCode}`;
        }

        addressLine = address;
        if (addressLine.length) {
          addressLine += `. ${city}`;
        } else {
          addressLine = city;
        }
      }

      return (

        <div>
          {(this.state.isCandidateContext) ? (
            this.renderCandidateDetailsCard(contact, candidate)
          ) : (
            this.renderContactDetailsCard(contact)
          )}
          <CustomTabsSwipe isLight isInline tabs={['Details', 'Jobs', 'Notes']}>
            <div>
              <Card style={style.card}>
                <CardText>
                  {this.renderBigListItem('Quick Pitch', candidate.get('pitch') || 'no pitch yet',
                  <Avatar
                      icon={<FontIcon className="material-icons">info_outline</FontIcon>}
                      color={Styles.Colors.grey600}
                      style={style.avatar}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Bonus Note', candidate.get('bonusNotes') || 'no bonus note yet',
                  <Avatar
                      icon={<FontIcon className="material-icons">redeem</FontIcon>}
                      color={Styles.Colors.grey600}
                      style={style.avatar}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Availability', candidate.get('availability') || 'not set yet',
                  <Avatar
                      icon={<FontIcon className="material-icons">insert_invitation</FontIcon>}
                      color={Styles.Colors.grey600}
                      style={style.avatar}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('X Factors', candidate.get('xfactors') || 'not set yet',
                  <Avatar
                      icon={<FontIcon className="material-icons">trending_up</FontIcon>}
                      color={Styles.Colors.grey600}
                      style={style.avatar}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
              </Card>
              <List style={{position: 'relative', top: '3px'}}>
                <div>

                  <ListItem
                      leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                      primaryText={addressLine || 'Somewhere, USA'}
                      secondaryText={<p>location</p>}
                      secondaryTextLines={1}
                  />

                  {(email) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">mail</FontIcon>}
                          primaryText={email}
                          secondaryText={<p>email</p>}
                          secondaryTextLines={1}
                      />
                    </div>
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
            <div>
              <p>jobs</p>
            </div>
            <div>
              <p>notes</p>
            </div>
          </CustomTabsSwipe>
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

    //console.log('render isCandidateContext', this.state.isCandidateContext, 'isContactContext', this.state.isContactContext);

    if (isContactContext && !isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (isCandidateContext && !isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
      candidate = this.props.candidate;
      contextRessourceName = 'Candidate';
    }

    //console.log(contact, candidate, this.props);

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
