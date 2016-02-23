import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { pushState } from 'redux-router';

import { createContact, getOneContact, getContactsByCompany, editContact } from '../../../modules/contacts';
import {createCompanyContact} from '../../../modules/companyContacts';
import { ContactCreate } from '../../../components/web';
import { getMyCompanies } from '../../../modules/companies/index';

let getData = (state, props) => {
  let contact = null;
  let company = null;

  if (props.params.contactId) {
    contact = state.contacts.list.get(props.params.contactId);
  }

  if (props.params.companyId) {
    company = state.companies.list.get(props.params.companyId);
  }

  return {
    contact,
    company,
    companies: state.companies.myCompanyIds,
  };
};

@connect(getData, { pushState, getMyCompanies, createContact, createCompanyContact, getOneContact, getContactsByCompany, editContact })
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
    this.props.getOneContact(this.props.params.contactId);
  }

  componentWillReceiveProps(newProps){
    this.setState({contact: newProps.contact});
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
          } else{
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
          self.props.history.replaceState(null,`/clients/${self.props.params.companyId}/jobs/${self.props.params.jobId}`);
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
    this.props.history.replaceState(null, `/clients/${companyId}/contacts/${this.state.contact.get('id')}/create`);
  }

  _handleSave(contact){
    contact.set('displayName', `${this.state.contact.get('firstName')} ${this.state.contact.get('lastName')}`);

    contact.set('sourceInfo', {
      referrer: 'hero.client',
    });

    this.setState({
      contact,
    });
    if(contact.get('id') && contact.get('id').indexOf('tmp') <= -1){
      this.props.editContact(contact);
      if(this.props.params.companyId){
        this.props.createCompanyContact(this.props.params.companyId,null,contact.get('id'));
      }

    } else {
      let companyId = this.props.company ? this.props.company.get('id') : null;
      if(this.props.params.jobId){
        //This is a candidate creation
        this.props.createCandidate(contact, self.props.params.jobId);
      } else if (companyId) {
        this.props.createCompanyContact(companyId, contact);
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

  render(){
    return (
      <ContactCreate
        {...this.props}
        contact={this.state.contact}
        closeModal={this._handleClose.bind(this)}
        onSubmit={this._handleSave.bind(this)}
        onContactChange={this._handleChange.bind(this)}
        onCompanyChange={this._handleCompanyChange.bind(this)}
        open={this.state.open}
        inline={false}  />
    );
  }
}

ContactCreateContainer.propTypes = {
  inline: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSave: React.PropTypes.func,
  open: React.PropTypes.bool,
};
