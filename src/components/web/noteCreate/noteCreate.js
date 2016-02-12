import React from 'react';
import Immutable from 'immutable';
import {
  IconButton, ToolbarGroup, Toolbar, SelectField, MenuItem, Styles,
  FlatButton, TextField, ToolbarTitle, RaisedButton,
} from 'material-ui';
import { Dialog } from '../';

const style = {
  error: {
    float: 'left',
  },
  divider:{
    marginTop:'16px',
  },
  subheader:{
    color: Styles.Colors.grey600,
    fontSize:'14px',
    marginTop:'16px',
    marginBottom:'16px',
    marginLeft:'16px',
    textAlign:'left',
  },
  textField: {
    'width': '100%',
  },
  dialog: {
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
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
  toolbar: {
    backgroundColor: '#ffffff',
    height: '64px',
  },
  toolbarIcon: {
    marginTop:'8px',
    float:'left',
    marginRight:'8px',
    marginLeft:'-16px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
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

export default class NoteCreate extends React.Component {
  constructor(props){
    super(props);
  }

  _handleClose(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let note = this.props.note;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    note = note.set(field,value);

    this.props.onChange(note);
  }

  _handlePrivacyValueChange(event, index, value) {
    let note = this.props.note;

    if (value) {
      note = note.set('privacyValue',value);
    } else {
      note = note.delete('privacyValue');
    }

    this.props.onChange(note);
  }

  _handleSubmit(){
    if(this.props.note.get('saving') == true) return;

    this.props.onSubmit(this.props.note);
  }

  _renderContents() {
    let { note } = this.props;

    note = note || new Immutable.Map({errors:new Immutable.Map()});

    return (
      <div className="row center-xs">
          <div className="col-xs-12 col-md-8">
              <div className="box">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div className="row center-xs" >
                    <div className="col-xs-10">
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
                    </div>
                    <div className="col-xs-10">
                      <TextField
                          hintText="Your note"
                          multiLine
                          fullWidth
                          value={note.get('noteText') ? note.get('noteText') : ''}
                          onChange={(e) => this._handleChange.bind(this)(e, 'noteText')}
                      />
                    </div>
                    <div className="col-xs-10 " style={{marginTop:'20px', marginBottom:'20px'}}>
                      <RaisedButton primary={true} label='Save' onTouchTap={this._handleSubmit.bind(this)}></RaisedButton>
                    </div>
                  </div>
                </form>
              </div>
          </div>
      </div>
    );
  }
  render(){
    let {note} = this.props;
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight - 64;
    if(this.props.inline){
      return (
      <div>
        {this._renderContents()}
      </div>);
    } else {
      return (
      <div>
          <Dialog
                open={this.props.open}
                autoDetectWindowHeight={false}
                autoScrollBodyContent={false}
                repositionOnUpdate={false}
                defaultOpen={false}
                style={style.dialog}
                bodyStyle={style.bodyStyle}
                contentStyle={style.contentStyle}
            >
            <div style={{minHeight: `${clientHeight}px`, overflowY:'scroll'}}>
              <Toolbar style={style.toolbar}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text={!note.get('id') || note.get('id').indexOf('tmp') > -1 ? 'Create Note' : 'Edit Note'} />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
                </ToolbarGroup>
              </Toolbar>
              <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
                {this._renderContents()}
              </div>
            </div>
          </Dialog>
      </div>);
    }
  }
}
