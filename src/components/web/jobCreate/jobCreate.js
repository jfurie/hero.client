import React from 'react';
import Immutable from 'immutable';
import {
  IconButton, ToolbarGroup, Toolbar, SelectField, MenuItem,
  FlatButton, TextField, ToolbarTitle, RaisedButton, Divider, Styles,
  Card, CardMedia, CardText, LinearProgress, DatePicker,
} from 'material-ui';
import { FileInput, TagsInput, Dialog } from '../';
import {
 Location,
} from '../';

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

export default class JobCreate extends React.Component {
  constructor(props){
    super(props);
  }

  _handleClose(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let newJob = this.props.job;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    if (value) {
      newJob = newJob.set(field,value);
    } else {
      newJob = newJob.delete(field);
    }

    this.props.onJobChange(newJob);
  }

  _handleLocationChange(field, value) {
    let newJob = this.props.job;

    if (value) {
      newJob = newJob.set(field,value);
    } else {
      newJob = newJob.delete(field);
    }

    this.props.onJobChange(newJob);
  }

  _handleCompanySelectValueChange(event, index, value) {
    this.props.onCompanyChange(value);
  }

  _handleSubmit(){
    if(this.props.job.get('saving') == true) return;

    this.props.onSubmit(this.props.job);
  }

  onImageChange(value){
    this.props.onImageChange(value);
  }

  _handleHeroValueChange(event, index, value) {
    let newJob = this.props.job;

    if (value) {
      newJob = newJob.set('talentAdvocateId',value);
    } else {
      newJob = newJob.delete('talentAdvocateId');
    }

    this.props.onJobChange(newJob);
  }

  _handleSelectValueChange(event, index, value) {
    let newJob = this.props.job;

    if (value) {
      newJob = newJob.set('contactId',value);
    } else {
      newJob = newJob.delete('contactId');
    }

    this.props.onJobChange(newJob);
  }

  _handleSkillsChange(skills){
    let newJob = this.props.job;

    if (skills) {
      newJob = newJob.set('skills',skills);
    } else {
      newJob = newJob.delete('skills');
    }

    this.props.onJobChange(newJob, true);
  }

  _handleStartDateChange(e,value){
    let newJob = this.props.job;

    if (value) {
      newJob = newJob.set('startDate',value);
    } else {
      newJob = newJob.delete('startDate');
    }

    this.props.onJobChange(newJob);
  }

  _handleEmploymentTypeValueChange(e, key, payload){
    let newJob = this.props.job;

    if (payload) {
      newJob = newJob.set('employmentType',payload);
    } else {
      newJob = newJob.delete('employmentType');
    }

    this.props.onJobChange(newJob);
  }

  _datePickerClose() {
    console.log('close!');
  }

  _datePickerOpen() {
    console.log('show!');
  }

  _renderContents() {
    let { job, companies, contacts, heroContacts } = this.props;

    job = job || new Immutable.Map({errors:new Immutable.Map()});

    let isCandidate = job.get('isCandidate');

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
                      <Card>
                        <CardMedia>
                          {(() => {
                            if(this.props.jobImage){
                              return (<div><img style={{maxWidth:'100%', maxHeight:'300px'}} src={this.props.jobImage.get('item')}></img></div>);
                            } else {
                              return (<div></div>);
                            }
                          })()}
                        </CardMedia>
                        <CardText>
                          <LinearProgress mode="determinate" value={job.get('percentUploaded')} />
                          <FileInput label={this.props.jobImage?'Change Photo':'Add Photo'} onFileChanged={this.onImageChange.bind(this)}></FileInput>
                        </CardText>
                      </Card>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        fullWidth
                        errorText={''}
                        onChange={(e) => this._handleChange.bind(this)(e, 'title')}
                        floatingLabelText="Job Title"
                        value={job.get('title')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <SelectField value={job.get('employmentType')} floatingLabelText="Employment Type" fullWidth onChange={this._handleEmploymentTypeValueChange.bind(this)}>
                      <MenuItem value={'Permanent'} primaryText="Permanent"/>
                      <MenuItem value={'Contract To Hire'}  primaryText="Contract to Hire"/>
                      <MenuItem value={'Contract'} primaryText="Contract"/>
                    </SelectField>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        floatingLabelText="Quick Pitch"
                        multiLine
                        fullWidth
                        floatingLabelStyle={style.floatLabel}
                        onChange={(e) => this._handleChange.bind(this, 'quickPitch')}
                        value={job.get('quickPitch')}
                    />
                  </div>

                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Location</div>
                  </div>

                  <div className="col-xs-10" >
                    <Location location={job.get('location')} onChange={this._handleLocationChange.bind(this,'location')} />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        pattern="[0-9]*"
                        fullWidth
                        errorText={''}
                        onChange={(e) => this._handleChange.bind(this, 'minSalary')}
                        floatingLabelText="Min Salary"
                        type="number"
                        value={job.get('minSalary')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        pattern="[0-9]*"
                        fullWidth
                        errorText={''}
                        onChange={(e) => this._handleChange.bind(this)(e, 'maxSalary')}
                        floatingLabelText="Max Salary"
                        type="number"
                        value={job.get('maxSalary')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        floatingLabelText="Bonus + Perks"
                        multiLine
                        fullWidth
                        floatingLabelStyle={style.floatLabel}
                        onChange={(e) => this._handleChange.bind(this)(e, 'bonusPerks')}
                        value={job.get('bonusPerks')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        floatingLabelText="Job Description"
                        multiLine
                        fullWidth
                        floatingLabelStyle={style.floatLabel}
                        onChange={(e) => this._handleChange.bind(this)(e, 'description')}
                        value={job.get('description')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <DatePicker
                        hintText="Estimated Start Date"
                        textFieldStyle={style.datePicker}
                        onShow={this._datePickerOpen}
                        onRequestClose={this._datePickerClose}
                        onChange={this._handleStartDateChange.bind(this)}
                        value={job.get('startDate')}
                        ref="startDate"
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        pattern="[0-9]*"
                        fullWidth
                        errorText={''}
                        floatingLabelText="Fee %"
                        onChange={(e) => this._handleChange.bind(this)(e, 'feePercent')}
                        type="number"
                        value={job.get('feePercent')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TagsInput value={job.get('skills')} onChange={this._handleSkillsChange.bind(this)} title="Skills"></TagsInput>
                  </div>

                  <div className="col-xs-10 ">
                    <SelectField
                        ref="selectValue"
                        fullWidth
                        floatingLabelText="Select Primary Contact"
                        value={job.get('contactId')}
                        onChange={this._handleSelectValueChange.bind(this)}
                    >
                      {contacts.map((contact, index) => {
                        return (
                          <MenuItem
                              value={index}
                              primaryText={contact.get('displayName')}
                          />
                        );
                      })}
                    </SelectField>
                  </div>

                  <div className="col-xs-10 ">
                    <SelectField
                        ref="selectValue"
                        fullWidth
                        floatingLabelText="Select Talent Advocate"
                        value={job.get('talentAdvocateId')}
                        onChange={this._handleHeroValueChange.bind(this)}
                    >
                      {heroContacts.map((contact, index) => {
                        return (
                          <MenuItem
                              value={index}
                              primaryText={contact.get('displayName')}
                          />
                        );
                      })}
                    </SelectField>
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
                  <ToolbarTitle style={style.toolbarTitle} text="Create Job" />
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
