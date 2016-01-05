import React from 'react';
import { Dialog, Toolbar, ToolbarTitle, IconButton, ToolbarGroup, FlatButton, SelectField, TextField } from 'material-ui';

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
      privacyValue: 0
    };
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  saveNote() {
    console.log('save note!');
    this.setState({
      open: false,
    });
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handleSelectValueChange(e) {
    //e.target.value;
    this.setState({
      privacyValue: e.target.value,
    });
  }

  render() {

    let privacyItems = [
       { id: 0, name: 'Only you' },
       { id: 1, name: 'Within the Organization' },
    ];

    return (
      <Dialog
          open={this.state.open}
          autoDetectWindowHeight={false}
          autoScrollBodyContent={false}
          repositionOnUpdate={false}
          defaultOpen={false}
          style={style.dialog}
          bodyStyle={style.bodyStyle}
          contentStyle={style.contentStyle}
          ref="contactDetailsDialog"
      >
        <div style={style.content}>
          <Toolbar style={style.toolBar}>
            <ToolbarGroup key={0} float="left">
              <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
              <ToolbarTitle style={style.detailsTitle} text={'Create Note'} />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FlatButton onTouchTap={this.saveNote.bind(this)} style={style.save}>Save</FlatButton>
            </ToolbarGroup>
          </Toolbar>
          <div className="row center-xs">
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <SelectField
                        selectedIndex={this.state.privacyValue}
                        floatingLabelText="Privacy"
                        floatingLabelStyle={style.floatLabel}
                        menuItems={privacyItems}
                        fullWidth
                        style={style.select}
                        valueMember="id"
                        displayMember="name"
                        onChange={this._handleSelectValueChange.bind(this)}
                        hintText={''}
                    />
                    <TextField
                        hintText="Your note"
                        multiLine
                        fullWidth
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
