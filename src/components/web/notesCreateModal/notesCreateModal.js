import React from 'react';
import {
  Toolbar, ToolbarTitle, IconButton,
  ToolbarGroup, FlatButton, SelectField, TextField,
  MenuItem,
} from 'material-ui';
import {Dialog} from '../';
let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    //zIndex: '50',
  },
  bodyStyle: {
    paddingTop: '0px',
    height: '100%',
    padding: '0',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
  },
  content: {
    height: `${clientHeight}px`,
  },
  toolBar: {
    backgroundColor:'#ffffff',
    height:'64px',
  },
  close: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  detailsTitle: {
    lineHeight:'64px',
    float:'left',
  },
  save: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  select: {
    textAlign: 'left',
    color: '#000',
  },
  floatLabel: {
    top: '12px',
    color: 'rgba(0, 0, 0, 0.298039)',
    fontSize: '12px',
    transform: 'none',
  },
};

class NotesCreateModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      privacyValue: 0,
    };
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  saveNote() {
    console.log('save note!');

    this.props.saveNote();
  }

  _handleSubmit(){
    console.log('submit!');
  }

  _handleChange(type, e) {
    let change = {};
    change[type] = e.target.value;
    this.props.onNoteChange(change);
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handlePrivacyValueChange(event, index, value) {
    var change = {};
    change['privacyValue'] = value;
    this.props.onNoteChange(change);
  }
  toolbar(){
    return (
      <Toolbar style={style.toolBar}>
        <ToolbarGroup key={0} float="left">
          <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
          <ToolbarTitle style={style.detailsTitle} text={'Create Note'} />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          <FlatButton onTouchTap={this.saveNote.bind(this)} style={style.save}>Save</FlatButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
  render() {

    return (
      <Dialog
          open={this.state.open}
          toolbar = {this.toolbar()}
      >
        <div style={style.content}>

          <div className="row center-xs">
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <SelectField
                        value={this.props.note.get('privacyValue')}
                        floatingLabelText="Privacy"
                        floatingLabelStyle={style.floatLabel}
                        fullWidth
                        style={style.select}
                        onChange={this._handlePrivacyValueChange.bind(this)}
                        hintText={''}
                    >
                      <MenuItem value={0} primaryText="Only you"/>
                      <MenuItem value={1} primaryText="Within the Organization"/>
                    </SelectField>
                    <TextField
                        hintText="Your note"
                        multiLine
                        fullWidth
                        value={this.props.note.get('noteText')}
                        onChange={this._handleChange.bind(this, 'noteText')}
                    />
                  </div>
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

NotesCreateModal.propTypes = {
  //open: React.PropTypes.bool.isRequired,
};

export default NotesCreateModal;
