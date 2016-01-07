import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import {
  Header, CustomTabsSwipe, LocationCard, ContactsList, ClientContactsCreateModal,
  CompanyJobsList, CompanyNotesList, ContactDetailsModal, NotesCreateModal, JobCreateModal, JobDetailsModal,
  ClientsEditModal } from '../../../components/web';

import { getOneCompany } from '../../../modules/companies';
import { getOneLocation } from '../../../modules/locations';
import { getImageByJobId } from '../../../modules/resources';
import { getJobsByCompany, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob } from '../../../modules/jobs/index';
import { getNotesByCompany, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote } from '../../../modules/notes/index';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';

import {
  List, ListItem, Divider, FontIcon, IconMenu, IconButton, Avatar,
} from 'material-ui';

import MenuItem from 'material-ui/lib/menus/menu-item';

function getData(state, props) {

  let id = props.params.id;
  let jobId = props.params.jobId;
  let tab = props.params.tab;
  let tabId = 0;
  let company = ((state.companies.list.size > 0) ? (state.companies.list.get(id)) : (null));
  let location = null;
  let contacts = state.contacts; // TMP
  let localJobResource = null;

  if (company && company.get('location')) {
    location = ((state.locations.list.size > 0) ? (state.locations.list.get(company.get('location'))) : (null));
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
  let newContacts = {
    ...contacts,
    list: new Immutable.Map(),
  };

  let contactsByCompanyListIds = contacts.byCompanyId.get(id);

  //console.log('contactsByCompanyListIds', contactsByCompanyListIds);

  if (contactsByCompanyListIds) {
    newContacts.list = contacts.list.filter(x => {
      return contactsByCompanyListIds.indexOf(x.get('id')) > -1;
    });
  }
  var imageId = state.jobs.localJob.get('imageId');
  if(imageId){
    localJobResource = state.resources.list.get(imageId);
  }

  let job = state.jobs.list.get(jobId);
  let jobImage = job ? state.resources.list.get(job.get('imageId')) : new Immutable.Map();


  // filter down company jobs
  let jobsByCompanyListIds = state.jobs.byCompanyId.get(id);
  let companyJobs = new Immutable.Map();

  if (jobsByCompanyListIds) {
    companyJobs = state.jobs.list.filter(x => {
      return jobsByCompanyListIds.indexOf(x.get('id')) > -1;
    });
  }

  // filter down company notes
  let notesByCompanyListIds = state.notes.byCompanyId.get(id);
  let companyNotes = new Immutable.Map();

  if (notesByCompanyListIds) {
    companyNotes = state.notes.list.filter(x => {
      return notesByCompanyListIds.indexOf(x.get('id')) > -1;
    });
  }

  companyNotes = companyNotes.reverse();

  return {
    tabId,
    company,
    location,
    //job,
    jobImage,
    contacts: newContacts,
    jobs: state.jobs,
    notes: state.notes,
    localNote: state.notes.localNote,
    companyJobs,
    companyNotes,
    localJob: state.jobs.localJob,
    localJobResource,
  };
}

const style = {
  slide: {
    minHeight: `${window.innerHeight - 112}px`,
  },
};

@connect((state, props) => (
getData(state, props)),
{getOneCompany, getOneLocation, getAllContacts, getContactsByCompany, getJobsByCompany, pushState, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob, getImageByJobId, getNotesByCompany, updateNoteLocal, deleteNote, saveLocalNote, replaceNoteLocal})
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
      self.props.getOneJob(self.props.params.jobId);
      self.props.getImageByJobId(self.props.params.jobId);
    },500);
  }

  componentWillUpdate() {

  }
  componentWillReceiveProps(nextProps){
    if(nextProps.localJob.get('success')){
      this.refs.jobCreateModal.closeModal();
      this.props.replaceJobLocal({companyId:this.props.params.id});
    }

    if(nextProps.localNote.get('success')){
      this.refs.notesCreateModal.closeModal();
      this.props.replaceNoteLocal({companyId:this.props.params.id});
    }
  }

  // saveClient() {
  //   console.log('cool!');
  // }

  createContactModalOpen(){
    this.refs.clientContactsCreateModal.getWrappedInstance().show();
  }

  editClientModalOpen() {
    this.refs.clientEditModal.getWrappedInstance().show();
  }

  // editClientModalClose() {
  //   this.setState({
  //     detailsJob:null,
  //     openJob:false
  //   });
  // }

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

  closeJobModal(){
    this.props.pushState('','/clients/'+this.props.params.id +'/jobs');
    this.setState({
      detailsJob: null,
      openJob: false,
    });
  }

  createNoteModalOpen() {
    this.props.replaceNoteLocal({companyId:this.props.params.id});
    this.refs.notesCreateModal.show();
  }
  onNoteCreateChange (note){
    this.props.updateNoteLocal(note);
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
  onJobCreateChange (job){
    this.props.updateJobLocal(job);
  }
  onJobCreateImageChange(imageArray){
    this.props.updateJobImageLocal(imageArray);
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
  render() {

    let {company, location, contacts, companyJobs, companyNotes } = this.props;

    if (company) {

      let website = company.get('website');
      let twitter = company.get('twitterHandle');
      let facebook = company.get('facebookHandle');
      let heroContact = '/img/rameet.jpg';

      return (
        <div>

          <JobDetailsModal closeModal={this.closeJobModal.bind(this)} jobImage={this.props.jobImage} job={this.props.job} seachCandidates={contacts.list} contacts={contacts} open={this.props.params.jobId}></JobDetailsModal>

          <ClientContactsCreateModal ref="clientContactsCreateModal" companyId={this.props.params.id}/>
          <ClientsEditModal ref="clientEditModal" company={company}/>

          <ContactDetailsModal open={this.state.contactDetailsModalOpen} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
          <NotesCreateModal saveNote={this.props.saveLocalNote} onNoteChange={this.onNoteCreateChange.bind(this)} note={this.props.localNote} ref='notesCreateModal' />
          <JobCreateModal contacts={contacts} saveJob={this.props.saveLocalJob} jobImage={this.props.localJobResource} onImageChange={this.onJobCreateImageChange.bind(this)} onJobChange={this.onJobCreateChange.bind(this)} job={this.props.localJob} ref='jobCreateModal'/>

          <Header iconRight={
            <IconMenu iconButtonElement={
              <IconButton  iconClassName="material-icons">more_vert</IconButton>
            }>
              <MenuItem index={0} onTouchTap={this.editClientModalOpen.bind(this)} primaryText="Edit Client" />
              <MenuItem index={0} onTouchTap={this.createContactModalOpen.bind(this)} primaryText="Add Contact" />
              <MenuItem index={0} onTouchTap={this.createJobModalOpen.bind(this)} primaryText="Add Job" />
              <MenuItem index={0} onTouchTap={this.createNoteModalOpen.bind(this)} primaryText="Add Note" />
            </IconMenu>
          } title={company.get('name')} />

        <CustomTabsSwipe onSwipeEnd={this.onSwipe.bind(this)} startingTab={this.props.tabId} tabs={['Details', 'Jobs', 'Contacts', 'Notes']}>
            <div style={style.slide}>
              <List>
                <div>

                  {(website) ? (
                    <ListItem
                      leftIcon={<FontIcon className="material-icons">public</FontIcon>}
                      primaryText={website}
                      secondaryText={<p>website</p>}
                      secondaryTextLines={1}
                    />
                  ) : (null)}

                  {(twitter) ? (
                    <div>
                      <Divider inset />
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
              <div id="innerView">
                {(company.get('location')) ? (
                    <LocationCard style={{height: '200px'}} location={location} />
                ) : (<p>No location provided.</p>)}
              </div>
              <List subheader="Your HERO talent advocate">
                {(heroContact) ? (
                  <ListItem
                    leftAvatar={<Avatar src={heroContact} />}
                    primaryText={'Rameet Singh'}
                    secondaryText={<p>Hero Talent Advocate</p>}
                    secondaryTextLines={1}
                  />
                ) : (null)}
                </List>

            </div>
            <div style={style.slide}>
              <List subheader={`${companyJobs.count()} Job${((companyJobs.count() > 1) ? ('s') : (''))}`}>
                <CompanyJobsList company={company} onJobClick={this._handleJobClick.bind(this)} jobs={companyJobs}/>
              </List>
            </div>
            <div style={style.slide}>
              <ContactsList contacts={contacts.list} onOpenContactDetails={this.contactDetailsModalOpen.bind(this)}/>
            </div>
            <div style={style.slide}>
              <List subheader={`${companyNotes.count()} Note${((companyNotes.count() > 1) ? ('s') : (''))}`}>
                <CompanyNotesList company={company} editNote={this._handleEditNote.bind(this)} deleteNote={this._handleDeleteNote.bind(this)} notes={companyNotes}/>
              </List>
            </div>
          </CustomTabsSwipe>
        </div>
      );
    } else {
      return (null);
    }
  }
}

export default ClientDetailsPage;
