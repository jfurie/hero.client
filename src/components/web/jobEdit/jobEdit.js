import React from 'react';
import Immutable from 'immutable';
import {
  IconButton, ToolbarGroup, Toolbar, SelectField, MenuItem, Toggle,
  FlatButton, TextField, ToolbarTitle, RaisedButton, Divider, Styles,
  Card, CardMedia, CardText, LinearProgress, DatePicker,
} from 'material-ui';
import { FileInput, Dialog } from '../';
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
  toolbarInline:{
    backgroundColor: '#ffffff',
    height: '64px',
    position:'fixed',
    zIndex:'1000',
  },
  contentStyle: {
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    maxHeight: '100%',
    paddingTop: '0px',
    top: '-64px',
    backgroundColor: '#ffffff',
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
    left:'0',
  },
  datePicker:{
    width:'100%',
    marginTop:'16px',
  }
};

export default class JobEdit extends React.Component {
  constructor(props){
    super(props);
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      windowWidth:clientWidth,
    };
  }

  handleResize(){
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.setState({'windowWidth':clientWidth});
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  _handleClose(){
    this.props.closeModal();
  }

  _handleChange(e, field) {
    let newJob = this.props.job;
    let value = (e.target.value === '') ? (null) : (e.target.value);

    newJob = newJob.set(field,value);

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
      newJob = newJob.set('jobType',payload);
    } else {
      newJob = newJob.delete('jobType');
    }

    this.props.onJobChange(newJob);
  }

  _handleDepartmentValueChange(e, key, payload){
    let newJob = this.props.job;

    if (payload) {
      newJob = newJob.set('department', payload);
    } else {
      newJob = newJob.delete('department');
    }

    this.props.onJobChange(newJob);
  }

  _handlePublicToggle(e, value){
    let newJob = this.props.job;

    newJob = newJob.set('public', value);

    this.props.onJobChange(newJob);
  }

  _datePickerClose() {
    console.log('close!');
  }

  _datePickerOpen() {
    console.log('show!');
  }

  _renderContents() {
    let { job, contacts, heroContacts } = this.props;

    job = job || new Immutable.Map({errors:new Immutable.Map()});

    let isCandidate = job.get('isCandidate');

    if (isCandidate === undefined) isCandidate = false;

    return (
      <div style={{backgroundColor:'#ffffff', margin:'0'}} className="row center-xs">
          <div className="col-xs-12">
              <div className="box">
                <form onSubmit={this._handleSubmit.bind(this)}>
                  <div className="row center-xs" >

                  <div className="col-xs-12">
                    <Divider style={style.divider} />
                    <div style={style.subheader}>Primary</div>
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
                          <FileInput label={this.props.jobImage?'Change Photo':'Add Photo'} onFileChanged={this.onImageChange.bind(this)} />
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
                    <SelectField value={job.get('department')} floatingLabelText="Department" fullWidth onChange={this._handleDepartmentValueChange.bind(this)}>
                      <MenuItem value={'Tech'} primaryText="Tech"/>
                      <MenuItem value={'Sales'}  primaryText="Sales"/>
                      <MenuItem value={'Product'} primaryText="Product"/>
                      <MenuItem value={'Executive'} primaryText="Executive"/>
                      <MenuItem value={'Marketing'} primaryText="Marketing"/>
                      <MenuItem value={'Operations'} primaryText="Operations"/>
                      <MenuItem value={'Customer Service'} primaryText="Customer Service"/>
                      <MenuItem value={'Office Mgmt'} primaryText="Office Mgmt"/>
                    </SelectField>
                  </div>

                  <div className="col-xs-10 ">
                    <SelectField value={job.get('jobType')} floatingLabelText="Employment Type" fullWidth onChange={this._handleEmploymentTypeValueChange.bind(this)}>
                      <MenuItem value={'Permanent'} primaryText="Permanent"/>
                      <MenuItem value={'Contract To Hire'}  primaryText="Contract to Hire"/>
                      <MenuItem value={'Contract'} primaryText="Contract"/>
                    </SelectField>
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        pattern="[0-9]*"
                        fullWidth
                        errorText={''}
                        onChange={(e) => this._handleChange.bind(this)(e, 'positionCount')}
                        floatingLabelText="Number of Positions"
                        type="number"
                        value={job.get('positionCount')}
                    />
                  </div>

                  <div className="col-xs-10 ">
                    <TextField
                        floatingLabelText="Quick Pitch"
                        multiLine
                        fullWidth
                        floatingLabelStyle={style.floatLabel}
                        onChange={(e) => this._handleChange.bind(this)(e, 'quickPitch')}
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
                        onChange={(e) => this._handleChange.bind(this)(e, 'minSalary')}
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
                        onChange={(e) => this._handleChange.bind(this)(e, 'fee')}
                        type="number"
                        value={job.get('fee')}
                    />
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

                  <div className="col-xs-10 ">
                    <Toggle
                        label="Make Public"
                        onToggle={this._handlePublicToggle.bind(this)}
                        toggled={job.get('public')}
                    />
                  </div>

                  <div className="col-xs-10 " style={{marginTop:'20px', marginBottom:'20px'}}>
                    <RaisedButton primary label="Save" onTouchTap={this._handleSubmit.bind(this)} />
                  </div>
                  </div>
                </form>
              </div>
          </div>
      </div>
    );
  }

  render() {
    //let {job} = this.props;
    if(this.state.windowWidth > 768){
      style.toolbarInline.width ='375px';
    } else {
      style.toolbarInline.width = '100%';
    }
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let contentHeight = clientHeight - 64;
    if(this.props.inline){
      return (
      <div>
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text={'Edit Job'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>
        <div>
          {this._renderContents()}
        </div>
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
                  <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconClassName="material-icons">close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text={'Edit Job'} />
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
