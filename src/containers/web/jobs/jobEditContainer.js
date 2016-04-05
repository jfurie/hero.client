import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';

import { getOneCompany, getMyCompanies } from '../../../modules/companies/index';
import { getJobsByCompany, updateJob, updateJobImage, saveJob, replaceJob, getJobDetail, getMyJobs } from '../../../modules/jobs/index';
import { getContactsByCompany } from '../../../modules/contacts';
import { JobEdit } from '../../../components/web';
import Config from '../../../utils/config';

const HEROCOMPANYID = Config.get('heroCompanyId');

let getData = (state, props) => {
  let job = state.jobs.get('list').get(props.params.jobId);

  let heroContactIds = state.contacts.get('byCompanyId').get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.get('list').filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  let contactIds = state.contacts.get('byCompanyId').get(props.params.companyId);
  let contacts = null;
  if(contactIds){
    contacts = state.contacts.get('list').filter(x =>{
      return contactIds.indexOf(x.get('id')) > -1;
    });
  }

  let jobImage = null;
  if(job){
    let imageId = job.get('imageId');
    if (imageId) {
      jobImage = state.resources.list.get(imageId);
    }
  }

  return {
    job,
    jobImage,
    heroContacts: heroContacts ? heroContacts : new Immutable.Map(),
    contacts: contacts ? contacts : new Immutable.Map(),
  };
};

@connect(getData, { pushState, getJobsByCompany, updateJob, updateJobImage, saveJob, replaceJob, getJobDetail, getOneCompany, getContactsByCompany, getMyJobs, getMyCompanies })
export default class JobEditContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {
    this.props.getContactsByCompany(HEROCOMPANYID);
    this.props.getContactsByCompany(this.props.params.companyId);
    if(this.props.params.jobId && this.props.params.jobId.indexOf('tmp')<=-1 ){
      this.props.getJobDetail(this.props.params.jobId);
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.params.companyId && newProps.params.companyId != this.props.params.companyId ){
      this.props.getContactsByCompany(newProps.params.companyId);
    }
    if( newProps.job && newProps.job.get('saving') == false
    && this.props.job && this.props.job.get('saving') == true
    && !newProps.job.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.job.get('newId'));
      } else {
        let self = this;
        //let id = newProps.job.get('id');
        setTimeout(function () {
          if(self.props.location.query.returnUrl){
            self.props.history.replaceState(null, self.props.location.query.returnUrl);
          } else{
            // self.props.history.replaceState(null, `/jobs/${id}`);
            self.props.history.goBack();
            //self.props.history.replaceState(null, `/clients/${newProps.job.get('companyId')}/jobs/${newProps.job.get('newId')}`);
          }
        }, 500);

        this.props.getMyJobs();
      }
    }

    if(newProps.params.jobId != this.props.params.jobId && newProps.params.jobId.indexOf('tmp')<=-1 ){
      this.props.getOneJob(newProps.params.jobId);
    }
  }

  _handleChange(job, dontMergeDeep){
    this.props.updateJob(job, dontMergeDeep);
  }

  _handleSave(job){
    this.props.saveJob(job);
  }

  _handleClose(){
    this.setState({open:false});
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }
  }

  onJobCreateImageChange(imageArray){
    this.props.updateJobImage(this.props.params.jobId,imageArray);
  }

  onJobCreateChange (job, dontMergeDeep){
    this.props.updateJobLocal(job, dontMergeDeep);
  }

  render(){
    return (
      <JobEdit
        {...this.props}
        job={this.props.job}
        closeModal={this._handleClose.bind(this)}
        onSubmit={this._handleSave.bind(this)}
        onJobChange={this._handleChange.bind(this)}
        open={this.state.open}
        onImageChange={this.onJobCreateImageChange.bind(this)}
        inline={true}  />
    );
  }
}

JobEditContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
