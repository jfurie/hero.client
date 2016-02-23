import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { replaceNoteLocal } from '../../../modules/notes/index';
import md5 from 'md5';
import Immutable from 'immutable';
import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard, CustomTabsSwipe, JobListItem, CompanyNotesList } from '../../../components/web';
import {
  IconButton, List, ListItem, FontIcon, Avatar,
  Divider, Styles, IconMenu, MenuItem, CardText, Card,
} from 'material-ui';
import image from './image';
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
{}), {pushState, replaceNoteLocal,replaceState})
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
  _guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  addNote(note){
    if (!note) {
      note = new Immutable.Map({
        id: 'tmp_' + this._guid(),
        privacyValue: 0,
      });
    }
    this.props.replaceNoteLocal(note);
    if(this.state.isContactContext){
      this.props.pushState({}, `/contacts/${this.props.contact.get('id')}/notes/${note.get('id')}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
    } else {
      this.props.pushState({}, `/candidates/${this.props.candidate.get('id')}/notes/${note.get('id')}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
    }
  }
  deleteNote(note){
    this.props.deleteNote(note);
  }
  addNoteModalOpen(e,note){
    this.addNote(note);
  }

  _onTouchTapCall(disabled) {
    let contact = null;

    if (this.state.isContactContext && !this.state.isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (this.state.isCandidateContext && !this.state.isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
    }

    if (!disabled) {
      window.location.href = `tel:${contact.get('phone')}`;
    } else {
      console.log('no phone');
    }
  }

  _onTouchTapSave() {
    let contact = null;

    if (this.state.isContactContext && !this.state.isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (this.state.isCandidateContext && !this.state.isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
    }

    if (contact.get('isFavorited')) {
      this.props.unfavoriteContact();
    }
    else {
      this.props.favoriteContact();
    }
  }

  _onTouchTapEmail() {
    let contact = null;

    if (this.state.isContactContext && !this.state.isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (this.state.isCandidateContext && !this.state.isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
    }

    let email = contact.get('email');
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  _onTouchTapWeb(disabled) {
    if (!disabled) {
      console.log('_onTouchTapWeb');
    } else {
      console.log('no web');
    }
  }

  _onTouchTapShare() {
    let contact = null;

    if (this.state.isContactContext && !this.state.isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (this.state.isCandidateContext && !this.state.isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
    }

    let subject = `Check out ${contact.get('displayName')} on HERO`;
    let body = `${encodeURIComponent(contact.get('displayName'))}%0A${encodeURIComponent(window.location.href)}`;
    window.location.href=`mailto:?Subject=${encodeURIComponent(subject)}&Body=${body}`;
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
      cover: image, //`http://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      city,
      displayName,
    };
  }

  _showJobDetails(job) {
    this.props.pushState(null, `/clients/${job.get('companyId')}/jobs/${job.get('id')}`);
  }

  renderCandidateDetailsCard(contact, candidate) {

    if (candidate) {
      console.log(candidate.toJS());
    }

    let common = this.getCommonDetailsCard(contact);

    let actions = [{
      materialIcon: 'phone',
      text: 'Call',
      disabled: (contact.get('phone') ? (false) : (true)),
      onTouchTap: this._onTouchTapCall.bind(this),
    }, {
      materialIcon: 'star_rate',
      text: contact && contact.get('isFavorited') ? 'Saved' : 'Save',
      active: contact && contact.get('isFavorited'),
      onTouchTap: this._onTouchTapSave.bind(this),
    }, {
      materialIcon: 'email',
      text: 'Email',
      disabled: (contact.get('email') ? (false) : (true)),
      onTouchTap: this._onTouchTapEmail.bind(this),
    }, {
      materialIcon: 'share',
      text: 'Share',
      onTouchTap: this._onTouchTapShare.bind(this),
    }];

    // salary
    let salaryMin = null;
    let salaryMax = null;
    let extraLeftLine = null;

    if (contact.get('currentSalary')) {
      salaryMin = `$${~~(contact.get('currentSalary')) / 1000}k`;
    }

    if (contact.get('desiredSalary')) {
      salaryMax = `$${~~(contact.get('desiredSalary')) / 1000}k`;
    }

    if (salaryMin && salaryMax) {
      extraLeftLine = `${salaryMin} - ${salaryMax}`;
    } else if (salaryMin && !salaryMax) {
      extraLeftLine = `- ${salaryMax}`;
    } else if (!salaryMin && salaryMax) {
      extraLeftLine = `${salaryMin} -`;
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
          floatActionContent={<CommunicationChat color={Styles.Colors.indigo500}/>}
          topTags={contact.get('tags') || []}
          extraLeftLine={extraLeftLine}
          extraRightLine={workAuthorization}
      />
    );
  }

  renderBigListItem(title, content, iconName){
    return (
      <CardText>
        <div style={{display:'flex'}}>
          <div style={{flex:'0 0 56px'}}>
            <Avatar
                icon={<FontIcon className="material-icons">{iconName}</FontIcon>}
                color={Styles.Colors.grey600}
                style={style.avatar}
                backgroundColor={Styles.Colors.white}
            />
          </div>
          <div style={{display:'inline-block'}}>
            <div style={style.title}>{title}</div>
            <div style={style.content}>{content}</div>
          </div>
        </div>
      </CardText>
    );
  }

  onTabChange(index){
    console.log(index);
    this.props.replaceState({
      tab:index,
    }, location.pathname+location.search);
  }

  renderContent(contact) {

    let email = null;
    let phone = null;
    let addressLine = null;
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

      // startingDate
      let startingDate = contact.get('startDate') || null;
      if (startingDate) {
        let d = new Date(startingDate);
        startingDate = d.toDateString();
      }

      // quickPitch
      let quickPitch = contact.get('pitch') || null;
      let summary = contact.get('summary') || null;
      let description = '';

      if (quickPitch) {
        description += `${quickPitch} `;
      }

      if (summary) {
        description += summary;
      }
      let startingTab = 0;
      console.log(this.props.location.state);
      if(this.props.location.state && this.props.location.state.tab){
        startingTab = parseInt(this.props.location.state.tab);
      }

      return (

        <div>
          {this.renderCandidateDetailsCard(contact)}
          <CustomTabsSwipe startingTab={startingTab} onChange={this.onTabChange.bind(this)} isLight isInline tabs={['Details', 'Jobs', 'Notes']}>
            <div>
              <Card style={style.card}>

                {(description.length > 0) ? (
                  this.renderBigListItem('Quick pitch', description, 'info_outline')
                ) : (null)}

                {(contact.get('bonusNotes')) ? (
                  this.renderBigListItem('Bonus note', contact.get('bonusNotes'), 'redeem')
                ) : (null)}

                {(contact.get('rfl')) ? (
                  this.renderBigListItem('Reason for leaving', contact.get('rfl'), 'swap_horiz')
                ) : (null)}

                {(contact.get('jobsAppliedFor')) ? (
                  this.renderBigListItem('Job(s) applied for', contact.get('jobsAppliedFor'), 'system_update_alt')
                ) : (null)}

                {(contact.get('availability')) ? (
                  this.renderBigListItem('Availability', contact.get('availability'), 'insert_invitation')
                ) : (null)}

                {(startingDate) ? (
                  this.renderBigListItem('Starting date', startingDate, 'insert_invitation')
                ) : (null)}

                {(contact.get('targetLocations')) ? (
                  this.renderBigListItem('Target location(s)', contact.get('targetLocations'), 'place')
                ) : (null)}

                {(contact.get('xfactors')) ? (
                  this.renderBigListItem('X Factors', contact.get('xfactors'), 'trending_up')
                ) : (null)}


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
            <List style={style.list} subheader={`${contact.get('jobs') ? contact.get('jobs').size : 0} Job`}>
              {contact.get('jobs') && contact.get('jobs').map((job, key) => {
                return (
                  <div key={key}>
                    <JobListItem
                        onJobClick={this._showJobDetails.bind(this)}
                        job={job}
                        favoriteJob={this.props.favoriteJob.bind(this)}
                        unfavoriteJob={this.props.unfavoriteJob.bind(this)}
                    />
                  </div>
                );
              })}
            </List>
            <List subheader={`${contact.get('notes') && contact.get('notes').count()} Note${((contact.get('notes') && contact.get('notes').count() !== 1) ? ('s') : (''))}`}>
              <CompanyNotesList editNote={this.addNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={contact.get('notes')}/>
            </List>
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
    //let candidate = null;
    let contextRessourceName = 'Contact';

    //console.log('render isCandidateContext', this.state.isCandidateContext, 'isContactContext', this.state.isContactContext);

    if (isContactContext && !isCandidateContext) { /* contact context */
      contact = this.props.contact;
    } else if (isCandidateContext && !isContactContext) { /* candidate context */
      contact = this.props.candidate.get('contact');
      //candidate = this.props.candidate;
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
            <MenuItem index={0} onTouchTap={this.addNoteModalOpen.bind(this)} primaryText={`Create Note`} />
            <MenuItem index={0} onTouchTap={this.editContactModalOpen.bind(this)} primaryText={`Edit ${contextRessourceName}`} />
          </IconMenu>
        }
        />
        <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
          {this.renderContent(contact)}
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
