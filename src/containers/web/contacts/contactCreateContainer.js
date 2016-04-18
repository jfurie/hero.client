import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';

import { createCandidate } from '../../../modules/candidates';
import { createContact, getContactDetail, getContactsByCompany, editContact, updateCoverImage, updateAvatarImage } from '../../../modules/contacts';
import {createCompanyContact} from '../../../modules/companyContacts';
import { ContactCreate } from '../../../components/web';
import { getMyCompanies } from '../../../modules/companies/index';
import { getAllCategories } from '../../../modules/categories';

let getData = (state, props) => {
  let contact = null;
  let company = null;
  let categories = state.categories.list;

  if (props.params.contactId) {
    contact = state.contacts.get('list').get(props.params.contactId);
  }

  if (props.params.companyId) {
    company = state.companies.get('list').get(props.params.companyId);
  } else {
    let companies = contact && contact.get('companies');
    if(companies && companies.size >0){
      company =companies.first();
    }
  }
  let coverImage = null;
  if(contact){
    let coverImageId = contact.get('coverImageId');
    if (coverImageId) {
      coverImage = state.resources.list.get(coverImageId);
    }
  }
  let avatarImage = null;
  if(contact){
    let avatarImageId = contact.get('avatarImageId');
    if (avatarImageId) {
      avatarImage = state.resources.list.get(avatarImageId);
    }
  }

  return {
    contact,
    coverImage,
    avatarImage,
    company,
    companies: state.companies.get('myCompanyIds'),
    candidates: state.candidates,
    categories,
  };
};

@connect(getData, { pushState, getMyCompanies, createContact, createCandidate, createCompanyContact, getContactDetail, getContactsByCompany, editContact, getAllCategories, updateCoverImage, updateAvatarImage })
export default class ContactCreateContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contact : this.props.contact || new Immutable.Map({errors:new Immutable.Map()}),
      open: true,
    };
  }

  componentDidMount() {
    this.props.getMyCompanies();

    if (this.props.params.contactId.indexOf('tmp') == -1) {
      this.props.getContactDetail(this.props.params.contactId);
    }

    this.props.getAllCategories();
    this.setState({
      currentCompanyId:this.props.params.companyId
    });
  }

  componentWillReceiveProps(newProps){
    this.setState({contact: newProps.contact});
    if(newProps.company && !this.props.company){
      this.setState({currentCompanyId: newProps.company.get('id')});
    } else if(newProps.company && this.props.company && newProps.company.get('id') !== this.props.company.get('id')){
      this.setState({currentCompanyId: newProps.company.get('id')});
    }
    let self = this;
    if( newProps.contact && newProps.contact.get('saving') == false
    && this.props.contact && this.props.contact.get('saving') == true
    && !newProps.contact.get('savingError')){
      if(this.props.onSave){
        this.props.onSave(newProps.contact.get('newId'));
      } else {
        setTimeout(function () {
          if(self.props.location.query.returnUrl){
            self.props.history.replaceState(null, self.props.location.query.returnUrl);
          } else {
            self.props.history.replaceState(null, `/contacts/${newProps.contact.get('newId')}`);
          }
        }, 500);
      }
    }

    //Check for success or error saving candidate
    if(self.props.params.jobId){
      if(newProps.candidates && newProps.candidates.saving == false && this.props.candidates.saving == true){
        //a Save was attempted
        if(newProps.candidates.savingError){
          //Show Snackbar
          setTimeout(function(){
            self.props.resetError();
          },4000);
        } else {
          //Redirect to Job
          self.props.history.replaceState(null,`/jobs/${self.props.params.jobId}?tab=Applicants`);
        }
      }
    }

    if(newProps.params.contactId != this.props.params.contactId && newProps.params.contactId.indexOf('tmp')<=-1 ){
      this.props.getOneContact(newProps.params.contactId);
    }
  }

  _handleChange(contact){
    this.setState({
      contact,
    });
  }

  _handleCompanyChange(companyId){
    this.setState({
      currentCompanyId:companyId,
    });
    //this.props.history.replaceState(null, `/clients/${companyId}/contacts/${this.state.contact.get('id')}/create`);
  }

  _handleSave(contact){
    contact.set('displayName', `${this.state.contact.get('firstName')} ${this.state.contact.get('lastName')}`);

    this.setState({
      contact,
    });
    if(contact.get('id') && contact.get('id').indexOf('tmp') <= -1){
      this.props.editContact(contact);
      if(this.state.currentCompanyId){
        this.props.createCompanyContact(this.state.currentCompanyId,null,contact.get('id'));
      }
    } else {
      //let companyId = this.props.company ? this.props.company.get('id') : null;
      if (this.props.params.jobId) {

        //This is a candidate creation
        contact.set('sourceInfo', {
          referrer: 'hero.client',
        });

        this.props.createCandidate(contact, this.props.params.jobId);
      } else if (this.state.currentCompanyId) {
        this.props.createCompanyContact(this.state.currentCompanyId, contact);
      }
      else {
        this.props.createContact(contact);
      }
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
  updateCoverImage(imageArray){
    this.props.updateCoverImage(this.props.params.contactId,imageArray);
  }

  updateAvatarImage(imageArray){
    this.props.updateAvatarImage(this.props.params.contactId,imageArray);
  }

  render(){
    return (
      <ContactCreate
          {...this.props}
          contact={this.state.contact}
          closeModal={this._handleClose.bind(this)}
          onSubmit={this._handleSave.bind(this)}
          currentCompanyId={this.state.currentCompanyId}
          onContactChange={this._handleChange.bind(this)}
          updateCoverImage={this.updateCoverImage.bind(this)}
          updateAvatarImage={this.updateAvatarImage.bind(this)}
          onCompanyChange={this._handleCompanyChange.bind(this)}
          categories={this.props.categories}
          open={this.state.open}
          inline={false}
      />
    );
  }
}

ContactCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
