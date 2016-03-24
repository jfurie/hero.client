import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';
import { JobDetails } from '../../../components/web';
import { getJobDetail, toggleTag } from '../../../modules/jobs';
import { getAllJobCandidates, deleteCandidate, editApplicantState } from '../../../modules/candidates';
import { editContact } from '../../../modules/contacts';
import { createContactFavorite, deleteContactFavorite ,createJobFavorite, deleteJobFavorite} from '../../../modules/favorites';
import { getImageByJobId } from '../../../modules/resources';
import { getNotesByJob, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote } from '../../../modules/notes/index';

import getJobDataFromState from '../../../dataHelpers/job';

function getData(state, props, jobId) {
  let tab = props.location.query.tab || 'Details';

  return {
    tab,
    job: getJobDataFromState(state, jobId),
    notes: state.notes,
    localNote: state.notes.localNote,
  };
}

@connect((state, props) => (getData(state, props, props.params.jobId)), {pushState, getJobDetail, toggleTag, createJobFavorite, deleteJobFavorite, getAllJobCandidates, getImageByJobId, getNotesByJob, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote, createContactFavorite, deleteContactFavorite, editContact, editApplicantState, deleteCandidate})
class JobDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let self = this;
    setTimeout(() => {
      self.props.getJobDetail(self.props.params.jobId);
      self.props.getImageByJobId(self.props.params.jobId);
    }, 500);
  }

  componentWillReceiveProps() {

  }

  onJobDetailsClose(){
    if(this.props.onClose){
      this.props.onClose();
    } else{
      this.props.history.goBack();
    }
  }

  addNoteModalOpen(note){
    if (!note) {
      note = new Immutable.Map({
        id: 'tmp_' + this._guid(),
        privacyValue: 0,
      });
    }

    this.props.replaceNoteLocal(note);

    this.props.pushState({}, `/clients/${this.props.job.get('companyId')}/jobs/${this.props.job.get('id')}/notes/${note.get('id')}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
  }

  createNoteModalOpen() {
    this.props.replaceNoteLocal({});
    this.refs.notesCreateModal.show();
  }
  onNoteCreateChange (note){
    this.props.updateNoteLocal(note);
  }
  _handleSaveNote() {
    this.props.saveLocalNote(this.props.job.get('id'), 'job');
  }
  _handleEditNote(note) {
    this.props.replaceNoteLocal(note);
    this.refs.notesCreateModal.show();
  }
  _handleDeleteNote(note) {
    this.props.replaceNoteLocal(note);
    this.props.deleteNote(note.get('id'));
  }

  favoriteJob() {
    let {job} = this.props;
    this.props.createJobFavorite(job.get('id'));
  }
  unfavoriteJob() {
    let {job} = this.props;
    this.props.deleteJobFavorite(job.get('id'));
  }

  favoriteContact(contact) {
    this.props.createContactFavorite(contact.get('id'));
  }

  unfavoriteContact(contact) {
    this.props.deleteContactFavorite(contact.get('id'));
  }

  editApplicantState(candidateId, state) {
    this.props.editApplicantState(candidateId, state);
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

    let { job } = this.props;

    return (
      <div>
        <JobDetails
        {...this.props}
        tab={this.props.tab}
        favoriteJob={this.favoriteJob.bind(this)}
        unfavoriteJob={this.unfavoriteJob.bind(this)}
        favoriteContact={this.favoriteContact.bind(this)}
        unfavoriteContact={this.unfavoriteContact.bind(this)}
        deleteNote={this._handleDeleteNote.bind(this)}
        addNoteModalOpen={this.addNoteModalOpen.bind(this)}
        onJobDetailsClose={this.onJobDetailsClose.bind(this)}
        editContact={this.props.editContact.bind(this)}
        deleteCandidate={this.props.deleteCandidate.bind(this)}
        editApplicantState={this.props.editApplicantState.bind(this)}
        toggleTag={this.props.toggleTag.bind(this)}
        open
        job={job} />
      </div>
    );
  }
}

export default JobDetailsPage;
