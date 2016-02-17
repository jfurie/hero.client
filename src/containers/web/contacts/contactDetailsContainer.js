import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import Immutable from 'immutable';
import { ContactDetails } from '../../../components/web';
import { getContactDetail } from '../../../modules/contacts';
import { replaceNoteLocal } from '../../../modules/notes/index';
//const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

function getData(state, props) {
  return {
    contact: state.contacts.list.get(props.params.contactId) || null,
  };
}

@connect((state, props) => (
getData(state, props)),
{getContactDetail, replaceNoteLocal,pushState})
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

  render() {

    let {contact} = this.props;
    return (
      <div>
        <ContactDetails location={this.props.location} onContactDetailsClose={this.onContactDetailsClose.bind(this)} open={true} contact={contact} />
      </div>
    );
  }
}

export default ContactDetailsPage;
