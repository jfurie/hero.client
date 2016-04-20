import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {ClientsCreate} from '../../../components/web';
import { getContactsByCompany } from '../../../modules/contacts';
import { editCompany, createCompany, getMyCompanies, getCompaniesByIds, updateCompanyImage } from '../../../modules/companies';
import Config from '../../../utils/config';

const HEROCOMPANYID = Config.get('heroCompanyId');

let getData = (state, props) => {
  let company = null;
  if(props.params.companyId){
    company = state.companies.get('list').get(props.params.companyId);
  }
  //filter hero contacts
  let heroContactIds = state.contacts.get('byCompanyId').get(HEROCOMPANYID);
  let heroContacts = null;
  if(heroContactIds){
    heroContacts = state.contacts.get('list').filter(x =>{
      return heroContactIds.indexOf(x.get('id')) > -1;
    });
  }

  let companyImage = null;
  let locations = null;
  if(company){
    let imageId = company.get('imageId');
    if (imageId) {
      companyImage = state.resources.list.get(imageId);
    }

    locations = state.locations.list.filter(x => {
      return x.get('locatableType') == 'company' && x.get('locatableId') == company.get('id');
    });
  }

  return {
    companyImage,
    heroContacts,
    company,
    locations,
    id: props.params.companyId,
  };
};

@connect(getData,{getContactsByCompany, editCompany, createCompany, getCompaniesByIds, getMyCompanies, updateCompanyImage})
export default class ClientCreateContainer extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      company : this.props.company || new Immutable.Map({errors:new Immutable.Map()}),
      open: true,
    };
  }

  componentDidMount() {
    this.props.getContactsByCompany(HEROCOMPANYID);
    if(this.props.params.companyId && this.props.params.companyId.indexOf('tmp')<=-1 ){
      this.props.getCompaniesByIds([this.props.params.companyId]);
    }

    this.prepareLocations(this.props.company, this.props.locations);
  }

  componentWillReceiveProps(newProps){
    if( newProps.company && newProps.company.get('saving') == false
    && this.props.company && this.props.company.get('saving') == true
    && !newProps.company.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.company.get('id'));
      } else {
        let self = this;
        setTimeout(function () {
          if(self.props.location.query.returnUrl){
            self.props.history.replaceState(null, self.props.location.query.returnUrl);
          } else{
            let id =newProps.company.get('newId');
            self.props.history.replaceState(null, `/clients/${id}`);
          }
        }, 500);
      }
    }

    if(newProps.params.companyId != this.props.params.companyId && newProps.params.companyId.indexOf('tmp')<=-1 ){
      this.props.getCompaniesByIds([newProps.params.companyId]);
    }

    this.prepareLocations(newProps.company, newProps.locations);
  }

  prepareLocations(companyProp, locationsProp) {
    if (companyProp && locationsProp) {
      let locations;
      let selectedLocation;
      let selectedLocationIndex = 0;
      let primaryLocation;

      locations = this.state.locations || locationsProp.toList() || new Immutable.List();

      if (locations.size == 0) {
        if (companyProp && companyProp.has('location')) {
          primaryLocation = companyProp.get('location');
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
          if (companyProp && companyProp.has('location')) {
            let index = 0;
            locations.forEach(location => {
              if (companyProp.get('location').get('id') == location.get('id')) {
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
        company: companyProp,
        locations,
        selectedLocation,
        selectedLocationIndex: this.state.selectedLocationIndex || selectedLocationIndex,
        deletedLocations: this.state.deletedLocations || new Immutable.List(),
        primaryLocation,
      });
    }
  }

  _handleChange(company){
    this.setState({company});
  }
  _handleSave(company){
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

    company = company.set('locationsPendingSave', locationsPendingSave)
      .set('locationsPendingDelete', locationsPendingDelete)
      .set('pendingPrimaryLocation', this.state.primaryLocation);

    this.setState({company});
    if(company.get('id') && company.get('id').indexOf('tmp') <= -1){
      this.props.editCompany(company);
    } else {
      this.props.createCompany(company);
    }
  }
  _handleClose(){
    this.setState({open:false});
    if(this.props.onClose){
      this.props.onClose();
    } else {
      this.props.history.goBack();
    }

  }

  onCompanyCreateImageChange(imageArray){
    this.props.updateCompanyImage(this.props.params.companyId,imageArray);
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
      <ClientsCreate
          {...this.props}
          closeModal={this._handleClose.bind(this)}
          heroContacts={this.props.heroContacts}
          company={this.state.company}
          locations={this.state.locations}
          selectedLocation={this.state.selectedLocation}
          selectedLocationIndex={this.state.selectedLocationIndex}
          selectLocation={this.selectLocation.bind(this)}
          changeLocation={this.changeLocation.bind(this)}
          addLocation={this.addLocation.bind(this)}
          deleteLocation={this.deleteLocation.bind(this)}
          primaryLocation={this.state.primaryLocation}
          setPrimaryLocation={this.setPrimaryLocation.bind(this)}
          onSubmit={this._handleSave.bind(this)}
          onCompanyChange={this._handleChange.bind(this)}
          onImageChange={this.onCompanyCreateImageChange.bind(this)}
          open
          inline
      />
    );
  }
}

ClientCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose:React.PropTypes.func,
  onSave:React.PropTypes.func,
  open: React.PropTypes.bool,
};
