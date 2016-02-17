import React from 'react';
import { Divider, Card, CardHeader, CardText, CardActions, FlatButton } from 'material-ui';
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
          <Card style={{marginLeft:'8px',marginRight:'8px',marginBottom:'8px'}} initiallyExpanded>
            <CardHeader
              title={contact.get('displayName')}
              subtitle={<div>{(note.get('privacyValue') ? 'Public' : 'Private')} | <TimeAgo live={true} date={note.get('updated')} /></div>}
              avatar={<Gravatar style={style.gravatar} email={contact.get('email')} />}>
            </CardHeader>
            <CardText expandable>
              {note.get('noteText')}

            </CardText>
            <CardActions expandable>
              <FlatButton label="Edit" onTouchTap={self.editNote.bind(self, note)} />
              <FlatButton label="Delete" onTouchTap={self.deleteNote.bind(self, note)} />
            </CardActions>
          </Card>

            <Divider inset />
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
