import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';

import { ClientDetails } from '../../../components/web';

import { getOneCompany, getCompanyDetail } from '../../../modules/companies/index';
import { getOneLocation } from '../../../modules/locations';
import { getImageByJobId } from '../../../modules/resources';
import { getJobsByCompany, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob } from '../../../modules/jobs/index';
import { getNotesByCompany, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote } from '../../../modules/notes/index';
import { getAllContacts, getContactsByCompany } from '../../../modules/contacts';
import { getAllJobCandidates, createCandidate } from '../../../modules/candidates';

import { invite } from '../../../modules/users';
import getCompanyDataFromState from '../../../dataHelpers/company';

const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

function getData(state, props) {

  let companyId = props.params.companyId;
  // let jobId = props.params.jobId;
  let tab = props.tabId;
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
    //job: getJobDataFromState(state, jobId),
    notes: state.notes,
    localNote: state.notes.localNote,
    localJob: state.jobs.localJob,
    localJobResource,
    heroContacts,
    defaultContact: state.auth.contact,
  };
}


@connect((state, props) => (
getData(state, props)),
{getOneCompany, getCompanyDetail, getOneLocation, getAllContacts, getContactsByCompany, getJobsByCompany, pushState, updateJobLocal, updateJobImageLocal, saveLocalJob, replaceJobLocal, getOneJob, getImageByJobId, getAllJobCandidates, getNotesByCompany, updateNoteLocal, deleteNote, saveLocalNote, replaceNoteLocal, invite, createCandidate })
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
      if(self.props.params.companyId){
        self.props.getCompanyDetail(self.props.params.companyId);
      }


      // if (self.props.params.jobId) {
      //   self.props.getOneJob(self.props.params.jobId);
      //   self.props.getImageByJobId(self.props.params.jobId);
      //   self.props.getAllJobCandidates(self.props.params.jobId);
      // }
      self.props.getContactsByCompany(HEROCOMPANYID);
      //self.props.getContactsByCompany('568f0ea89faa7b2c74c18080');
    }, 500);
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.localJob.get('success')) {
      this.refs.jobCreateModal.closeModal();
      this.props.replaceJobLocal({companyId:this.props.params.companyId});
    }

    // if (nextProps.params.jobId && nextProps.params.jobId != this.props.params.jobId) {
    //   this.props.getOneJob(nextProps.params.jobId);
    //   this.props.getImageByJobId(nextProps.params.jobId);
    //   this.props.getAllJobCandidates(nextProps.params.jobId);
    // }

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
    this.props.pushState({}, `/clients/${this.props.params.companyId}/jobs/${job.get('id')}`);
  }

  closeJobModal() {
    this.props.pushState('', `/clients/${this.props.params.companyId}/jobs`);
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
    this.props.saveLocalNote(this.props.params.companyId, 'company');
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
    this.props.replaceJobLocal({companyId:this.props.params.companyId});
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
  onClientDetailsClose(){
    if(this.props.onClose){
      this.props.onClose();
    } else{
      this.props.history.goBack();
    }
  }
  editClientModalOpen(){
    this.props.pushState({}, `/clients/${this.props.params.companyId}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
  }
  addContactModalOpen(){
    this.props.pushState({}, `/clients/${this.props.params.companyId}/contacts/search?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
  }
  addJobModalOpen(){
    this.props.pushState({}, `/clients/${this.props.params.companyId}/jobs/search?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
  }
  addNoteModalOpen(note){
    if (!note) {
      note = new Immutable.Map({
        id: 'tmp_' + this._guid(),
        privacyValue: 0,
      });
    }

    this.props.replaceNoteLocal(note);

    this.props.pushState({}, `/clients/${this.props.params.companyId}/notes/${note.get('id')}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
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
  render() {

    let {company} = this.props;


      //let website = company.get('website');
    //  let heroContact = '/img/rameet.jpg';
    return (
      <div>
      {/*
        <JobDetailsModal closeModal={this.closeJobModal.bind(this)} job={this.props.job} company={company} open={(this.props.params.jobId)?(true):(false)} createCandidate={this.createCandidate.bind(this)} />

       <ClientContactsCreateModal ref="clientContactsCreateModal" companyId={this.props.params.id}/>
       <ClientsEditModal ref="clientEditModal" company={company}/>

       <ContactDetailsModal open={this.state.contactDetailsModalOpen} onInvite={this._inviteHandler.bind(this)} closeModal={this.contactDetailsModalClose.bind(this)} contact={this.state.detailsContact}/>
       <NotesCreateModal saveNote={this._handleSaveNote.bind(this)} onNoteChange={this.onNoteCreateChange.bind(this)} note={this.props.localNote} ref='notesCreateModal' />
       <JobCreateModal heroContacts={heroContacts} contacts={company.get('contacts')} saveJob={this.props.saveLocalJob} jobImage={this.props.localJobResource} onImageChange={this.onJobCreateImageChange.bind(this)} onJobChange={this.onJobCreateChange.bind(this)} job={this.props.localJob} ref='jobCreateModal'/>
        */}

        <ClientDetails deleteNote={this._handleDeleteNote.bind(this)} addNoteModalOpen={this.addNoteModalOpen.bind(this)} addJobModalOpen={this.addJobModalOpen.bind(this)} addContactModalOpen={this.addContactModalOpen.bind(this)} editClientModalOpen={this.editClientModalOpen.bind(this)} onClientDetailsClose={this.onClientDetailsClose.bind(this)} open={true} tabId={0} company={company} inline={true} ></ClientDetails>

      </div>
    );
  }
}

export default ClientDetailsPage;
