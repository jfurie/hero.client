import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState, replaceState } from 'redux-router';

import { getOneCompany, getMyCompanies } from '../../../modules/companies/index';
import { getJobsByCompany, updateJob, updateJobImage, saveJob, replaceJob, getOneJob, getMyJobs } from '../../../modules/jobs/index';
import { getContactsByCompany } from '../../../modules/contacts';
import { getAllCategories } from '../../../modules/categories';
import { JobCreate } from '../../../components/web';
import getCompanyDataFromState from '../../../dataHelpers/company';

const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

let getData = (state, props) => {
  let job = state.jobs.list.get(props.params.jobId);
  let categories = state.categories.list;
  let company = null;
  if (props.params.companyId) {
    company = getCompanyDataFromState(state, props.params.companyId);
  }

  let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.list.filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
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
    company,
    categories,
    companies: state.companies.myCompanyIds,
    jobImage,
    heroContacts: heroContacts ? heroContacts : new Immutable.Map(),
    contacts: company ? company.get('contacts') : new Immutable.Map(),
  };
};

@connect(getData, { pushState, getJobsByCompany, updateJob, updateJobImage, saveJob, replaceJob, getOneJob, getOneCompany, getContactsByCompany, getMyJobs, getMyCompanies, getAllCategories })
export default class JobCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
  }

  componentDidMount() {
    this.props.getContactsByCompany(HEROCOMPANYID);
    this.props.getContactsByCompany(this.props.params.companyId);
    this.props.getMyCompanies();
    this.props.getAllCategories();
    if(this.props.params.jobId && this.props.params.jobId.indexOf('tmp')<=-1 ){
      this.props.getOneJob(this.props.params.jobId);
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
            self.props.history.replaceState(null, `/clients/${newProps.job.get('companyId')}/jobs/${newProps.job.get('newId')}`);
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

  _handleCompanyChange(companyId){
    let job = this.props.job.set('companyId', companyId);
    this._handleChange(job);
    let self = this;
    setTimeout(function () {
      self.props.history.replaceState(null, `/clients/${companyId}/jobs/${self.props.params.jobId}/create`);
    }, 500);
  }

  _handleSave(job){
    this.props.saveJob(job);
  }
  _handleCategoryChange(categoryId){
    let job = this.props.job.set('categoryId', categoryId);
    this._handleChange(job);
  }
  _handleSalaryChange(currentCompensationView){
    replaceState({
      ...this.props.location.state,
      currentCompensationView,
    },(location.pathname+location.search));
  }
  _handleLocationChange(locationId){
    let job = this.props.job.set('locationId', locationId);
    this._handleChange(job);
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

  render() {
    
    return (
      <JobCreate
          company={this.props.company}
          job={this.props.job}
          categories={this.props.categories}
          closeModal={this._handleClose.bind(this)}
          onSubmit={this._handleSave.bind(this)}
          onJobChange={this._handleChange.bind(this)}
          onCompanyChange={this._handleCompanyChange.bind(this)}
          onCategoryChange={this._handleCategoryChange.bind(this)}
          open={this.state.open}
          onImageChange={this.onJobCreateImageChange.bind(this)}
          inline
      />
    );
  }
}

JobCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
