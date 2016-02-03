import React from 'react';
//import _ from 'lodash';
import Immutable from 'immutable';
import {
  Toolbar, ToolbarTitle, IconButton,
  ToolbarGroup, FlatButton, TextField, DatePicker,
  Card, CardMedia, CardText, LinearProgress, SelectField,
  MenuItem
} from 'material-ui';
//import {geoCode} from '../../../utils/geoCoding';
import {FileInput, TagsInput, Dialog} from '../';
//import GoogleMap from 'google-map-react';
let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const style = {
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
  content: {
    minHeight: `${clientHeight}px`,
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
  title: {
    lineHeight:'64px',
    float:'left',
  },
  save: {
    marginTop:'14px',
    marginRight:'-16px',
    marginLeft:'auto',
  },
  floatLabel: {
    left: '0',
  },
  datePicker: {
    width: '100%',
    marginTop: '30px',
  },
  formContent: {
    height: `${(clientHeight - 64)}px`,
    overflowY: 'scroll',
  },
};

class JobCreateModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      address:null,
    };
    //this._handleLocationChangeDebounce = this._handleLocationChangeDebounce.bind(this);
    //this._handleLocationChangeDebounce = _.debounce(this._handleLocationChangeDebounce,1000);
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  saveJob() {
    this.props.saveJob();
  }

  show() {
    this.setState({
      open: true,
    });
  }

  _handleSubmit(){
    console.log('submit!');
  }

  _handleChange(type, e) {
    let change = {};
    change[type] = e.target.value;
    this.props.onJobChange(change);
  }

  _handleStartDateChange(e,value){
    let change = {};
    change['startDate'] = value;
    this.props.onJobChange(change);
  }

  _datePickerClose() {
    console.log('close!');
  }

  _datePickerOpen() {
    console.log('show!');
  }

  onImageChange(value){
    this.props.onImageChange(value);
  }

  _handleSelectValueChange(event, index, value) {
    let change = {};
    change['contactId'] = value;
    this.props.onJobChange(change);
  }
  _handleHeroValueChange(event, index, value) {
    let change = {};
    change['talentAdvocateId'] = value;
    this.props.onJobChange(change);
  }

  _handleEmploymentTypeValueChange(e, key, payload){
    var change = {};
    change['employmentType'] = payload;
    this.props.onJobChange(change);
  }
  _handleSkillsChange(skills){
    var change = {};
    change['skills'] = skills;
    this.props.onJobChange(change,true);
  }
  // _handleLocationChange(e){
  //   var change = {};
  //   change['location'] = e.target.value;
  //   this.setState({address:e.target.value});
  //   this._handleLocationChangeDebounce(e.target.value);
  // }
  //  _handleLocationChangeDebounce(location){
  //    let self = this;
  //    geoCode(location).then(function(results){
  //      if(results && results.length > 0){
  //        self.setState({location:results[0]});
  //      }
  //    });
  //  }
  toolbar(){
    return (
      <Toolbar style={style.toolBar}>
        <ToolbarGroup key={0} float="left">
          <IconButton onTouchTap={this.closeModal.bind(this)} style={style.close} iconClassName='material-icons'>close</IconButton>
          <ToolbarTitle style={style.title} text={'Create Job'} />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          <FlatButton onTouchTap={this.saveJob.bind(this)} style={style.save}>Save</FlatButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
  render() {
    let { contacts, heroContacts } = this.props;
    //let location = this.state.location?{lat:this.state.location.geometry.location.lat(),lng:this.state.location.geometry.location.lng()}: {lat:34,lng:118};
    //console.log(contacts);
    heroContacts = heroContacts || new Immutable.Map();
    return (
      <Dialog
          open={this.state.open}
          toolbar={this.toolbar()}
      >
        <div style={style.content}>

          <div className="row center-xs" style={style.formContent}>
              <div className="col-xs-10 col-md-6">
                  <div className="box">
                    <form onSubmit={this._handleSubmit.bind(this)}>
                      <div>
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
                              <LinearProgress mode="determinate" value={this.props.job.get('percentUploaded')} />
                              <FileInput label={this.props.jobImage?'Change Photo':'Add Photo'} onFileChanged={this.onImageChange.bind(this)}></FileInput>
                            </CardText>
                          </Card>


                      </div>
                      <div>
                        <TextField
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'title')}
                            floatingLabelText="Job Title"
                            value={this.props.job.get('title')}
                        />
                      </div>
                      <div>
                        <SelectField value={this.props.job.get('employmentType')} floatingLabelText="Employment Type" fullWidth onChange={this._handleEmploymentTypeValueChange.bind(this)}>
                          <MenuItem value={'Permanent'} primaryText="Permanent"/>
                          <MenuItem value={'Contract To Hire'}  primaryText="Contract to Hire"/>
                          <MenuItem value={'Contract'} primaryText="Contract"/>
                        </SelectField>
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Quick Pitch"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'quickPitch')}
                            value={this.props.job.get('quickPitch')}
                        />
                      </div>
                      {/*
                        //TODO: Refactor to a component to search for locations
                        <div>
                        <TextField
                            floatingLabelText="Address"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleLocationChange.bind(this)}
                            value={this.state.address}
                        />
                        <div style={{height: '200px', width: '100%'}}>
                          <GoogleMap
                            center={location}
                            defaultZoom={13}
                             />
                        </div>
                      </div>*/}
                      <div>
                        <TextField
                            pattern="[0-9]*"
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'minSalary')}
                            floatingLabelText="Min Salary"
                            type="number"
                            value={this.props.job.get('minSalary')}
                        />
                      </div>
                      <div>
                        <TextField
                            pattern="[0-9]*"
                            fullWidth
                            errorText={''}
                            onChange={this._handleChange.bind(this, 'maxSalary')}
                            floatingLabelText="Max Salary"
                            type="number"
                            value={this.props.job.get('maxSalary')}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Bonus + Perks"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'bonusPerks')}
                            value={this.props.job.get('bonusPerks')}
                        />
                      </div>
                      <div>
                        <TextField
                            floatingLabelText="Job Description"
                            multiLine
                            fullWidth
                            floatingLabelStyle={style.floatLabel}
                            onChange={this._handleChange.bind(this, 'description')}
                            value={this.props.job.get('description')}
                        />
                      </div>
                      <div>
                        <DatePicker
                            hintText="Estimated Start Date"
                            textFieldStyle={style.datePicker}
                            onShow={this._datePickerOpen}
                            onRequestClose={this._datePickerClose}
                            onChange={this._handleStartDateChange.bind(this)}
                            value={this.props.job.get('startDate')}
                            ref="startDate"
                        />
                      </div>
                      <div>
                        <TextField
                            pattern="[0-9]*"
                            fullWidth
                            errorText={''}
                            floatingLabelText="Fee %"
                            onChange={this._handleChange.bind(this, 'feePercent')}
                            type="number"
                            value={this.props.job.get('feePercent')}
                        />
                      </div>
                      <div>
                        <TagsInput value={this.props.job.get('skills')} onChange={this._handleSkillsChange.bind(this)} title="Skills"></TagsInput>
                      </div>
                      <div>
                        <SelectField
                            ref="selectValue"
                            fullWidth
                            floatingLabelText="Select Primary Contact"
                            value={this.props.job.get('contactId')}
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
                      <div>
                        <SelectField
                            ref="selectValue"
                            fullWidth
                            floatingLabelText="Select Talent Advocate"
                            value={this.props.job.get('talentAdvocateId')}
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
                    </form>
                    <div style={{height:'300px'}}></div>
                  </div>
              </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

JobCreateModal.propTypes = {
  //open: React.PropTypes.bool.isRequired,
};

export default JobCreateModal;
