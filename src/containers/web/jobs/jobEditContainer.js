import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';

import { getOneCompany, getMyCompanies, getCompaniesByIds } from '../../../modules/companies/index';
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
  let company = null;
  let locations = null;
  if(job){
    let imageId = job.get('imageId');
    if (imageId) {
      jobImage = state.resources.list.get(imageId);
    }
    company = state.companies.get('list').get(job.get('companyId'));

    if (company) {
      locations = state.locations.list.filter(x => {
        return x.get('locatableType') == 'company' && x.get('locatableId') == company.get('id');
      });
    }
  }

  return {
    job,
    jobImage,
    company,
    locations,
    heroContacts: heroContacts ? heroContacts : new Immutable.Map(),
    contacts: contacts ? contacts : new Immutable.Map(),
  };
};

@connect(getData, { pushState, getJobsByCompany, getCompaniesByIds, updateJob, updateJobImage, saveJob, replaceJob, getJobDetail, getOneCompany, getContactsByCompany, getMyJobs, getMyCompanies })
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
      this.props.getCompaniesByIds([this.props.params.companyId]);
    }

    this.prepareLocations(this.props.job, this.props.locations);
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

    this.prepareLocations(newProps.job, newProps.locations);
  }

  prepareLocations(jobProp, locationsProp) {
    if (jobProp && locationsProp) {
      let locations;
      let selectedLocation;
      let selectedLocationIndex = 0;
      let primaryLocation;

      locations = this.state.locations || locationsProp.toList() || new Immutable.List();

      if (locations.size == 0) {
        if (jobProp && jobProp.has('location')) {
          primaryLocation = jobProp.get('location');
        }
        else {
          primaryLocation = new Immutable.Map({name:'Office'});
        }

        selectedLocation = primaryLocation;

        locations = locations.push(selectedLocation);
      }
      else {
        if (this.state.primaryLocation) {
          primaryLocation = this.state.primaryLocation;
        }
        else {
          if (jobProp && jobProp.has('location')) {
            let index = 0;
            locations.forEach(location => {
              if (jobProp.get('location').get('id') == location.get('id')) {
                primaryLocation = location;
                selectedLocationIndex = index;
              }
              index++;
            });
          }
        }

        if (!primaryLocation) {
          primaryLocation = locations.first();
        }

        if (this.state.selectedLocation) {
          selectedLocation = this.state.selectedLocation;
        }
        else {
          selectedLocation = primaryLocation;
        }
      }

      this.setState({
        job: jobProp,
        locations,
        selectedLocation,
        selectedLocationIndex: this.state.selectedLocationIndex || selectedLocationIndex,
        deletedLocations: this.state.deletedLocations || new Immutable.List(),
        primaryLocation,
      });
    }
  }

  _handleChange(job, dontMergeDeep){
    this.props.updateJob(job, dontMergeDeep);
  }

  _handleSave(job){
    let locationsPendingSave = this.state.locations.filter(location => {
      return (
        location.has('id') ||
        location.has('addressLine') ||
        location.has('city') ||
        location.has('countrySubDivisionCode') ||
        location.has('postalCode') ||
        location.has('countryCode')
      );
    });

    let locationsPendingDelete = this.state.deletedLocations.filter(location => {
      return location.has('id');
    });

    job = job.set('locationsPendingSave', locationsPendingSave)
      .set('locationsPendingDelete', locationsPendingDelete)
      .set('pendingPrimaryLocation', this.state.primaryLocation);

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

  selectLocation(e, index, value) {
    this.setState({
      selectedLocation: value,
      primaryLocation: value,
      selectedLocationIndex: index,
    });
  }

  changeLocation(location) {
    let locations = this.state.locations.set(this.state.selectedLocationIndex, location);
    let selectedLocation = locations.get(this.state.selectedLocationIndex);
    this.setState({
      locations,
      selectedLocation,
      primaryLocation: selectedLocation,
    });
  }

  addLocation() {
    let selectedLocation = new Immutable.Map({name:'Office'});
    let locations = this.state.locations.push(selectedLocation);

    this.setState({
      locations,
      selectedLocation,
      primaryLocation: selectedLocation,
      selectedLocationIndex: locations.size - 1,
    });
  }

  deleteLocation() {
    let deletedLocations = this.state.deletedLocations.push(this.state.selectedLocation);

    let selectedLocation;
    let locations = this.state.locations.delete(this.state.selectedLocationIndex);

    if (locations.size == 0) {
      selectedLocation = new Immutable.Map({name:'Office'});
      locations = locations.push(selectedLocation);
    }
    else {
      selectedLocation = locations.first();
    }

    this.setState({
      locations,
      selectedLocation,
      primaryLocation: selectedLocation,
      selectedLocationIndex: 0,
      deletedLocations,
    });
  }

  setPrimaryLocation(e, val) {
    this.setState({
      primaryLocation: val ? this.state.selectedLocation : null,
    });
  }

  render(){
    return (
      <JobEdit
        {...this.props}
        job={this.props.job}
        locations={this.state.locations}
        selectedLocation={this.state.selectedLocation}
        selectedLocationIndex={this.state.selectedLocationIndex}
        selectLocation={this.selectLocation.bind(this)}
        changeLocation={this.changeLocation.bind(this)}
        addLocation={this.addLocation.bind(this)}
        deleteLocation={this.deleteLocation.bind(this)}
        primaryLocation={this.state.primaryLocation}
        setPrimaryLocation={this.setPrimaryLocation.bind(this)}
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
