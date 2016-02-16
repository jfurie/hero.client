import React from 'react';
//import Immutable from 'immutable';
import {
  IconButton, ToolbarGroup, Toolbar,
  FlatButton, ToolbarTitle, Styles,
} from 'material-ui';

import { ClientListItem, JobTemplateListItem, ContactListItem, LocationListItem, RangeSlider, JobOrderSwipeArea } from '../';

const style = {
  error: {
    float: 'left',
  },
  // divider:{
  //   marginTop:'16px',
  // },
  // subheader: {
  //   color: Styles.Colors.grey600,
  //   fontSize:'14px',
  //   marginTop:'16px',
  //   marginBottom:'16px',
  //   marginLeft:'16px',
  //   textAlign:'left',
  // },
  // textField: {
  //   'width': '100%',
  // },
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
    background: Styles.Colors.grey900,
    color: '#FFFF',
    height: '64px',
    position: 'fixed',
    zIndex: '1000',
    width: '100%',
    maxWidth: '100%',
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
  addImageIcon: {
    marginTop: '-7px',
    marginLeft: '0px',
  },
  toolbarFlat: {
    marginTop:'14px',
    marginRight:'-24px',
    marginLeft:'auto',
    color: '#FFFFFF',
  },
  toolbarTitle: {
    lineHeight:'64px',
    float:'left',
    color: '#ffffff',
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
  pictureRow: {
    backgroundColor: Styles.Colors.grey900,
    position: 'relative',
    margin: '0px',
  },
  pictureBox: {
    marginBottom: '-4px',
  },
  orderDefault: {
    width: '100%',
    borderRadius: '4px 4px 0px 0px',
  },
  addImage: {
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-40px',
    marginTop: '-20px',
  },
  addImageLabel: {
    margin: '0px',
  },
};

export default class JobCreate extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      salary: [90000, 120000],
    };
  }

  _handleClose(){
    this.props.closeModal();
  }

  // _handleChange(e, field) {
  //   let newJob = this.props.job;
  //   let value = (e.target.value === '') ? (null) : (e.target.value);
  //
  //   newJob = newJob.set(field,value);
  //
  //   this.props.onJobChange(newJob);
  // }
  //
  // _handleLocationChange(field, value) {
  //   let newJob = this.props.job;
  //
  //   if (value) {
  //     newJob = newJob.set(field,value);
  //   } else {
  //     newJob = newJob.delete(field);
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }

  // _handleCompanySelectValueChange(event, index, value) {
  //   this.props.onCompanyChange(value);
  // }

  _handleSubmit(){
    if(this.props.job.get('saving') == true) return;

    this.props.onSubmit(this.props.job);
  }

  onImageChange(value){
    this.props.onImageChange(value);
  }

  // _handleHeroValueChange(event, index, value) {
  //   let newJob = this.props.job;
  //
  //   if (value) {
  //     newJob = newJob.set('talentAdvocateId',value);
  //   } else {
  //     newJob = newJob.delete('talentAdvocateId');
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }
  //
  // _handleSelectValueChange(event, index, value) {
  //   let newJob = this.props.job;
  //
  //   if (value) {
  //     newJob = newJob.set('contactId',value);
  //   } else {
  //     newJob = newJob.delete('contactId');
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }
  //
  // _handleSkillsChange(skills){
  //   let newJob = this.props.job;
  //
  //   if (skills) {
  //     newJob = newJob.set('skills',skills);
  //   } else {
  //     newJob = newJob.delete('skills');
  //   }
  //
  //   this.props.onJobChange(newJob, true);
  // }

  // _handleStartDateChange(e,value){
  //   let newJob = this.props.job;
  //
  //   if (value) {
  //     newJob = newJob.set('startDate',value);
  //   } else {
  //     newJob = newJob.delete('startDate');
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }
  //
  // _handleEmploymentTypeValueChange(e, key, payload){
  //   let newJob = this.props.job;
  //
  //   if (payload) {
  //     newJob = newJob.set('employmentType',payload);
  //   } else {
  //     newJob = newJob.delete('employmentType');
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }

  // _handleDepartmentValueChange(e, key, payload){
  //   let newJob = this.props.job;
  //
  //   if (payload) {
  //     newJob = newJob.set('department', payload);
  //   } else {
  //     newJob = newJob.delete('department');
  //   }
  //
  //   this.props.onJobChange(newJob);
  // }
  //
  // _datePickerClose() {
  //   console.log('close!');
  // }
  //
  // _datePickerOpen() {
  //   console.log('show!');
  // }

  _renderContents() {
    // let { job, companies, contacts, heroContacts } = this.props;
    //
    // job = job || new Immutable.Map({errors:new Immutable.Map()});
    //
    // let isCandidate = job.get('isCandidate');
    //
    // if (isCandidate === undefined) {
    //   isCandidate = false;
    // }
    //
    // let companyId = this.props.company ? this.props.company.get('id') : null;

    let clients = [
      <p>client 1</p>,
      <p>client 2</p>,
    ];

    let salary = [
      <div style={{padding: '20px'}}>
        <RangeSlider
            min={0}
            max={180000}
            step={1000}
            value={this.state.salary}
            format="money"
        />
      </div>,
    ];

    //console.log(clients.length);

    return (
      <div>
        <div className="row center-xs" style={style.pictureRow}>
          <div className="col-xs-10">
            <div className="box" style={style.pictureBox}>
              <img style={style.orderDefault} src="/img/job-order-default.jpg" />
              <div style={style.addImage}>
                <p style={style.addImageLabel}>Add Image</p>
                <IconButton style={style.addImageIcon} iconClassName="material-icons">camera_alt</IconButton>
              </div>
            </div>
          </div>
        </div>
        <div>
          <JobOrderSwipeArea title={'Client'} items={clients} />
          <JobOrderSwipeArea title={'Job Description'} items={[]} />
          <JobOrderSwipeArea title={'Hourly - Salary'} items={salary} />
          <JobOrderSwipeArea title={'Hiring Manager'} items={[]} />
          <JobOrderSwipeArea title={'Location'} items={[]} />
        </div>
      </div>
    );
  }

  render() {

    //let {job} = this.props;


    //if (this.props.inline){
    return (
      <div>
        <Toolbar style={style.toolbarInline}>
          <ToolbarGroup key={0} float="left">
            <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconStyle={{'color': '#ffffff'}} iconClassName="material-icons">close</IconButton>
            <ToolbarTitle style={style.toolbarTitle} text={'Job Order'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton onTouchTap={this._handleSubmit.bind(this)} style={style.toolbarFlat}>Save</FlatButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={{height:'64px'}}></div>
        <div>
          {this._renderContents()}
        </div>
      </div>
    );
    /*} /*else {
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
                  <IconButton onTouchTap={this._handleClose.bind(this)} style={style.toolbarIcon} iconStyle={{'color': '#ffffff'}} iconClassName='material-icons'>close</IconButton>
                  <ToolbarTitle style={style.toolbarTitle} text={'Create Job'} />
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
    } */
  }
}
