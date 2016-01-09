import React from 'react';
import { Divider, Avatar, Card, CardHeader, CardText, CardActions, FlatButton } from 'material-ui';
import { Gravatar } from '../../../components/web';
import TimeAgo from 'react-timeago';

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
    let heroContact = '/img/rameet.jpg';

    return (

      <div>
      {notes.map((note) => {
        return (
          <div>
          <Card initiallyExpanded>
            <CardHeader
              title="Rameet Singh"
              subtitle={<div>{(note.get('privacyValue') ? 'Public' : 'Private')} | <TimeAgo live={true} date={note.get('updated')} /></div>}
              avatar={<Gravatar style={style.gravatar} email='thiensly@gmail.com' />}>
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
  jobs: React.PropTypes.object.isRequired,
  onJobClick: React.PropTypes.func,
};

export default CompanyNotesList;