import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { replaceNoteLocal } from '../../../modules/notes/index';
import { invite } from '../../../modules/users';
import md5 from 'md5';
import Immutable from 'immutable';
import CommunicationChat from 'material-ui/lib/svg-icons/communication/chat';

import { Header, DetailsCard, CustomTabsSwipe, JobListItem, CompanyNotesList, CompanyAvatar, InviteSuccessModal } from '../../../components/web';
import {
  IconButton, List, ListItem, FontIcon, Avatar,
  Styles, IconMenu, MenuItem, CardText, Card,
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
    marginLeft:'-6px',
  },
};

@connect(() => (
{}), {pushState, replaceNoteLocal,replaceState, invite})
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
    //console.log('yo!');
    this.props.pushState(null,`/contacts/${this.props.contact.get('id')}/create`);
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
    this.props.invite(this.props.contact.get('email'), window.location.origin + '/invited');
    this.setState({confirmOpen: true});
    this.handleConfirmInviteGo();
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
    let number = this.props.contact.get('phone');
    window.location.href=`sms:${number}`;
    //console.log('_handleTapOnChat');
  }

  // _onTouchTapShare() {
  //   console.log('_onTouchTapShare');
  // }

  // _handleTapOnApplications() {
  //   console.log('_handleTapOnApplications');
  // }
  clickCompany(companyId){
    this.props.pushState(null, `/clients/${companyId}`);
  }
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
    let address = contact.get('location');
    if(!address){
      address = contact.get('_address');
    }
    let city = null;

    if (address) {
      city = address.get('city') || null;
      let countrySubDivisionCode = address.get('countrySubDivisionCode') || null;

      if (city && countrySubDivisionCode) {
        city += `, ${countrySubDivisionCode}`;
      }
    }

    //companyName
    let company =null;
    let companies = contact.get('companies');
    if(companies && companies.size >0){
      company =companies.first();
    }
    let companyName = null;
    let subtitleAvatar = null;
    if(company){
      companyName = company.get('name');
      let companyId = company.get('id');
      subtitleAvatar =(<CompanyAvatar onTouchTap={this.clickCompany.bind(this,companyId)} style={{width: '40px'}} url={company.get('website')}/>);
    }
    let title = contact.get('title');

    // displayName
    let displayName = contact.get('displayName') || null;

    return {
      cover: image, //`https://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      city,
      displayName,
      avatarUrl: `https://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      companyName,
      title,
      subtitleAvatar
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

    let stats = [{
      title: 'Applied',
      value: 0,
    }, {
      title: 'Submitted',
      value: 0,
    }, {
      title: 'Accepted',
      value: 0,
    }, {
      title: 'Interviews',
      value: 0,
    }, {
      title: 'Offers',
      value: 0,
    }, {
      title: 'Jobs',
      value: 0,
    }];

    // salary
    let salaryMin = null;
    let salaryMax = null;
    let extraLeftLine = null;

    if (contact.get('currentSalary')) {
      let currentSalary = parseInt(contact.get('currentSalary'));
      salaryMin = `$${~~(currentSalary) / 1000}k`;
    }

    if (contact.get('desiredSalary')) {
      let desiredSalary = parseInt(contact.get('desiredSalary'));
      salaryMax = `$${~~(desiredSalary) / 1000}k`;
    }

    if (salaryMin && salaryMax) {
      extraLeftLine = `${salaryMin} - ${salaryMax}`;
    } else if (salaryMin && !salaryMax) {
      extraLeftLine = `- ${salaryMax}`;
    } else if (!salaryMin && salaryMax) {
      extraLeftLine = `${salaryMin} -`;
    }
    let style ={
      title:{
        color:Styles.Colors.black,
      },
      subtitle:{
        color:Styles.Colors.black,
      },
      extraLeftLine:{
        color:Styles.Colors.black,
      },
      extraRightLine:{
        color:Styles.Colors.black,
      },
      extraCenterLine:{
        color:Styles.Colors.black,
      },
      floatActionLabel:{
        color:Styles.Colors.black,
      },
    };
    // workAuthorization
    let workAuthorization = contact.get('workAuthorization') || null;

    let tags = contact.get('tags');
    if(tags){
      tags = tags.toArray();
    } else {
      tags = [];
    }
    if(tags.indexOf(contact.get('status') <=-1)){
      tags.push(contact.get('status'));
    }


    return (
      <DetailsCard
          title={common.displayName}
          style={style}
          subtitle={common.companyName}
          subtitle2={common.title}
          cover={common.cover}
          mainColor={Styles.Colors.white}
          actions={actions}
          stats={stats}
          showStats={false}
          avatar={<img style={{width: '95px', height:'95px', borderRadius:'0px'}} src={common.avatarUrl}/>}
          floatActionOnTap={this._handleTapOnChat.bind(this)}
          floatActionContent={<CommunicationChat color={Styles.Colors.black}/>}
          topTags={tags || []}
          extraLeftLine={extraLeftLine}
          extraRightLine={workAuthorization}
          floatActionLabel={'Message'}
          subtitleAvatar={common.subtitleAvatar}
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

  clickResume(){
    window.open(this.props.contact.get('resume').get('item'), '_blank');
  }

  onTabChange(index){
    console.log(index);
    this.props.replaceState({
      tab:index,
    }, location.pathname+location.search);
  }

  tabChange(number){
    if(number){
      this.props.replaceState(null,`/contacts/${this.props.contact.get('id')}?tab=${number}`);
    }
  }

  renderContent(contact) {

    let email = null;
    let phone = null;
    let addressLine = null;
    let source = null;
    let website = null;
    let resume = null;
    if (contact) {
      resume = contact.get('resume')|| null;
      email = contact.get('email') || null;
      phone = contact.get('phone') || null;
      website = contact.get('website') || null;
      if (contact.get('sourceInfo') && contact.get('sourceInfo').get('referrer')) {
        source = contact.get('sourceInfo').get('referrer');
      }

      // location stuff
      let location = contact.get('location');
      if(!location){
        location = contact.get('_address');
      }
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

      return (

        <div>
          {this.renderCandidateDetailsCard(contact)}
          <CustomTabsSwipe startingTab={this.props.tab} onChange={this.tabChange.bind(this)} isLight isInline tabs={['Details', 'Jobs', 'Notes']}>
            <div style={{minHeight:'800px'}}>

              <List style={{position: 'relative', top: '3px'}}>
                <div>

                  <ListItem
                      leftIcon={<FontIcon className="material-icons">place</FontIcon>}
                      primaryText={addressLine || 'Somewhere, USA'}
                  />
                  {(resume) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">description</FontIcon>}
                          primaryText={'Resume'}
                          onTouchTap={this.clickResume.bind(this)}
                      />
                    </div>
                  ) : (null)}

                  {(email) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">mail</FontIcon>}
                          primaryText={email}
                      />
                    </div>
                  ) : (null)}

                  {(phone) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">phone</FontIcon>}
                          primaryText={phone}
                      />
                    </div>
                  ) : (null)}

                  {(source) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">redo</FontIcon>}
                          primaryText={source}
                      />
                    </div>
                  ) : (null)}
                  {(website) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">redo</FontIcon>}
                          primaryText={website}
                      />
                    </div>
                  ) : (null)}

                </div>
              </List>
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
            </div>
            <div style={{minHeight:'800px'}}>
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
            </div>
            <div style={{minHeight:'800px'}}>
              <List subheader={`${contact.get('notes') && contact.get('notes').count()} Note${((contact.get('notes') && contact.get('notes').count() !== 1) ? ('s') : (''))}`}>
                <CompanyNotesList editNote={this.addNote.bind(this)} deleteNote={this.deleteNote.bind(this)} notes={contact.get('notes')}/>
              </List>
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
    //let contentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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
        <Header showHome={true} transparent goBack={this.goBack.bind(this)} iconRight={
          <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}>
            <MenuItem index={0} onTouchTap={this.editContactModalOpen.bind(this)} primaryText={`Edit ${contextRessourceName}`} />
            {(this.state.isContactContext && !invited && !this.state.justInvited && email) ? (
              <MenuItem index={0} onTouchTap={this.inviteToHero.bind(this)} primaryText="Invite Contact" />
            ) : (null)}
            <MenuItem index={0} onTouchTap={this.addNoteModalOpen.bind(this)} primaryText={`Create Note`} />
          </IconMenu>
        }
        />
        {this.renderContent(contact)}
        <InviteSuccessModal email={this.props.contact && this.props.contact.get('email')} ref={'inviteSuccessModal'}></InviteSuccessModal>
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
