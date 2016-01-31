import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {
  Header, CustomTabsSwipe, ContactsList, ClientContactsCreateModal,
  CompanyJobsList, ContactDetailsModal, NotesCreateModal, JobCreateModal,
  JobDetailsModal, ClientsEditModal,
} from '../../../components/web';

import { getOneCompany } from '../../../modules/companies/index';
import { getOneLocation } from '../../../modules/locations';
import { getImageByJobId } from '../../../modules/resources';
import { getJobsByCompany, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob } from '../../../modules/jobs/index';
import { getNotesByCompany, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote } from '../../../modules/notes/index';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
import { getAllJobCandidates, createCandidate } from '../../../modules/candidates';
import { invite } from '../../../modules/users';
import getCompanyDataFromState from '../../../dataHelpers/company';
import getJobDataFromState from '../../../dataHelpers/job';

import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Styles
} from 'material-ui';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import MapsDirections from 'material-ui/lib/svg-icons/maps/directions';

const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
import MenuItem from 'material-ui/lib/menus/menu-item';

function getData(state, props) {

  let companyId = props.params.id;
  let jobId = props.params.jobId;
  let tab = props.params.tab;
  let tabId = 0;
  let localJobResource = null;


  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  switch (tab) {
  case 'jobs':
    tabId = 1;
    break;
  case 'notes':
    tabId = 3;
    break;
  default:
    tabId = 0;
  }

  let imageId = state.jobs.localJob.get('imageId');
  if (imageId) {
    localJobResource = state.resources.list.get(imageId);
  }

  return {
    tabId,
    company: getCompanyDataFromState(state, companyId),
    job: getJobDataFromState(state, jobId),
    notes: state.notes,
    localNote: state.notes.localNote,
    localJob: state.jobs.localJob,
    localJobResource,
    heroContacts,
    defaultContact: state.auth.contact,
  };
}

