import React from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import { getOneNote, getNotesByCompany, getNotesByJob, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote } from '../../../modules/notes/index';
import { NoteCreate } from '../../../components/web';

let getData = (state, props) => {
  let note = null;
  let notableType = null;
  if (props.params.noteId) {
    note = state.notes.localNote;
  }

  if (props.params.jobId) {
    notableType = 'job';
  }
  else if (props.params.companyId) {
    notableType = 'company';
  }

  return {
    note,
    notableType,
    user: state.auth.user
  };
};

@connect(getData, { pushState, getOneNote, getNotesByCompany, getNotesByJob, updateNoteLocal, saveLocalNote, replaceNoteLocal, deleteNote })
export default class NoteCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps){
    if( newProps.note && newProps.note.get('saving') == false
    && this.props.note && this.props.note.get('saving') == true
    && !newProps.note.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.note.get('id'));
      } else {
        let self = this;
        setTimeout(function () {
          if (self.props.notableType == 'job') {
            self.props.history.replaceState(null, `/jobs/${newProps.note.get('notableId')}?tab=3`);
          }
          else if (self.props.notableType == 'company') {
            self.props.history.replaceState(null, `/clients/${newProps.note.get('notableId')}?tab=3`);
          } else if(self.props.params.contactId){
            self.props.history.replaceState({tab:2}, `/contacts/${newProps.note.get('notableId')}?tab=2`);
          } else if(self.props.params.candidateId){
            self.props.history.replaceState({tab:2}, `/candidates/${newProps.note.get('notableId')}?tab=2`);
          }
          else {
            self.props.history.replaceState(null, `/`);
          }
        }, 500);

        //this.props.getNotesByCompany(newProps.note.get('notableId'), newProps.user.id);
      }
    }

    if(newProps.params.noteId != this.props.params.noteId && newProps.params.noteId.indexOf('tmp')<=-1 ){
      this.props.getOneNote(newProps.params.noteId);
    }
  }

  _handleChange(note){
    this.props.updateNoteLocal(note);
  }

  _handleSave(){
    switch(this.props.notableType) {
    case 'company':
      this.props.saveLocalNote(this.props.params.companyId, this.props.notableType);
      break;
    case 'job':
      this.props.saveLocalNote(this.props.params.jobId, this.props.notableType);
      break;
    }
    if( this.props.params.contactId){
      this.props.saveLocalNote(this.props.params.contactId, 'contact');
    } else if( this.props.params.candidateId){
      this.props.saveLocalNote(this.props.params.candidateId, 'contact');
    }
  }

  _handleClose(){
    this.setState({open:false});
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  render(){
    return (
      <NoteCreate
        {...this.props}
        note={this.props.note}
        closeModal={this._handleClose.bind(this)}
        onChange={this._handleChange.bind(this)}
        onSubmit={this._handleSave.bind(this)}
        open={this.state.open}
        inline={false}  />
    );
  }
}

NoteCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
