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
            self.props.history.replaceState(null, `/jobs/${newProps.note.get('notableId')}`);
          }
          else if (self.props.notableType == 'company') {
            self.props.history.replaceState(null, `/clients/${newProps.note.get('notableId')}`);
          }
          else {
            self.props.history.replaceState(null, `/`);
          }
        }, 500);

        if (this.props.notableType == 'job') {
          this.props.getNotesByJob(newProps.note.get('notableId'), newProps.user.id);
        }
        else {
          this.props.getNotesByCompany(newProps.note.get('notableId'), newProps.user.id);
        }

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
