import React from 'react';
import { Divider, Avatar, Card, CardHeader, CardText, CardActions, FlatButton } from 'material-ui';

class CompanyNotesList extends React.Component {

  editNote(note, e) {
    this.props.editNote(note);
  }

  deleteNote(note, e) {
    this.props.deleteNote(note);
  }

  render() {
    let { notes } = this.props;
    let heroContact = '/img/rameet.jpg';

    return (

      <div>
      {notes.map((note) => {
        return (
          <div>
          <Card initiallyExpanded>
            <CardHeader
              title="Rameet Singh"
              subtitle={(note.get('privacyValue') ? 'Public' : 'Private') + ' | ' + note.get('updated')}
              avatar={<Avatar src={heroContact} />}>
            </CardHeader>
            <CardText expandable>
              {note.get('noteText')}
            </CardText>
            <CardActions expandable>
              <FlatButton label="Edit" onTouchTap={this.editNote.bind(this, note)} />
              <FlatButton label="Delete" onTouchTap={this.deleteNote.bind(this, note)} />
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
  jobs: React.PropTypes.object.isRequired,
  onJobClick: React.PropTypes.func,
};

export default CompanyNotesList;
