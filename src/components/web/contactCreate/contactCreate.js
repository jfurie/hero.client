import React from 'react';
import Immutable from 'immutable';
import {
  Dialog, IconButton, ToolbarGroup, Toolbar, Toggle, SelectField, MenuItem,
  FlatButton, TextField, ToolbarTitle, RaisedButton, Divider, Styles
} from 'material-ui';
import {
 Location,
} from '../';
import validateContact from '../../../validators/contact';

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

export default class ContactCreate extends React.Component {
  constructor(props){
    super(props);
  }

  _handleClose(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let newContact = this.props.contact;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newContact = newContact.set(field,value);
    } else {
      newContact = newContact.delete(field);
    }

    this.props.onContactChange(newContact);
  }

  _handleIsCandidateToggle(e, field) {
    let newContact = this.props.contact;

    let isCandidate = newContact.get('isCandidate');

    if (isCandidate === undefined) isCandidate = false;

    newContact = newContact.set(field, !isCandidate);

    this.props.onContactChange(newContact);
  }

  _handleLocationChange(field, value) {
    let newContact = this.props.contact;

    if (value) {
      newContact = newContact.set(field,value);
    } else {
      newContact = newContact.delete(field);
    }

    this.props.onContactChange(newContact);
  }

  _handleCompanySelectValueChange(event, index, value) {
    this.props.onCompanyChange(value);
  }

  _handleSubmit(){
    if(this.props.contact.get('saving') == true) return;

    let errors = validateContact(this.props.contact.toJSON());

    let newContact = this.props.contact.set('errors',errors);
    if (errors.validationErrors === 0) {
      this.props.onSubmit(newContact);
    } else {
      this.props.onContactChange(newContact);
    }
  }

  _renderContents() {
    let { contact, companies } = this.props;

    contact = contact || new Immutable.Map({errors:new Immutable.Map()});

    let isCandidate = contact.get('isCandidate');

    if (isCandidate === undefined) isCandidate = false;

    let companyId = this.props.company ? this.props.company.get('id') : null;

    return (
      <div className="row center-xs">
          <div className="col-xs-12 col-md-8">
              <div className="box">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div className="row center-xs" >

                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Primary</div>
                  </div>

                  <div className="col-xs-10 ">
                    <Toggle
                      style={style.toggle}
                      label="Flag as Job Seeker"
                      defaultToggled={isCandidate}
                      onToggle={(e) => this._handleIsCandidateToggle.bind(this)(e, 'isCandidate')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <SelectField
                        floatingLabelText="Company"
                        floatingLabelStyle={style.floatLabel}
                        fullWidth
                        style={style.select}
                        onChange={this._handleCompanySelectValueChange.bind(this)}
                        hintText={''}
                        value={companyId}
                    >
                      {companies.map((company, index) => {
                        return (
                          <MenuItem
                              value={index}
                              primaryText={company.get('name')}
                          />
                        );
                      })}
                    </SelectField>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').firstName) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'firstName')}
                        value={contact.get('firstName')}
                        floatingLabelText="First Name" />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').lastName || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'lastName')}
                        value={contact.get('lastName')}
                        floatingLabelText="Last Name" />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').email || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                        value={contact.get('email')}
                        floatingLabelText="Email" />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').phone) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                        value={contact.get('phone')}
                        floatingLabelText="Phone Number" />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').website) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                        value={contact.get('website')}
                        floatingLabelText="Website" />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Location</div>
                  </div>
                  <div className="col-xs-10" >
                    <Location location={contact.get('location')} onChange={this._handleLocationChange.bind(this,'location')} />
                  </div>
                  {
                    contact.get('isCandidate') ?
                    <div className="col-xs-12">
                      <Divider style={style.divider} />
                      <div style={style.subheader}>Job Seeker Info</div>
                    </div>
                    : <div></div>
                  }
                  {
                    contact.get('isCandidate') ?
                      <div className="col-xs-10">
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').workAuthorization) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'workAuthorization')}
                              value={contact.get('workAuthorization')}
                              floatingLabelText="Work Authorization" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').summary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'summary')}
                              value={contact.get('summary')}
                              floatingLabelText="Summary" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').pitch) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'pitch')}
                              value={contact.get('pitch')}
                              floatingLabelText="Pitch" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').currentSalary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'currentSalary')}
                              value={contact.get('currentSalary')}
                              floatingLabelText="Current Salary" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').currentHourly) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'currentHourly')}
                              value={contact.get('currentHourly')}
                              floatingLabelText="Current Hourly" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').desiredSalary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'desiredSalary')}
                              value={contact.get('desiredSalary')}
                              floatingLabelText="Desired Salary" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').desiredHourly) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'desiredHourly')}
                              value={contact.get('desiredHourly')}
                              floatingLabelText="Desired Hourly" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').bonusNotes) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'bonusNotes')}
                              value={contact.get('bonusNotes')}
                              floatingLabelText="Bonus Notes" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').availability) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'availability')}
                              value={contact.get('availability')}
                              floatingLabelText="Availability" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').rfl) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'rfl')}
                              value={contact.get('rfl')}
                              floatingLabelText="rfl" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').candidateType) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'candidateType')}
                              value={contact.get('candidateType')}
                              floatingLabelText="Candidate Type" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').startDate) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'startDate')}
                              value={contact.get('startDate')}
                              floatingLabelText="Start Date" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').targetLocations) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'targetLocations')}
                              value={contact.get('targetLocations')}
                              floatingLabelText="Target Locations" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').jobsAppliedFor) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'jobsAppliedFor')}
                              value={contact.get('jobsAppliedFor')}
                              floatingLabelText="Jobs Applied For" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').xfactors) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'xfactors')}
                              value={contact.get('xfactors')}
                              floatingLabelText="xfactors" />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').contactable) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'contactable')}
                              value={contact.get('contactable')}
                              floatingLabelText="Contactable" />
                        </div>
                      </div>
                      : <div></div>
                  }

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
                  <ToolbarTitle style={style.toolbarTitle} text="Create Contact" />
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