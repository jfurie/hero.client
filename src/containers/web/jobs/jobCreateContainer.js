import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState /*, replaceState */ } from 'redux-router';
//import { Snackbar } from 'material-ui';
import { getMyCompanies, getCompanyDetail } from '../../../modules/companies/index';
import { getJobsByCompany, updateJob, updateJobImage, saveJob, replaceJob, getOneJob, getMyJobs, createTempJob } from '../../../modules/jobs/index';
import { getContactsByCompany } from '../../../modules/contacts';
import { getAllCategories } from '../../../modules/categories';
import { JobCreate } from '../../../components/web';
import getCompanyDataFromState from '../../../dataHelpers/company';

const HEROCOMPANYID = '568f0ea89faa7b2c74c18080';

let getData = (state, props) => {
  let job = state.jobs.list.get(props.params.jobId);
  let categories = state.categories.list;
  let company = null;

  if (props.params.companyId || (job && job.get('companyId'))) {
    let companyId = props.params.companyId || job.get('companyId');
    company = getCompanyDataFromState(state, companyId);
  }

  // let heroContactIds = state.contacts.byCompanyId.get(HEROCOMPANYID);
  // let heroContacts = null;
  // if(heroContactIds){
  //   heroContacts = state.contacts.list.filter(x =>{
  //     return heroContactIds.indexOf(x.get('id')) > -1;
  //   });
  // }

  let jobImage = null;
  if (job) {
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
    //heroContacts: heroContacts ? heroContacts : new Immutable.Map(),
    //contacts: company ? company.get('contacts') : new Immutable.Map(),
  };
};

@connect(getData, { pushState, getJobsByCompany, updateJob, updateJobImage, saveJob, getCompanyDetail, replaceJob, getOneJob, getContactsByCompany, getMyJobs, getAllCategories, getMyCompanies, createTempJob })
export default class JobCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
      error: false,
      // companyId: null,
    };
  }

  componentDidMount() {
    this.props.getContactsByCompany(HEROCOMPANYID);

    if (this.props.params.companyId) {
      this.props.getContactsByCompany(this.props.params.companyId);
      this.props.getCompanyDetail(this.props.params.companyId);
    }

    this.props.getMyCompanies();
    this.props.getAllCategories();

    // if (this.props.params.jobId && this.props.params.jobId.indexOf('tmp')<=-1 ){
    //   this.props.getOneJob(this.props.params.jobId);
    // }

    //console.log(this.props.job);

    if (!this.props.job && this.props.params.jobId.indexOf('tmp') !== -1) {
      this.props.createTempJob({
        id: this.props.params.jobId,
      });
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.params.companyId && newProps.params.companyId != this.props.params.companyId ){
      this.props.getContactsByCompany(newProps.params.companyId);
      this.props.getCompanyDetail(newProps.params.companyId);
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

    //console.log('componentWillReceiveProps', newProps.job);
  }

  _handleErrorClose() {
    this.setState({
      error: false,
    });
  }

  _handleChange(job, dontMergeDeep){

    dontMergeDeep = dontMergeDeep || true;

    this.props.updateJob(job, dontMergeDeep);
  }

  _handleCompanyChange(companyId){

    let job = this.props.job.set('companyId', companyId);

    if (this.props.company && this.props.company.get('feeAgreement')) {
      job = job.set('fee', this.props.company.get('feeAgreement'));
    }

    this._handleChange(job);

    if (companyId) {
      //this.props.getContactsByCompany(companyId);
      this.props.getCompanyDetail(companyId);
    }

    // let self = this;
    // setTimeout(function () {
    //   if (companyId) {
    //     self.props.history.replaceState(null, `/clients/${companyId}/jobs/${self.props.params.jobId}/create`);
    //   }
    // }, 500);
  }

  _handleSave(job) {

    let categoryId = job.get('categoryId');
    let minSalary = job.get('minSalary');
    let maxSalary = job.get('maxSalary');
    let companyId = job.get('companyId');

    if (categoryId && minSalary && maxSalary && companyId) {
      this.props.saveJob(job, this.props.categories.get(job.get('categoryId')));
    } else {
      console.log('can\'t save', categoryId, minSalary, maxSalary, companyId);
    }
  }

  _handleCategoryChange(categoryId){
    let job = this.props.job.set('categoryId', categoryId);
    this._handleChange(job);
  }

  _handleSalaryChange(money){

    if ((money.isSalary || money.isHourly) && money.value) {

      let data = Immutable.Map({
        minSalary: money.value[0],
        maxSalary: money.value[1],
        isHourly: money.isHourly,
        jobType: (money.isHourly) ? ('Contract') : ('Permanent'),
      });

      let job = this.props.job.merge(data);
      this._handleChange(job);
    }
  }

  _handleLocationChange(locationId) {
    let job = this.props.job.set('locationId', locationId);
    this._handleChange(job);
  }

  _handleContactChange(contactId) {
    let job = this.props.job.set('contactId', contactId);
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

    let { company } = this.props;
    let locations = [];
    let contacts = [];
    //let clients = [];

    if (company) {
      if (company.get('location')) {
        locations.push(company.get('location'));
      }

      contacts = company.get('contacts');
      //clients = [company];
    }

    let { job } = this.props;

    console.log(this.props.company);

    return (
      <JobCreate
          company={this.props.company}
          contacts={contacts}
          clients={this.props.companies}
          job={job}
          categories={this.props.categories}
          locations={locations}
          jobImage={this.props.jobImage}
          closeModal={this._handleClose.bind(this)}
          onSubmit={this._handleSave.bind(this)}
          onJobChange={this._handleChange.bind(this)}
          onCompanyChange={this._handleCompanyChange.bind(this)}
          onCategoryChange={this._handleCategoryChange.bind(this)}
          onSalaryChange={this._handleSalaryChange.bind(this)}
          onLocationChange={this._handleLocationChange.bind(this)}
          onContactChange={this._handleContactChange.bind(this)}
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
