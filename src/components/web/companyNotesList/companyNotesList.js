import React from 'react';
import { IconMenu, IconButton, MenuItem } from 'material-ui';
import { Gravatar } from '../../../components/web';
import TimeAgo from 'react-timeago';
import Immutable from 'immutable';

const style = {
  gravatar: {
    display: 'inline-block'
  }
};

class CompanyNotesList extends React.Component {

  editNote(note) {
    this.props.editNote(note);
  }

  deleteNote(note) {
    this.props.deleteNote(note);
  }

  render() {
    let self = this;

    let { notes } = this.props;
    notes = notes || new Immutable.Map();
  //  let heroContact = '/img/rameet.jpg';

    return (

      <div>
      {notes.map((note) => {
        let contact = note.get('contact') || new Immutable.Map(self.props.defaultContact);

        return (
          <div>
            <div style={{display:'flex', position: 'relative', marginBottom: '15px'}}>
              <div style={{flex:'0 0 56px', marginLeft: '15px'}}>
                <Gravatar style={style.gravatar} email={contact.get('email')}/>
              </div>
              <div style={{flexGrow: 1, borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>
                  <div style={{margin: '5px 0', color:'rgba(0, 0, 0, 0.87)', marginTop: 0, fontSize:'15px', fontWeight:'500'}}>{contact.get('displayName')}</div>
                  <div style={{margin: '5px 0', color:'rgba(0, 0, 0, 0.87)', fontSize:'14px', whiteSpace:'pre'}}>{note.get('noteText')}</div>
                  <div style={{margin: '5px 0', color:'rgba(0, 0, 0, 0.54)', fontSize:'14px'}}><TimeAgo live={true} date={note.get('updated')} /></div>
              </div>
              <div style={{position: 'absolute', right: '10px'}}>
                <IconMenu iconButtonElement={<IconButton  iconClassName="material-icons">more_vert</IconButton>}>
                  <MenuItem index={0} onTouchTap={self.editNote.bind(self, note)} primaryText="Edit" />
                  <MenuItem index={0} onTouchTap={self.deleteNote.bind(self, note)} primaryText="Delete" />
                </IconMenu>
              </div>
            </div>
          </div>
        );
      })}

      </div>
    );
  }
}

CompanyNotesList.propTypes = {
  company: React.PropTypes.object,
  notes: React.PropTypes.object.isRequired,
};

export default CompanyNotesList;
