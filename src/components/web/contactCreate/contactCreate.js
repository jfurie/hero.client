import React from 'react';
import Immutable from 'immutable';
import {
  LinearProgress, Card, CardText, CardMedia,
   IconButton, ToolbarGroup, Toolbar, Toggle, SelectField, MenuItem,
  FlatButton, TextField, ToolbarTitle, RaisedButton, Divider, Styles, Snackbar, Checkbox,
} from 'material-ui';
import { Location, TagsInput, FileInput } from '../';

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
  subheader2:{
    color: Styles.Colors.grey600,
    fontSize:'14px',
    marginTop:'16px',
    marginBottom:'16px',
    textAlign:'left',
  },
  label:{
    color: Styles.Colors.grey600,
    fontSize:'16px',
    marginTop:'16px',
    marginBottom:'16px',
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
  checkblock: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  }
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

  _handleTagsChange(tags){
    let newContact = this.props.contact;

    if (tags) {
      newContact = newContact.set('tags',tags);
    } else {
      newContact = newContact.delete('tags');
    }

    this.props.onContactChange(newContact, true);
  }

  _handleCompanySelectValueChange(event, index, value) {
    this.props.onCompanyChange(value);
  }

  _handleCategorySelectValueChange(event, index, value) {
    let newContact = this.props.contact;
    if (value) {
      newContact = newContact.merge({
        'candidateType': value.get('title'),
        'categoryId': value.get('id'),
      });
    }
    this.props.onContactChange(newContact);
  }

  _handleStatusSelectValueChange(event, index, value) {
    let newContact = this.props.contact;

    if (value) {
      newContact = newContact.set('status',value);
    }
    this.props.onContactChange(newContact);
  }
  _handleWorkAuthorizationSelectValueChange(event, index, value){
    let newContact = this.props.contact;

    if (value) {
      newContact = newContact.set('workAuthorization',value);
    }
    this.props.onContactChange(newContact);
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

  _handleDayOfTheWeek(day, e, value){
    let newContact = this.props.contact.setIn(['availabilityDetails','daysOfTheWeek',day],value);
    this.props.onContactChange(newContact);
  }
  _handleTimeOfDay(time, e, value){
    var contact = this.props.contact;
    if(!contact.getIn(['availabilityDetails','timeOfDay'])){
      contact = contact.setIn(['availabilityDetails','timeOfDay'],Immutable.fromJS({}));
    }
    let newContact = contact.setIn(['availabilityDetails','timeOfDay',time],value);
    this.props.onContactChange(newContact);
  }

  getCategoryFromTitle(title) {

    let category = null;

    this.props.categories.forEach(function(c) {
      if (c.get('title') === title) {
        category = c;
      }
    });

    return category;
  }

  _renderContents() {
    let { contact, companies, currentCompanyId } = this.props;

    companies = companies.sort(function(a, b){
      if(a.get('name') < b.get('name')) return -1;
      if(a.get('name') > b.get('name')) return 1;
      return 0;
    });
    contact = contact || new Immutable.Map({errors:new Immutable.Map()});

    let isCandidate = contact.get('isCandidate');

    if (isCandidate === undefined) isCandidate = false;

    let companyId = this.props.company ? this.props.company.get('id') : null;
    let tags = contact.get('tags');
    if(tags){
      if(tags.toArray){
        tags = tags.toArray();
      }
    } else {
      tags = [];
    }
    let statuses = ['New','Active','Prospect','Took a Job','Placed','Blacklisted'];
    let workAuthorizations = ['US Citizen','Green Card','EAD','H1-B Visa','O1','OPT','CPT','TN-Visa','F1 Visa','F2 Visa','Requires New Sponsorship' ];
    // <select id="00N6100000CHqyf">
    // <option value="">--None--</option>
    // <option value="US Citizen">US Citizen</option>
    // <option value="Green Card">Green Card</option>
    // <option value="EAD">EAD</option>
    // <option value="H1-B Visa">H1-B Visa</option>
    // <option value="C2C Only">C2C Only</option>
    // <option value="1099 Contract Only">1099 Contract Only</option>
    // <option value="W2 Contract Only">W2 Contract Only</option>
    // <option value="OPT">OPT</option>
    // <option value="CPT">CPT</option>
    // <option value="TN-Visa">TN-Visa</option>
    // <option value="F1 Visa">F1 Visa</option>
    // <option value="F2 Visa">F2 Visa</option>
    // <option value="Requires New Sponsorship">Requires New Sponsorship</option>
    // <option value="C2C Only - through an employer">C2C Only - through an employer</option>
    // </select>
    return (
      <div className="row center-xs">
          <div className="col-xs-12">
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
                        disabled={companyId != null}
                        style={style.select}
                        onChange={this._handleCompanySelectValueChange.bind(this)}
                        hintText={''}
                        value={currentCompanyId}
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
                  <div className='col-xs-10'>
                      <Card>
                        <div style={style.subheader}>Cover Image</div>
                        <CardMedia>
                          {(() => {
                            if(this.props.coverImage){
                              return (<div><img style={{maxWidth:'100%', maxHeight:'300px'}} src={this.props.coverImage.get('item')}></img></div>);
                            } else {
                              return (<div></div>);
                            }
                          })()}
                        </CardMedia>
                        <CardText>
                          <LinearProgress mode="determinate" value={contact.get('percentUploaded')} />
                          <FileInput label={this.props.coverImage?'Change Photo':'Add Photo'} onFileChanged={this.props.updateCoverImage.bind(this)} />
                        </CardText>
                      </Card>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').firstName) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'firstName')}
                        value={contact.get('firstName')}
                        floatingLabelText="First Name"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').lastName || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'lastName')}
                        value={contact.get('lastName')}
                        floatingLabelText="Last Name"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').title || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'title')}
                        value={contact.get('title')}
                        floatingLabelText="Title"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').email || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'email')}
                        value={contact.get('email')}
                        floatingLabelText="Email"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').phone) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'phone')}
                        value={contact.get('phone')}
                        floatingLabelText="Phone Number"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <SelectField
                        floatingLabelText="Status"
                        floatingLabelStyle={style.floatLabel}
                        fullWidth
                        style={style.select}
                        onChange={this._handleStatusSelectValueChange.bind(this)}
                        hintText={''}
                        value={contact.get('status')}
                    >
                      {statuses.map((status) => {
                        return (
                          <MenuItem
                              value={status}
                              primaryText={status}
                          />
                        );
                      })}
                    </SelectField>
                  </div>
                  <div className="col-xs-10 ">
                    <TagsInput value={tags} onChange={this._handleTagsChange.bind(this)} title="Tags" />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').website) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website')}
                        value={contact.get('website')}
                        floatingLabelText="Website"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').website2) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website2')}
                        value={contact.get('website2')}
                        floatingLabelText="Website 2"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={(contact.get('errors') && contact.get('errors').website3) || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'website3')}
                        value={contact.get('website3')}
                        floatingLabelText="Website 3"
                        floatingLabelStyle={{left:'0px'}}
                    />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Location</div>
                  </div>
                  <div className="col-xs-10" >
                    <Location location={contact.get('location')} onChange={this._handleLocationChange.bind(this,'location')} />
                  </div>
                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Social</div>
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').linkedinHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'linkedinHandle')}
                        value={contact.get('linkedinHandle')}
                        floatingLabelText="LinkedIn Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').indeedUrl || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'indeedUrl')}
                        value={contact.get('indeedUrl')}
                        floatingLabelText="Indeed URL (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').githubHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'githubHandle')}
                        value={contact.get('githubHandle')}
                        floatingLabelText="GitHub Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').stackoverflowUrl || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'stackoverflowUrl')}
                        value={contact.get('stackoverflowUrl')}
                        floatingLabelText="Stack Overflow URL (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').facebookHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'facebookHandle')}
                        value={contact.get('facebookHandle')}
                        floatingLabelText="Facebook Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').twitterHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'twitterHandle')}
                        value={contact.get('twitterHandle')}
                        floatingLabelText="Twitter Handle (optional)"
                    />
                  </div>
                  <div className="col-xs-10 ">
                    <TextField
                        style={style.textField}
                        errorText={contact.get('errors') && contact.get('errors').googleHandle || ''}
                        errorStyle={style.error}
                        onChange={(e) => this._handleChange.bind(this)(e, 'googleHandle')}
                        value={contact.get('googleHandle')}
                        floatingLabelText="Google Plus Handle (optional)"
                    />
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
                          <SelectField
                              floatingLabelText="Work Authorization"
                              floatingLabelStyle={style.floatLabel}
                              fullWidth
                              style={style.select}
                              onChange={this._handleWorkAuthorizationSelectValueChange.bind(this)}
                              hintText={''}
                              value={contact.get('workAuthorization')}
                          >
                            {workAuthorizations.map((workAuthorization) => {
                              return (
                                <MenuItem
                                    value={workAuthorization}
                                    primaryText={workAuthorization}
                                />
                              );
                            })}
                          </SelectField>
                        </div>
                        <div>
                          <TextField
                              multiLine
                              rows={3}
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').summary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'summary')}
                              value={contact.get('summary')}
                              floatingLabelText="Summary"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              multiLine
                              rows={3}
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').pitch) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'pitch')}
                              value={contact.get('pitch')}
                              floatingLabelText="Pitch"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').currentSalary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'currentSalary')}
                              value={contact.get('currentSalary')}
                              floatingLabelText="Current Salary"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').currentHourly) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'currentHourly')}
                              value={contact.get('currentHourly')}
                              floatingLabelText="Current Hourly"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').desiredSalary) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'desiredSalary')}
                              value={contact.get('desiredSalary')}
                              floatingLabelText="Desired Salary"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').desiredHourly) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'desiredHourly')}
                              value={contact.get('desiredHourly')}
                              floatingLabelText="Desired Hourly"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').bonusNotes) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'bonusNotes')}
                              value={contact.get('bonusNotes')}
                              floatingLabelText="Bonus Notes"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div style={style.label}>Interview Availability</div>
                        <div className="row">

                          <div style={{textAlign:'left'}} className="col-xs-6">
                           <div style={style.subheader2}>Days of the week</div>
                            <Checkbox
                              label="Monday"
                              style={style.checkbox}
                              onCheck={this._handleDayOfTheWeek.bind(this,'Monday')}
                              checked ={this.props.contact.getIn(['availabilityDetails','daysOfTheWeek','Monday'])}
                            />
                            <Checkbox
                              label="Tuesday"
                              style={style.checkbox}
                              onCheck={this._handleDayOfTheWeek.bind(this,'Tuesday')}
                              checked ={this.props.contact.getIn(['availabilityDetails','daysOfTheWeek','Tuesday'])}
                            />
                            <Checkbox
                              label="Wednesday"
                              style={style.checkbox}
                              onCheck={this._handleDayOfTheWeek.bind(this,'Wednesday')}
                              checked ={this.props.contact.getIn(['availabilityDetails','daysOfTheWeek','Wednesday'])}
                            />
                            <Checkbox
                              label="Thursday"
                              style={style.checkbox}
                              onCheck={this._handleDayOfTheWeek.bind(this,'Thursday')}
                              checked ={this.props.contact.getIn(['availabilityDetails','daysOfTheWeek','Thursday'])}
                            />
                            <Checkbox
                              label="Friday"
                              style={style.checkbox}
                              onCheck={this._handleDayOfTheWeek.bind(this,'Friday')}
                              checked ={this.props.contact.getIn(['availabilityDetails','daysOfTheWeek','Friday'])}
                            />
                          </div>
                          <div style={{textAlign:'left'}} className="col-xs-6">
                            <div style={style.subheader2}>Time of day</div>
                            <Checkbox
                              label="Morning"
                              style={style.checkbox}
                              onCheck={this._handleTimeOfDay.bind(this,'Morning')}
                              checked ={this.props.contact.getIn(['availabilityDetails','timeOfDay','Morning'])}
                            />
                            <Checkbox
                              label="Lunchtime"
                              style={style.checkbox}
                              onCheck={this._handleTimeOfDay.bind(this,'Lunchtime')}
                              checked ={this.props.contact.getIn(['availabilityDetails','timeOfDay','Lunchtime'])}
                            />
                            <Checkbox
                              label="Evening"
                              style={style.checkbox}
                              onCheck={this._handleTimeOfDay.bind(this,'Evening')}
                              checked ={this.props.contact.getIn(['availabilityDetails','timeOfDay','Evening'])}
                            />
                          </div>

                        </div>
                        <div>
                          <TextField
                              multiLine
                              rows={3}
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').availability) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'availability')}
                              value={contact.get('availability')}
                              floatingLabelText="Availability Notes"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').rfl) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'rfl')}
                              value={contact.get('rfl')}
                              floatingLabelText="Reason for Leaving"
                              floatingLabelStyle={{left:'0px'}}
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').startDate) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'startDate')}
                              value={contact.get('startDate')}
                              floatingLabelStyle={{left:'0px'}}
                              floatingLabelText="Start Date"
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').targetLocations) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'targetLocations')}
                              value={contact.get('targetLocations')}
                              floatingLabelStyle={{left:'0px'}}
                              floatingLabelText="Target Locations"
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').jobsAppliedFor) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'jobsAppliedFor')}
                              value={contact.get('jobsAppliedFor')}
                              floatingLabelStyle={{left:'0px'}}
                              floatingLabelText="Jobs Applied For"
                          />
                        </div>
                        <div>
                          <TextField
                              multiLine
                              rows={3}
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').xfactors) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'xfactors')}
                              value={contact.get('xfactors')}
                              floatingLabelStyle={{left:'0px'}}
                              floatingLabelText="xfactors"
                          />
                        </div>
                        <div>
                          <TextField
                              style={style.textField}
                              errorText={(contact.get('errors') && contact.get('errors').contactable) || ''}
                              errorStyle={style.error}
                              onChange={(e) => this._handleChange.bind(this)(e, 'contactable')}
                              value={contact.get('contactable')}
                              floatingLabelStyle={{left:'0px'}}
                              floatingLabelText="Contactable"
                          />
                        </div>
                      </div>
                      : <div></div>
                  }

                  <div className="col-xs-10 " style={{marginTop:'20px', marginBottom:'20px'}}>
                    <RaisedButton primary label="Save" onTouchTap={this._handleSubmit.bind(this)} />
                  </div>
                  </div>
                </form>
              </div>
          </div>
          <Snackbar
              open={(this.props.candidates && this.props.candidates.errorMessage)?true:false}
              message={this.props.candidates && this.props.candidates.errorMessage}
              autoHideDuration={4000}
          />
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
      let title = null;
      if(this.props.contact && this.props.contact.get('id') && this.props.contact.get('id').indexOf('tmp_') > -1){
        title = 'Create Contact';
      } else {
        title = 'Edit Contact';
      }
      return (
      <div>
            <div style={{}}>
              <Toolbar style={style.toolbar}>
                <ToolbarGroup key={0} float="left">
                  <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text={title} />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
                </ToolbarGroup>
              </Toolbar>
              <div style={{height: `${contentHeight}px`, overflowY:'scroll', WebkitOverflowScrolling:'touch'}}>
                {this._renderContents()}
              </div>
            </div>
      </div>);
    }
  }
}
