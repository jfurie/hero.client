import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';
import { replaceNoteLocal } from '../../../modules/notes/index';
import { invite } from '../../../modules/users';
import md5 from 'md5';
import Immutable from 'immutable';

import { CardTitle, LocationCard, Header, DetailsCard, CustomTabsSwipe, JobListItem, CompanyNotesList, CompanyAvatar, InviteSuccessModal, JSONTree } from '../../../components/web';
import {
  IconButton, List, FontIcon, Avatar,
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
  smallListItem: {
    padding: 0,
    margin: '16px',
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
  editSkills(){
    this.props.pushState(null, `/contacts/${this.props.contact.get('id')}/categories/edit`);
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

    let location = contact.get('location') || null;

    let desiredSalary;

    if (contact.get('desiredSalary')) {
      desiredSalary = `$${~~(contact.get('desiredSalary')) / 1000}k`;
    }

    return {
      cover: image, //`https://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      city,
      displayName,
      avatarUrl: `https://www.gravatar.com/avatar/${cover}?d=mm&s=500`,
      companyName,
      title,
      subtitleAvatar,
      location,
      desiredSalary,
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

    // let stats = [{
    //   title: 'Applied',
    //   value: 0,
    // }, {
    //   title: 'Submitted',
    //   value: 0,
    // }, {
    //   title: 'Accepted',
    //   value: 0,
    // }, {
    //   title: 'Interviews',
    //   value: 0,
    // }, {
    //   title: 'Offers',
    //   value: 0,
    // }, {
    //   title: 'Jobs',
    //   value: 0,
    // }];

    // salary
    // let salaryMin = null;
    // let salaryMax = null;
    // let extraLeftLine = null;
    //
    // if (contact.get('currentSalary')) {
    //   let currentSalary = parseInt(contact.get('currentSalary'));
    //   salaryMin = `$${~~(currentSalary) / 1000}k`;
    // }
    //
    // if (contact.get('desiredSalary')) {
    //   let desiredSalary = parseInt(contact.get('desiredSalary'));
    //   salaryMax = `$${~~(desiredSalary) / 1000}k`;
    // }
    //
    // if (salaryMin && salaryMax) {
    //   extraLeftLine = `${salaryMin} - ${salaryMax}`;
    // } else if (salaryMin && !salaryMax) {
    //   extraLeftLine = `- ${salaryMax}`;
    // } else if (!salaryMin && salaryMax) {
    //   extraLeftLine = `${salaryMin} -`;
    // }
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

    let avatar = (
      <div style={{position: 'relative'}}>
        <img style={{width: '95px', height:'95px', borderRadius:'0px'}} src={common.avatarUrl}/>
        <img
          style={{
            width: '35px',
            height:'35px',
            borderRadius:'0px',
            position: 'absolute',
            bottom: '4px',
            right: 0,
            border: '2px solid white',
            borderBottom: 'none',
            borderRight: 'none',
          }}
          src="http://www.w3devcampus.com/wp-content/uploads/logoAndOther/logo_JavaScript.png"/>
      </div>
    );

    return (
      <DetailsCard
          topTitle={common.displayName}
          topSubtitle={common.companyName}
          location={common.location}
          bottomLabel="Current Title"
          bottomTitle={common.title}
          rightLabel="Desired Wage"
          rightTitle={common.desiredSalary}
          rightSubtitle={workAuthorization}
          cover={common.cover}
          actions={actions}
          avatar={avatar}
          floatActionOnTap={this._handleTapOnChat.bind(this)}
          floatActionContent={<FontIcon className="material-icons">share</FontIcon>}
          floatActionLabel={'Share'}
      />
    );
  }

  renderBigListItem(title,content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        {
          content ?
          <div style={{display: 'inline-block'}}>
            <div style={style.title}>{title}</div>
            <div style={style.content}>{content}</div>
          </div>
          :
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={style.title}>{title}</div>
          </div>
        }

      </div>
    );
  }

  renderSmallListItem(content,avatar){
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:'0 0 56px'}}>
          {avatar}
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{color:'rgba(0, 0, 0, 0.87)', fontSize:'15px'}}>{content}</div>
        </div>
      </div>
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
          <CustomTabsSwipe startingTab={this.props.tab} onChange={this.tabChange.bind(this)} isLight isInline tabs={['Details', 'Jobs', 'Notes','Data']}>
            <div style={{minHeight:'800px'}}>
              <Card>
                <CardTitle title="Details" style={{padding: 0, margin: '16px 24px'}} titleStyle={{fontSize: '18px', color: Styles.Colors.grey600}} />
                {(addressLine) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(addressLine,
                    <Avatar
                        icon={<FontIcon className="material-icons">place</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(resume) ? (
                  <CardText
                    style={style.smallListItem}
                    onTouchTap={this.clickResume.bind(this)}>
                    {this.renderSmallListItem('Resume',
                    <Avatar
                        icon={<FontIcon className="material-icons">description</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(email) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(email,
                    <Avatar
                        icon={<FontIcon className="material-icons">mail</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(phone) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(phone,
                    <Avatar
                        icon={<FontIcon className="material-icons">phone</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(source) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(source,
                    <Avatar
                        icon={<FontIcon className="material-icons">redo</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}

                {(website) ? (
                  <CardText style={style.smallListItem}>
                    {this.renderSmallListItem(website,
                    <Avatar
                        icon={<FontIcon className="material-icons">public</FontIcon>}
                        color={Styles.Colors.grey600}
                        backgroundColor={Styles.Colors.white}
                    />)}
                  </CardText>
                ) : (null)}
              </Card>

              <LocationCard location={contact.get('location')} />

              <Card style={style.card}>
                <CardText>
                  {this.renderBigListItem('Quick pitch',description,
                  <Avatar
                      icon={<FontIcon className="material-icons">info_outline</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Bonus note',contact.get('bonusNotes'),
                  <Avatar
                      icon={<FontIcon className="material-icons">redeem</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Reason for leaving', contact.get('rfl'),
                  <Avatar
                      icon={<FontIcon className="material-icons">swap_horiz</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Job(s) applied for', contact.get('jobsAppliedFor'),
                  <Avatar
                      icon={<FontIcon className="material-icons">system_update_alt</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Availability', contact.get('availability'),
                  <Avatar
                      icon={<FontIcon className="material-icons">insert_invitation</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Starting date', startingDate,
                  <Avatar
                      icon={<FontIcon className="material-icons">insert_invitation</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('Target location(s)', contact.get('targetLocations'),
                  <Avatar
                      icon={<FontIcon className="material-icons">place</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
                <CardText>
                  {this.renderBigListItem('X Factors', contact.get('xfactors'),
                  <Avatar
                      icon={<FontIcon className="material-icons">trending_up</FontIcon>}
                      color={Styles.Colors.grey600}
                      backgroundColor={Styles.Colors.white}
                  />)}
                </CardText>
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
            <div>
              <JSONTree data={this.props}></JSONTree>
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
          <IconMenu iconButtonElement={<IconButton iconStyle={{color: Styles.Colors.white}} iconClassName="material-icons">more_vert</IconButton>}>
            <MenuItem index={0} onTouchTap={this.editContactModalOpen.bind(this)} primaryText={`Edit ${contextRessourceName}`} />
            {(this.state.isContactContext && !invited && !this.state.justInvited && email) ? (
              <MenuItem index={0} onTouchTap={this.inviteToHero.bind(this)} primaryText="Invite Contact" />
            ) : (null)}
            <MenuItem index={0} onTouchTap={this.addNoteModalOpen.bind(this)} primaryText={`Create Note`} />
            <MenuItem index={0} onTouchTap={this.editSkills.bind(this)} primaryText={`Edit Skills`} />
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
