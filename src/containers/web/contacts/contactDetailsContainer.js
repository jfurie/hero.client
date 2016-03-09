import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';
import { ContactDetails } from '../../../components/web';
import { getContactDetail, createContactFavorite, deleteContactFavorite } from '../../../modules/contacts';
import { replaceNoteLocal, deleteNote } from '../../../modules/notes/index';
import { createJobFavorite, deleteJobFavorite } from '../../../modules/jobs/index';
//const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';
import getContactDataFromState from '../../../dataHelpers/contact';

function getData(state, props) {
  let tab = props.location.query.tab || 'Details';

  return {
    tab,
    contact: getContactDataFromState(state, props.params.contactId),
  };
}

@connect((state, props) => (
getData(state, props)),
{getContactDetail, createContactFavorite, deleteContactFavorite, replaceNoteLocal,pushState, deleteNote, createJobFavorite, deleteJobFavorite})
class ContactDetailsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let self = this;

    setTimeout(() => {
      self.props.getContactDetail(self.props.params.contactId);
    }, 500);
  }

  componentWillReceiveProps() {

  }

  onContactDetailsClose(){
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

    this.props.pushState({}, `/contact/${this.props.params.companyId}/notes/${note.get('id')}/create?returnUrl=`+encodeURIComponent(window.location.pathname + window.location.search));
  }

  _handleDeleteNote(note) {
    this.props.replaceNoteLocal(note);
    this.props.deleteNote(note.get('id'));
    this.props.getContactDetail(this.props.params.contactId);
  }

  favoriteContact() {
    let {contact} = this.props;
    this.props.createContactFavorite(contact.get('id'));
  }

  unfavoriteContact() {
    let {contact} = this.props;
    this.props.deleteContactFavorite(contact.get('id'));
  }

  favoriteJob(job) {
    this.props.createJobFavorite(job.get('id'));
  }

  unfavoriteJob(job) {
    this.props.deleteJobFavorite(job.get('id'));
  }

  render() {

    let {contact} = this.props;
    return (
      <div>
        <ContactDetails
        favoriteContact={this.favoriteContact.bind(this)}
        unfavoriteContact={this.unfavoriteContact.bind(this)}
        favoriteJob={this.favoriteJob.bind(this)}
        unfavoriteJob={this.unfavoriteJob.bind(this)}
        deleteNote={this._handleDeleteNote.bind(this)}
        location={this.props.location}
        onContactDetailsClose={this.onContactDetailsClose.bind(this)}
        open={true}
        tab={this.props.tab}
        contact={contact} />
      </div>
    );
  }
}

export default ContactDetailsPage;