const style = {
  // slide: {
  //   minHeight: `${window.innerHeight - 160}px`,
  //   // marginTop: '48px',
  // },
  viewContent: {
    position: 'absolute',
    top: '0',
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
};

@connect((state, props) => (
getData(state, props)),
{getOneCompany, getOneLocation, getAllContacts, getContactsByCompany, getJobsByCompany, pushState, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob, getImageByJobId, getAllJobCandidates, getNotesByCompany, updateNoteLocal, deleteNote, saveLocalNote, replaceNoteLocal, invite, createCandidate })
class ClientDetailsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      contactDetailsModalOpen: false,
      openJob: false,
    };
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getOneCompany(self.props.params.id);
      self.props.getContactsByCompany(self.props.params.id);
      self.props.getJobsByCompany(self.props.params.id);
      self.props.getNotesByCompany(self.props.params.id);

      if (self.props.params.jobId) {
        self.props.getOneJob(self.props.params.jobId);
        self.props.getImageByJobId(self.props.params.jobId);
        self.props.getAllJobCandidates(self.props.params.jobId);
      }
      self.props.getContactsByCompany('568f0ea89faa7b2c74c18080');
    }, 500);
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.localJob.get('success')) {
      this.refs.jobCreateModal.closeModal();
      this.props.replaceJobLocal({companyId:this.props.params.id});
    }

    if (nextProps.params.jobId && nextProps.params.jobId != this.props.params.jobId) {
      this.props.getOneJob(nextProps.params.jobId);
      this.props.getImageByJobId(nextProps.params.jobId);
      this.props.getAllJobCandidates(nextProps.params.jobId);
    }

    if(nextProps.localNote.get('success')){
      this.refs.notesCreateModal.closeModal();
      this.props.replaceNoteLocal({});

      // if (this.props.tabId != 3) {
      //   this.refs.customTabsSwipe.getWrappedInstance()._handleChangeIndex(3);
      // }
    }
  }

  createContactModalOpen(){
    this.refs.clientContactsCreateModal.getWrappedInstance().show();
  }

  editClientModalOpen() {
    this.refs.clientEditModal.getWrappedInstance().show();
  }

  contactDetailsModalOpen(contact) {
    this.setState({
      contactDetailsModalOpen: true,
      detailsContact: contact,
    });
  }

  contactDetailsModalClose() {
    this.setState({
      contactDetailsModalOpen: false,
      detailsContact: null,
    });
  }

  _handleJobClick(job) {
    this.props.pushState({}, `/clients/${this.props.params.id}/jobs/${job.get('id')}`);
  }

  closeJobModal() {
    this.props.pushState('', `/clients/${this.props.params.id}/jobs`);
    this.setState({
      detailsJob: null,
      openJob: false,
    });
  }
  _inviteHandler(){
    var email = this.state.detailsContact.get('email');
    this.props.invite(email, window.location.origin + '/invited');
  }

  createNoteModalOpen() {
    this.props.replaceNoteLocal({});
    this.refs.notesCreateModal.show();
  }
  onNoteCreateChange (note){
    this.props.updateNoteLocal(note);
  }
  _handleSaveNote() {
    this.props.saveLocalNote(this.props.params.id, 'company');
  }
  _handleEditNote(note) {
    this.props.replaceNoteLocal(note);
    this.refs.notesCreateModal.show();
  }
  _handleDeleteNote(note) {
    this.props.replaceNoteLocal(note);
    this.props.deleteNote(note.get('id'));
  }
  createJobModalOpen() {
    this.props.replaceJobLocal({companyId:this.props.params.id});
    this.refs.jobCreateModal.show();
  }

  onJobCreateChange (job, dontMergeDeep){
    this.props.updateJobLocal(job, dontMergeDeep);
  }

  onJobCreateImageChange(imageArray){
    this.props.updateJobImageLocal(imageArray);
  }

  createCandidate(contact, jobId) {
    this.props.createCandidate(contact, jobId);
  }

  onSwipe(index){
    let tab = '';
    switch (index) {
    case 1:
      tab = 'jobs';
      break;
    case 3:
      tab = 'notes';
      break;
    default:
      tab = '';
    }
    this.props.pushState('', `/clients/${this.props.params.id}/${tab}`);
  }

  // <div style={style.slide}>
  //   <List>
  //     <div>
  //       {(website) ? (
  //         <ListItem
  //             leftIcon={<FontIcon className="material-icons">public</FontIcon>}
  //             primaryText={website}
  //             secondaryText={<p>website</p>}
  //             secondaryTextLines={1}
  //         />
  //       ) : (null)}
  //
  //       {(twitter) ? (
  //         <div>
  //           <Divider inset />
  //           <ListItem
  //               leftIcon={<FontIcon className="material-icons">public</FontIcon>}
  //               primaryText={`@${twitter}`}
  //               secondaryText={<p>twitter</p>}
  //               secondaryTextLines={1}
  //           />
  //         </div>
  //       ) : (null)}
  //
  //       {(facebook) ? (
  //         <div>
  //           <Divider inset />
  //           <ListItem
  //               leftIcon={<FontIcon className="material-icons">public</FontIcon>}
  //               primaryText={`facebook.com/${facebook}`}
  //               secondaryText={<p>facebook</p>}
  //               secondaryTextLines={1}
  //           />
  //         </div>
  //       ) : (null)}
  //
  //     </div>
  //   </List>
  //   <div id="innerView">
  //     {(company.get('location')) ? (
  //         <LocationCard style={{height: '200px'}} location={company.get('location')} marker={<CompanyAvatar url={company.get('website')} />}/>
  //     ) : (null)}
  //   </div>
  //   <List subheader="Your HERO talent advocate">
  //     {(company.get('clientAdvocate')) ? (
  //       <ListItem
  //         leftAvatar={<Gravatar email={company.get('clientAdvocate').get('email')} status={'vetted'} />}
  //         primaryText={company.get('clientAdvocate').get('displayName')}
  //         secondaryText={<p>Hero Talent Advocate</p>}
  //         secondaryTextLines={1}
  //       />
  //     ) : (null)}
  //     </List>
  //
  // </div>
  // <div style={style.slide}>
  //   <List subheader={`${company.get('jobs').count()} Job${((company.get('jobs').count() !== 1) ? ('s') : (''))}`}>
  //     <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={company.get('jobs')}/>
  //   </List>
  // </div>
  // <div style={style.slide}>
  //   <ContactsList contacts={company.get('contacts')} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
  // </div>
  // <div style={style.slide}>
  //   <List subheader={`${company.get('notes').count()} Note${((company.get('notes').count() !== 1) ? ('s') : (''))}`}>
  //     <CompanyNotesList company={company} editNote={this._handleEditNote.bind(this)} deleteNote={this._handleDeleteNote.bind(this)} notes={company.get('notes')} defaultContact={this.props.defaultContact}/>
  //   </List>
  // </div>

  render() {

    let {company, heroContacts} = this.props;

    if (company) {

      //let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
    //  let heroContact = '/img/rameet.jpg';
      return (
        <div>
          <JobDetailsModal closeModal={this.closeJobModal.bind(this)} job={this.props.job} company={company} open={(this.props.params.jobId)?(true):(false)} createCandidate={this.createCandidate.bind(this)} />

          <ClientContactsCreateModal ref="clientContactsCreateModal" companyId={this.props.params.id}/>
          <ClientsEditModal ref="clientEditModal" company={company}/>

          <ContactDetailsModal open={this.state.contactDetailsModalOpen} onInvite={this._inviteHandler.bind(this)} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
          <NotesCreateModal saveNote={this._handleSaveNote.bind(this)} onNoteChange={this.onNoteCreateChange.bind(this)} note={this.props.localNote} ref='notesCreateModal' />
          <JobCreateModal heroContacts={heroContacts} contacts={company.get('contacts')} saveJob={this.props.saveLocalJob} jobImage={this.props.localJobResource} onImageChange={this.onJobCreateImageChange.bind(this)} onJobChange={this.onJobCreateChange.bind(this)} job={this.props.localJob} ref='jobCreateModal'/>

          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            </IconMenu>
          } transparent
          />

          <div className="viewContent" style={style.viewContent}>
            <Card>
              <CardMedia>
                <img src="http://southerncaliforniabeaches.org/img/santa-monica-beach-path.jpg" />
              </CardMedia>
              <div style={style.cardTitle}>
                <FloatingActionButton style={style.direction} backgroundColor={Styles.Colors.white}>
                  <MapsDirections color={Styles.Colors.grey900}/>
                </FloatingActionButton>
                <CardTitle style={style.cardTitleComponent} subtitleColor={Styles.Colors.white} titleColor={Styles.Colors.white} subtitleStyle={style.subtitle} title={company.get('name')} subtitle={company.get('website')} />
              </div>
              <CardActions className="row center-xs">
                <div className="col-xs" style={style.actionBox}>
                  <div className="box">
                    <FontIcon style={style.actionFontIcon} className="material-icons">phone</FontIcon>
                    <FlatButton style={{minWidth: '0px'}} label="Call" />
                  </div>
                </div>
                <div className="col-xs" style={style.actionBox}>
                  <div className="box">
                    <FontIcon style={style.actionFontIcon} className="material-icons">star_rate</FontIcon>
                    <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Save" />
                  </div>
                </div>
                <div className="col-xs" style={style.actionBox}>
                  <div className="box">
                    <FontIcon style={style.actionFontIcon} className="material-icons">email</FontIcon>
                    <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Email" />
                  </div>
                </div>
                <div className="col-xs" style={style.actionBox}>
                  <div className="box">
                    <FontIcon style={style.actionFontIcon} className="material-icons">share</FontIcon>
                    <FlatButton style={{minWidth: '0px'}} labelPosition="after" label="Share" />
                  </div>
                </div>
              </CardActions>
            </Card>

            <CustomTabsSwipe isInline ref='customTabsSwipe' onSwipeEnd={this.onSwipe.bind(this)} startingTab={this.props.tabId} tabs={['Details', 'Jobs', 'Contacts']}>
              <List>
                <div>

                  {(twitter) ? (
                    <div>
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                          primaryText={`@${twitter}`}
                          secondaryText={<p>twitter</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                  {(facebook) ? (
                    <div>
                      <Divider inset />
                      <ListItem
                          leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                          primaryText={`facebook.com/${facebook}`}
                          secondaryText={<p>facebook</p>}
                          secondaryTextLines={1}
                      />
                    </div>
                  ) : (null)}

                </div>
              </List>
              <List subheader={`${company.get('jobs').count()} Job${((company.get('jobs').count() !== 1) ? ('s') : (''))}`}>
                <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={company.get('jobs')}/>
              </List>
              <ContactsList contacts={company.get('contacts')} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
            </CustomTabsSwipe>

          </div>

        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
